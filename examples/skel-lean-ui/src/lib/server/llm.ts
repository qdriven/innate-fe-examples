import { execSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

import { demoPaths, run, writeSkelWorkspace } from "./paths"

// LLM 通道：通过本地 Kimi CLI（kimi -p 非交互模式）把自然语言描述转成 .skel 契约。
// Kimi 未安装 / 未登录时返回 unavailable，调用方退回启发式引擎。

const SKEL_GUIDE = `你是一个契约语言 Skel 的专家。Skel 语法规则：
- 第一行必须是 domain <小写点分层名>，例如 domain demo.inventory
- 可用声明：enum X { A B }、data X { 字段名: 类型 }、actor X { via client {} }、
  service XService { for ClientActor via client  method m { input { a: 类型 } output 类型? } }
- 内建类型：int float bool string decimal binary timestamp duration localdate localtime localdatetime uuid json
- 组合：list<T>、map<K,V>、T?（可空）
- 命名法：data/enum/service/actor 用 CamelCase，成员与方法用 lowerCamelCase，
  enum 项用 SCREAMING_SNAKE
- 不支持 import（单 domain）、不支持方法体、不支持注释以外的逻辑
- 只输出一个用三反引号围栏包裹的 skel 代码块（围栏标记写 skel），不要任何解释文字`

function kimiBin(): string | null {
  const candidates = [
    process.env.KIMI_BIN,
    path.join(os.homedir(), ".kimi-code", "bin", "kimi"),
    path.join(os.homedir(), ".local", "bin", "kimi"),
    path.join(os.homedir(), ".local", "bin", "kimi-cli"),
    "/usr/local/bin/kimi",
  ].filter((p): p is string => Boolean(p))
  return candidates.find((p) => fs.existsSync(p)) ?? null
}

export interface LlmStatus {
  available: boolean
  reason?: string
  model?: string
}

export function llmStatus(): LlmStatus {
  const bin = kimiBin()
  if (!bin) {
    return { available: false, reason: "未找到本地 Kimi CLI（kimi -p 通道）" }
  }
  if (!fs.existsSync(path.join(os.homedir(), ".kimi", "credentials"))) {
    return { available: false, reason: "Kimi CLI 未登录（运行 kimi login）" }
  }
  return { available: true, model: `Kimi CLI（${bin}）` }
}

function chat(prompt: string): {
  ok: boolean
  content: string
  error?: string
} {
  const bin = kimiBin()
  if (!bin) return { ok: false, content: "", error: "kimi 不存在" }
  try {
    const output = execSync(
      `${JSON.stringify(bin)} -p ${JSON.stringify(prompt)}`,
      {
        encoding: "utf8",
        timeout: 180_000,
        stdio: ["ignore", "pipe", "pipe"],
        env: process.env,
      }
    )
    // kimi -p 的输出带 bullet 装饰与尾部 session 提示，剥掉它们。
    const cleaned = output
      .split("\n")
      .filter((line) => !line.trim().startsWith("To resume this session"))
      .join("\n")
      .replace(/^\s*•\s?/m, "")
      .trim()
    return { ok: true, content: cleaned }
  } catch (error) {
    return {
      ok: false,
      content: "",
      error:
        `${(error as { stdout?: string }).stdout ?? ""}${(error as { stderr?: string }).stderr ?? ""}`.slice(
          0,
          300
        ),
    }
  }
}

function extractSkelBlock(content: string): string | null {
  const fenced = content.match(/```(?:skel)?\s*\n([\s\S]*?)```/)
  const body = fenced ? fenced[1] : content
  if (!/^\s*domain\s+[a-z]/m.test(body)) return null
  return body.trim() + "\n"
}

export interface LlmGenerateResult {
  ok: boolean
  skel: string | null
  attempts: { round: number; ok: boolean; diagnostics: string }[]
  error?: string
}

// 生成 + 自修复：每次生成后立即用 skelc check 验证，
// 失败则把诊断喂回模型重试（总共最多 3 轮）。
export function llmGenerateSkel(
  description: string,
  checkFn: (skel: string) => { ok: boolean; message: string }
): LlmGenerateResult {
  const status = llmStatus()
  if (!status.available) {
    return { ok: false, skel: null, attempts: [], error: status.reason }
  }

  const attempts: { round: number; ok: boolean; diagnostics: string }[] = []
  let feedback = ""
  for (let round = 1; round <= 3; round++) {
    const prompt = [
      SKEL_GUIDE,
      "",
      "把下面的业务描述转成一个 Skel 契约（单 domain，包含 1-3 个 data、必要时 enum，",
      "以及一个 service 与 ClientActor）：",
      "",
      description,
      feedback
        ? `\n上一轮生成的契约未通过校验，诊断信息：\n${feedback}\n请修正这些问题。`
        : "",
    ].join("\n")
    const reply = chat(prompt)
    if (!reply.ok) {
      return {
        ok: false,
        skel: null,
        attempts,
        error: reply.error ?? "模型调用失败",
      }
    }
    const skel = extractSkelBlock(reply.content)
    if (!skel) {
      attempts.push({
        round,
        ok: false,
        diagnostics: "模型输出中没有可识别的 Skel 代码块",
      })
      feedback = "输出必须是一个以 domain 声明开头的 skel 代码块"
      continue
    }
    const check = checkFn(skel)
    attempts.push({ round, ok: check.ok, diagnostics: check.message })
    if (check.ok) {
      return { ok: true, skel, attempts }
    }
    feedback = check.message
  }
  return {
    ok: false,
    skel: null,
    attempts,
    error: "3 轮生成均未通过 skelc 校验（可手动编辑后重试）",
  }
}

// 独立的 check 助手：写入临时目录跑 skelc check。
export function quickCheck(skel: string): { ok: boolean; message: string } {
  const paths = demoPaths()
  if (!paths || !paths.ready)
    return { ok: false, message: "skel-lean-demo 未就绪" }
  const ws = fs.mkdtempSync(path.join(os.tmpdir(), "skel-llmcheck-"))
  try {
    writeSkelWorkspace(path.join(ws, "skel"), skel)
    const r = run(
      `${JSON.stringify(paths.skelc)} check --skel-in ${JSON.stringify(path.join(ws, "skel"))}`,
      paths.demo
    )
    if (r.ok && !/"valid"\s*:\s*false/.test(r.output))
      return { ok: true, message: "" }
    let message = r.output.slice(0, 400)
    try {
      const parsed = JSON.parse(r.output) as {
        diagnostics?: { message: string }[]
      }
      message =
        (parsed.diagnostics ?? [])
          .map((d) => d.message)
          .join("；")
          .slice(0, 400) || message
    } catch {
      /* 保留 raw */
    }
    return { ok: false, message }
  } finally {
    fs.rmSync(ws, { recursive: true, force: true })
  }
}
