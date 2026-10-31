// 离线自然语言 → Skel 生成器（无 LLM 依赖的兜底引擎）。
//
// 策略：剥掉「XX系统：」前缀后按句扫描「实体 有/（ 字段…」句式；
// 实体名取短语中的英文 token（如「商品 Item」→ Item）或内置词典；
// 中文字段经内置词典翻译成 lowerCamelCase 英文并附带类型推断；
// 动词映射为 service 方法。识别不到的部分给出最小可编译模板 + notes，
// 用户可在编辑器里继续修改——这一步的目标是合理起点而非完美建模。

// 中文字段 → {英文名, 类型}。类型缺省 string。
const FIELD_DICTIONARY: Record<string, { name: string; type?: string }> = {
  名称: { name: "name" },
  书名: { name: "title" },
  姓名: { name: "name" },
  作者: { name: "author" },
  单价: { name: "unitPrice", type: "decimal" },
  价格: { name: "price", type: "decimal" },
  金额: { name: "amount", type: "decimal" },
  数量: { name: "quantity", type: "int" },
  库存数量: { name: "quantity", type: "int" },
  库存: { name: "stock", type: "int" },
  入库时间: { name: "storedAt", type: "timestamp" },
  开始时间: { name: "startedAt", type: "timestamp" },
  结束时间: { name: "endedAt", type: "timestamp" },
  借出时间: { name: "borrowedAt", type: "timestamp" },
  归还时间: { name: "returnedAt", type: "timestamp" },
  容纳人数: { name: "capacity", type: "int" },
  楼层: { name: "floor", type: "int" },
  预订人: { name: "bookerId", type: "uuid" },
  是否可借: { name: "available", type: "bool" },
  时间: { name: "occurredAt", type: "timestamp" },
  状态: { name: "status" },
  isbn: { name: "isbn" },
}

// 中文实体 → 英文名（短语中没有英文 token 时使用）。
const ENTITY_DICTIONARY: Record<string, string> = {
  商品: "Item",
  图书: "Book",
  读者: "Reader",
  会议室: "Room",
  预订: "Reservation",
  借阅记录: "BorrowRecord",
  记录: "Record",
}

// 动词 → service 方法。
const VERB_DICTIONARY: { pattern: RegExp; method: string }[] = [
  { pattern: /创建|新增|添加|录入/, method: "create" },
  { pattern: /查询|搜索|列表|获取|查看/, method: "list" },
  { pattern: /更新|修改|编辑|调整/, method: "update" },
  { pattern: /删除|移除|下架/, method: "delete" },
  { pattern: /取消/, method: "cancel" },
  { pattern: /借出?|借阅/, method: "borrow" },
  { pattern: /归还|还书/, method: "return" },
  { pattern: /预订|预约| booking|订/, method: "book" },
]

const FIELD_TYPE_RULES: { pattern: RegExp; type: string }[] = [
  {
    pattern: /(数量|库存|次数|count|qty|quantity|capacity|floor|limit)/i,
    type: "int",
  },
  { pattern: /(金额|价格|单价|费用|price|amount|cost)/i, type: "decimal" },
  { pattern: /(时间|日期|时刻|at$|date|created|updated)/i, type: "timestamp" },
  { pattern: /(是否|开启|启用|available|enabled|active|paid)/i, type: "bool" },
  { pattern: /(时长|有效期|duration|ttl|timeout)/i, type: "duration" },
  { pattern: /(图片|附件|文件|内容|blob|binary|image|file)/i, type: "binary" },
]

function camel(input: string): string {
  const parts = input
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
  if (parts.length === 0) return ""
  return (
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join("")
  )
}

function pascal(input: string): string {
  const c = camel(input)
  return c ? c[0].toUpperCase() + c.slice(1) : ""
}

// 从中英混合短语里取英文标识符 token（「商品 Item」→ Item）。
function englishToken(phrase: string): string | null {
  const tokens = phrase.match(/[A-Za-z][A-Za-z0-9]{1,30}/g)
  return tokens ? tokens[0] : null
}

interface FieldDraft {
  name: string
  type: string
}

function translateField(raw: string): FieldDraft | null {
  const cleaned = raw.replace(/[的了吗呢]/g, "").trim()
  if (!cleaned) return null
  // 精确词典命中（含 isbn 等英文键）
  if (FIELD_DICTIONARY[cleaned]) {
    const entry = FIELD_DICTIONARY[cleaned]
    return { name: entry.name, type: entry.type ?? "string" }
  }
  // 英文字段：按类型规则推断
  if (/^[A-Za-z][A-Za-z0-9]*$/.test(cleaned)) {
    if (/^id$/i.test(cleaned)) return { name: "id", type: "uuid" }
    for (const rule of FIELD_TYPE_RULES) {
      if (rule.pattern.test(cleaned))
        return { name: camel(cleaned), type: rule.type }
    }
    return { name: camel(cleaned), type: "string" }
  }
  // 中文但不在词典：无英文词可用，跳过（由 notes 提示）
  return null
}

