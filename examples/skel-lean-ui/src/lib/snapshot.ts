// demo-snapshot.json 由 scripts/collect-demo-data.mjs 从 skel-lean-demo
// 真实流水线采集生成；本模块提供共享类型与面向产品角色的翻译层。
// 运行时活动快照的读取走 @/lib/view（服务端）。

export type PipelineStatus =
  | "passed"
  | "failed"
  | "expected-failure"
  | "unknown"
export type Impact = "BREAKING" | "DANGEROUS" | "COMPATIBLE"

export interface Declaration {
  name: string
  kind: string
  skelName: string
  pub: boolean
  description: string
}

export interface DomainSnapshot {
  name: string
  description: string
  formatVersion: number
  declarations: Declaration[]
}

export interface PipelineStep {
  id: string
  title: string
  status: PipelineStatus
  detail: string
  command: string
}

export interface Theorem {
  name: string
  ruleZh: string
  statement: string
  goTest: string | null
  verified: boolean
}

export interface DiffChange {
  code: string
  impact: Impact
  path: string
  message: string
}

export interface SourceFile {
  key: string
  label: string
  path: string
  language: string
  content: string
  truncated: boolean
  totalLines: number
}

export interface DemoSnapshot {
  generatedAt: string
  demoPath: string
  domains: DomainSnapshot[]
  pipeline: PipelineStep[]
  theorems: Theorem[]
  propertyTests: string[]
  diff: {
    summary: { breaking: number; dangerous: number; compatible: number }
    changes: DiffChange[]
  }
  badProof: { rejected: boolean; firstError: string; falseGoal: string }
  momentB: { mutated: string; proofError: string; executed: boolean }
  sources: SourceFile[]
}

// ── 面向产品角色的话术翻译 ────────────────────────────────────────

/** impact 级别 → 业务后果（给 PM 看的版本）。 */
export const PM_IMPACT: Record<Impact, string> = {
  BREAKING: "所有使用旧契约的客户端必须发版升级，合作伙伴需要重新联调",
  DANGEROUS: "老系统遇到新情况会按未知值处理，需要先确认降级策略",
  COMPATIBLE: "对使用方无感，无需协调升级",
}

/** 变更 code → 触发它的那一下编辑。 */
export const PM_ACTION: Record<string, string> = {
  "service.method.removed": "把取消订单的方法 cancel 改名为 cancelOrder",
  "declaration.removed": "删除了一个对外公开的类型",
  "member.type.changed": "修改了某个字段的类型",
  "member.added": "新增了必填字段",
  "enum.item.added": "枚举新增了一个取值",
}

export function pmAction(code: string): string {
  // 精确命中或按前缀命中（例如 method.argument.type.changed）。
  if (PM_ACTION[code]) return PM_ACTION[code]
  const prefix = Object.keys(PM_ACTION).find((k) =>
    code.startsWith(k.split(".")[0])
  )
  return prefix ? PM_ACTION[prefix] : "契约发生了一处变更"
}

/** pipeline 状态 → 展示文案。 */
export const STATUS_LABEL: Record<PipelineStatus, string> = {
  passed: "通过",
  failed: "失败",
  "expected-failure": "按预期被拒绝",
  unknown: "未采集",
}
