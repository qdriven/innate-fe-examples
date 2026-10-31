import fs from "node:fs"
import path from "node:path"

import type { PipelineDiagnostic, PipelineResult } from "@/lib/pipeline-types"

import {
  demoPaths,
  extractDomainName,
  filesUnder,
  makeWorkspace,
  run,
  validateSkelSourceSafety,
  writeSkelWorkspace,
} from "./paths"

// Playground 流水线：用户提交的 .skel 源 →
//   skelc check（契约校验）→ skel2lean（Lean 类型生成）→ lean 编译（kernel 检查）
//   → skelc schema snapshot（契约目录）→ skelc gen go（Go 代码预览，仅文本）
// 全程在临时工作区执行，结束后清理。
// 共享类型见 @/lib/pipeline-types（客户端也在用）。
export type { PipelineResult } from "@/lib/pipeline-types"

export function runPipeline(skelSource: string): PipelineResult {
  const result: PipelineResult = {
    ok: false,
    domain: extractDomainName(skelSource),
    safetyError: null,
    check: { ok: false, diagnostics: [], raw: "" },
    lean: { ok: false, files: [], errors: "" },
    snapshot: null,
    go: null,
    steps: [],
  }

  const safety = validateSkelSourceSafety(skelSource)
  if (safety) {
    result.safetyError = safety
    return result
  }

  const paths = demoPaths()
  if (!paths || !paths.ready) {
    result.safetyError =
      "未找到就绪的 skel-lean-demo（需要先运行 ./run-demo.sh 生成 bin/ 与 .lake 构建产物）"
    return result
  }
  const { demo, skelc, skel2lean, leanBuildLib } = paths

  const ws = makeWorkspace("skel-playground-")
  try {
    const skelDir = path.join(ws, "skel")
    writeSkelWorkspace(skelDir, skelSource)

    // ① skelc check —— 契约良构校验
    const checkRun = run(
      `${JSON.stringify(skelc)} check --skel-in ${JSON.stringify(skelDir)}`,
      demo
    )
    result.check.ok =
      checkRun.ok && !/"valid"\s*:\s*false/.test(checkRun.output)
    result.check.raw = checkRun.output
    try {
      const parsed = JSON.parse(checkRun.output) as {
        diagnostics?: PipelineDiagnostic[]
      }
      result.check.diagnostics = parsed.diagnostics ?? []
    } catch {
      // check 输出不是 JSON（命令本身失败）时保留 raw
    }
    result.steps.push({
      id: "check",
      title: "① 契约校验（skelc check）",
      status: result.check.ok ? "passed" : "failed",
      detail: result.check.ok
        ? `domain ${result.domain} 声明良构`
        : (result.check.diagnostics[0]?.message ??
          checkRun.output.slice(0, 200)),
      command: "skelc check --skel-in <playground>",
    })
    if (!result.check.ok) return result

    // ② skel2lean —— Lean 类型生成
    const leanOut = path.join(ws, "lean")
    const genRun = run(
      `${JSON.stringify(skel2lean)} --skel-in ${JSON.stringify(skelDir)} --lean-out ${JSON.stringify(leanOut)}`,
      demo
    )
    if (!genRun.ok) {
      result.lean.errors =
        genRun.output
          .split("\n")
          .find(
            (l) => l.includes("错误") || l.toLowerCase().includes("error")
          ) ?? genRun.output.slice(0, 300)
      result.steps.push({
        id: "gen-lean",
        title: "② Lean 类型生成（skel2lean）",
        status: "failed",
        detail: result.lean.errors,
        command: "skel2lean --skel-in <playground> --lean-out <ws>",
      })
      return result
    }
    const leanFiles = filesUnder(leanOut).map((file) => ({
      path: path.relative(leanOut, file),
      content: fs.readFileSync(file, "utf8"),
    }))
    result.lean.files = leanFiles
    result.steps.push({
      id: "gen-lean",
      title: "② Lean 类型生成（skel2lean）",
      status: leanFiles.length > 0 ? "passed" : "failed",
      detail: `生成 ${leanFiles.length} 个 Lean 文件（与 Go/TS 共享同一语义模型）`,
      command: "skel2lean --skel-in <playground> --lean-out <ws>",
    })

    // ③ lean 编译 —— kernel 检查生成的类型
    //    skel2lean 输出位于工作区内（域名已通过白名单校验），
    //    依赖的 Skel.Prelude 从 demo 的 .lake 构建产物解析；
    //    lean 要求输入文件位于 root（=cwd）内，因此统一以输出根为 cwd。
    const compileRuns = leanFiles.map((file) =>
      run(`lean ${JSON.stringify(file.path)}`, leanOut, {
        LEAN_PATH: leanBuildLib,
      })
    )
    const firstError = compileRuns.find((r) => !r.ok)?.output ?? ""
    result.lean.ok = compileRuns.every((r) => r.ok)
    result.lean.errors = result.lean.ok
      ? ""
      : (firstError.split("\n").find((l) => l.includes("error")) ??
        firstError.slice(0, 300))
    result.steps.push({
      id: "lean-compile",
      title: "③ Lean kernel 编译",
      status: result.lean.ok ? "passed" : "failed",
      detail: result.lean.ok
        ? "生成的 Lean 类型通过 kernel 编译检查"
        : result.lean.errors,
      command: "lean <generated>.lean（LEAN_PATH=skel-lean-demo/.lake）",
    })
    result.ok = result.check.ok && result.lean.ok

    // ④ skelc schema snapshot —— 契约目录数据
    const snapRun = run(
      `${JSON.stringify(skelc)} schema snapshot --skel-in ${JSON.stringify(skelDir)}`,
      demo
    )
    if (snapRun.ok) {
      try {
        const snap = JSON.parse(snapRun.output) as {
          domain: string
          description?: string
          declarations: {
            name: string
            type: string
            skelName: string
            pub: boolean
            description?: string
          }[]
        }
        result.snapshot = {
          domain: snap.domain,
          description: snap.description ?? "",
          declarations: snap.declarations.map((d) => ({
            name: d.name,
            kind: d.type,
            skelName: d.skelName,
            pub: d.pub === true,
            description: d.description ?? "",
          })),
        }
      } catch {
        result.snapshot = null
      }
    }

    // ⑤ skelc gen go-module —— Go 代码预览（仅文本展示，不编译）
    const goOut = path.join(ws, "go")
    const goRun = run(
      `${JSON.stringify(skelc)} gen go-module --skel-in ${JSON.stringify(skelDir)} --go-out ${JSON.stringify(goOut)} --go-module example.com/yorun/playground`,
      demo
    )
    if (goRun.ok) {
      result.go = {
        files: filesUnder(goOut)
          .filter((f) => f.endsWith(".go"))
          .map((file) => ({
            path: path.relative(goOut, file),
            content: fs
              .readFileSync(file, "utf8")
              .split("\n")
              .slice(0, 120)
              .join("\n"),
          })),
      }
    }
    result.steps.push({
      id: "gen-go",
      title: "④ Go 服务端代码生成（预览）",
      status: result.go && result.go.files.length > 0 ? "passed" : "failed",
      detail: result.go
        ? `生成 ${result.go.files.length} 个 Go 文件（data/enum/service…）`
        : "Go 生成失败",
      command: "skelc gen go-module --skel-in <playground>",
    })

    return result
  } finally {
    fs.rmSync(ws, { recursive: true, force: true })
  }
}