function entityNameFrom(phrase: string): string | null {
  const token = englishToken(phrase)
  if (token) return pascal(token)
  for (const [zh, en] of Object.entries(ENTITY_DICTIONARY)) {
    if (phrase.includes(zh)) return en
  }
  return null
}

export interface HeuristicResult {
  skel: string
  notes: string[]
}

export function heuristicSkel(
  description: string,
  domainHint?: string
): HeuristicResult {
  const notes: string[] = []
  const text = description.trim()

  // 剥「XX系统：」式前缀；冒号前若有英文点分词则当领域名
  let content = text
  let domain = domainHint?.trim() ?? ""
  const colonSplit = text.split(/[：:]/)
  if (colonSplit.length >= 2) {
    const head = colonSplit[0]
    const dotted = head.match(/[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+/)
    if (dotted) domain = dotted[0]
    content = colonSplit.slice(1).join("：")
  }
  if (!domain) {
    const anyDotted = text.match(/[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+/)
    if (anyDotted) domain = anyDotted[0]
  }
  if (!domain) {
    domain = "demo.playground"
    notes.push("未识别出领域名，默认 demo.playground（可编辑第一行）")
  }

  const sentences = content
    .split(/[。；;，,]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const entities: { name: string; fields: FieldDraft[] }[] = []
  const seenEntities = new Set<string>()
  let skippedFields: string[] = []

  for (const sentence of sentences) {
    // 句式：「实体短语（字段…）」或「实体短语 有 字段…」
    const match = sentence.match(
      /^(?:一个?|每种?|每类?)?(.{1,16}?)\s*(?:（([^）)]+)）|有\s*(.+)$)/
    )
    if (!match) continue
    const entityPhrase = match[1].replace(/^(的|以及|和)/, "").trim()
    const fieldBlob = match[2] ?? match[3] ?? ""
    const entityName = entityNameFrom(entityPhrase)
    if (!entityName || seenEntities.has(entityName)) continue
    seenEntities.add(entityName)

    const rawFields = fieldBlob
      .split(/[、和\s]+/)
      .map((f) => f.trim())
      .filter(Boolean)
    const fields: FieldDraft[] = []
    for (const raw of rawFields) {
      const translated = translateField(raw)
      if (translated) fields.push(translated)
      else if (/[\u4e00-\u9fff]/.test(raw))
        skippedFields.push(`${entityName}.${raw}`)
    }
    if (fields.length === 0 || !fields.some((f) => f.name === "id")) {
      fields.unshift({ name: "id", type: "uuid" })
    }
    entities.push({ name: entityName, fields })
  }

  if (entities.length === 0) {
    entities.push({
      name: "Item",
      fields: [
        { name: "id", type: "uuid" },
        { name: "name", type: "string" },
        { name: "status", type: "string" },
      ],
    })
    notes.push("未识别出实体，使用最小模板 Item（请编辑补充）")
  }
  if (skippedFields.length > 0) {
    notes.push(
      `这些字段没有可用的英文命名，已跳过（可手动补回）：${skippedFields.join("、")}`
    )
  }

  const methods: string[] = []
  for (const rule of VERB_DICTIONARY) {
    if (rule.pattern.test(content) && !methods.includes(rule.method))
      methods.push(rule.method)
  }
  if (methods.length === 0) {
    methods.push("list")
    notes.push("未识别出操作动词，默认提供 list 方法")
  }

  const first = entities[0]
  const methodBlocks = methods.map((m) => {
    if (m === "create") {
      return [
        "    method create {",
        "        input {",
        "            name: string",
        "        }",
        `        output ${first.name}`,
        "    }",
      ].join("\n")
    }
    if (m === "list") {
      return [
        "    method list {",
        "        input {",
        "            pageSize: int",
        "        }",
        `        output list<${first.name}>`,
        "    }",
      ].join("\n")
    }
    return [
      `    method ${m} {`,
      "        input {",
      `            id: uuid`,
      "        }",
      `        output ${first.name}?`,
      "    }",
    ].join("\n")
  })

  const skel = [
    `domain ${domain}`,
    "",
    ...entities.map((e) =>
      [
        `data ${e.name} {`,
        ...e.fields.map((f) => `    ${f.name}: ${f.type}`),
        "}",
        "",
      ].join("\n")
    ),
    `service ${first.name}Service {`,
    "    for ClientActor via client",
    "",
    ...methodBlocks,
    "}",
    "",
    "actor ClientActor {",
    "    via client {}",
    "}",
    "",
  ].join("\n")

  return { skel, notes }
}
