// Playground 流水线的共享类型（客户端与服务端都可用，不含 Node 依赖）。

export interface PipelineDiagnostic {
  severity: string
  code: string
  message: string
}

export interface PipelineStep {
  id: string
  title: string
  status: "passed" | "failed"
  detail: string
  command: string
}

export interface PipelineResult {
  ok: boolean
  domain: string | null
  safetyError: string | null
  check: { ok: boolean; diagnostics: PipelineDiagnostic[]; raw: string }
  lean: {
    ok: boolean
    files: { path: string; content: string }[]
    errors: string
  }
  snapshot: {
    domain: string
    description: string
    declarations: {
      name: string
      kind: string
      skelName: string
      pub: boolean
      description: string
    }[]
  } | null
  go: { files: { path: string; content: string }[] } | null
  steps: PipelineStep[]
}
