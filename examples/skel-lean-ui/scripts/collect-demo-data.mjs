#!/usr/bin/env node
// collect-demo-data.mjs — 从 skel-lean-demo 真实流水线采集数据，
// 聚合为 src/data/demo-snapshot.json 供 skel-lean-ui 静态消费。
//
// 用法：
//   node scripts/collect-demo-data.mjs [demo目录]
//
// 定位顺序：命令行参数 > SKEL_LEAN_DEMO 环境变量 > 常见候选路径。
// 前置：demo 目录已运行过 ./run-demo.sh（需要 bin/skelc、lean/.lake 构建产物）。

import { execSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(here, "..")
const outFile = path.join(appRoot, "src", "data", "demo-snapshot.json")

const candidates = [
  process.argv[2],
  process.env.SKEL_LEAN_DEMO,
  path.resolve(
    appRoot,
    "..",
    "..",
    "..",
    "..",
    "..",
    "yorun-ai",
    "skel-lean-demo"
  ),
  "/Users/patrick/workspace/yorun-ai/skel-lean-demo",
].filter(Boolean)

const demo = candidates.find((p) => fs.existsSync(path.join(p, "run-demo.sh")))
if (!demo) {
  console.error(
    `找不到 skel-lean-demo（需要包含 run-demo.sh）。尝试过：\n  ${candidates.join("\n  ")}`
  )
  console.error("用法：node scripts/collect-demo-data.mjs <demo目录>")
  process.exit(1)
}
const leanDir = path.join(demo, "lean")

const env = {
  ...process.env,
  PATH: `${path.join(os.homedir(), ".elan", "bin")}:${process.env.PATH ?? ""}`,
  GOWORK: "off",
}

// execSync 包装：返回 {ok, output}，不抛异常。
function run(command, cwd) {
  return runWithEnv(command, cwd, {})
}

// run 的扩展版：允许注入额外环境变量（例如 LEAN_PATH）。
function runWithEnv(command, cwd, extraEnv) {
  try {
    const output = execSync(command, {
      cwd,
      encoding: "utf8",
      env: { ...env, ...extraEnv },
      stdio: ["ignore", "pipe", "pipe"],
    })
    return { ok: true, output: output ?? "" }
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` }
  }
}

function readIfExists(file, maxLines = 240) {
  const full = path.join(demo, file)
  if (!fs.existsSync(full)) return null
  const lines = fs.readFileSync(full, "utf8").split("\n")
  return {
    content: lines.slice(0, maxLines).join("\n"),
    truncated: lines.length > maxLines,
    totalLines: lines.length,
  }
}

// ── 1. 契约快照：skelc schema snapshot ─────────────────────────────
const domainDirs = [
  { name: "identity.user", dir: "skel/identity/skel" },
  { name: "commerce.order", dir: "skel/order/skel" },
]

const domains = []
for (const d of domainDirs) {
  const r = run(`./bin/skelc schema snapshot --skel-in ${d.dir}`, demo)
  if (!r.ok) {
    console.error(
      `skelc snapshot 失败（${d.name}）：请先在 demo 目录运行 ./run-demo.sh`
    )
    process.exit(1)
  }
  const snap = JSON.parse(r.output)
  domains.push({
    name: snap.domain,
    description: snap.description ?? "",
    formatVersion: snap.formatVersion,
    declarations: snap.declarations.map((decl) => ({
      name: decl.name,
      kind: decl.type,
      skelName: decl.skelName,
      pub: decl.pub === true,
      description: decl.description ?? "",
    })),
  })
}

// ── 2. Lean 证明：lake build ───────────────────────────────────────
const lakeBuild = run("lake build", leanDir)
const proveStep = {
  id: "prove",
  title: "Lean 定理 kernel 验证",
  status: lakeBuild.ok ? "passed" : "failed",
  detail: (lakeBuild.output.match(
    /Build completed successfully \(\d+ jobs\)/
  ) ?? [lakeBuild.output.trim().split("\n").pop() ?? ""])[0],
  command: "lake build",
}

// ── 3. 假定理必须被拒绝 ────────────────────────────────────────────
const bad = run("lake env lean Bad/CancelledCanPay.lean", leanDir)
const badProof = {
  rejected: !bad.ok,
  firstError: (
    bad.output.split("\n").find((l) => l.includes("error")) ?? ""
  ).trim(),
  falseGoal: (
    bad.output.split("\n").find((l) => l.includes("⊢ False")) ?? ""
  ).trim(),
}

// ── 4. Go 性质测试 ─────────────────────────────────────────────────
const goTest = run("go test ./core-go/ -v", demo)
const propertyTests = [...goTest.output.matchAll(/--- PASS: (\w+)/g)].map(
  (m) => m[1]
)
const goFailed = [...goTest.output.matchAll(/--- FAIL: (\w+)/g)].map(
  (m) => m[1]
)

// ── 5. 时刻 A：重命名方法 → BREAKING diff ──────────────────────────
const tmpA = fs.mkdtempSync(path.join(os.tmpdir(), "skel-ui-a-"))
fs.cpSync(path.join(demo, "skel", "order"), path.join(tmpA, "order"), {
  recursive: true,
})
const serviceFile = path.join(tmpA, "order", "skel", "service.skel")
fs.writeFileSync(
  serviceFile,
  fs
    .readFileSync(serviceFile, "utf8")
    .replace("method cancel {", "method cancelOrder {")
)
const diffRun = run(
  `./bin/skelc schema diff --baseline-skel-in ./skel/order/skel --skel-in ${path.join(tmpA, "order", "skel")}`,
  demo
)
const diff = diffRun.ok
  ? JSON.parse(diffRun.output)
  : { summary: { breaking: 0, dangerous: 0, compatible: 0 }, changes: [] }
fs.rmSync(tmpA, { recursive: true, force: true })

// ── 6. 时刻 B：字段改型 → 证明失效 ─────────────────────────────────
const tmpB = fs.mkdtempSync(path.join(os.tmpdir(), "skel-ui-b-"))
fs.cpSync(path.join(demo, "skel"), path.join(tmpB, "skel"), { recursive: true })
const typesFile = path.join(tmpB, "skel", "order", "skel", "types.skel")
fs.writeFileSync(
  typesFile,
  fs
    .readFileSync(typesFile, "utf8")
    .replace("unitPrice: decimal", "unitPrice: string")
)
const genB = run(
  `./bin/skel2lean --skel-in ${path.join(tmpB, "skel", "order", "skel")} --skel-import identity.user=${path.join(tmpB, "skel", "identity", "skel")} --lean-out ${path.join(tmpB, "gen")}`,
  demo
)
let momentB = {
  mutated: "unitPrice: decimal → string",
  proofError: "",
  executed: false,
}
if (genB.ok) {
  const moduleDir = path.join(tmpB, "module")
  fs.mkdirSync(moduleDir, { recursive: true })
  fs.cpSync(
    path.join(leanDir, ".lake", "build", "lib", "lean", "Gen"),
    path.join(moduleDir, "Gen"),
    { recursive: true }
  )
  const leanBuildLib = path.join(leanDir, ".lake", "build", "lib", "lean")
  // lean 要求输入位于 root 目录内且依赖模块需在 LEAN_PATH 中可解析，
  // 因此进入生成目录并显式注入 LEAN_PATH（run() 不支持额外 env）。
  const compileType = runWithEnv(
    `lean ${path.join("Gen", "Commerce", "Order", "SkelTypes.lean")} -o ${path.join(moduleDir, "Gen", "Commerce", "Order", "SkelTypes.olean")}`,
    path.join(tmpB, "gen"),
    { LEAN_PATH: leanBuildLib }
  )
  if (compileType.ok) {
    const proveB = runWithEnv(
      `lean ${path.join(demo, "lean", "Proofs", "OrderCore.lean")}`,
      demo,
      { LEAN_PATH: `${moduleDir}:${leanBuildLib}` }
    )
    momentB = {
      ...momentB,
      executed: true,
      proofError: proveB.ok
        ? "（意外：证明仍编译通过）"
        : (
            proveB.output.split("\n").find((l) => l.includes("error")) ?? ""
          ).trim(),
    }
  }
}
fs.rmSync(tmpB, { recursive: true, force: true })

// ── 7. 定理清单：解析 Proofs/OrderCore.lean ────────────────────────
const proofsSource = readIfExists("lean/Proofs/OrderCore.lean", 4000)
const RULE_GO_TEST = {
  cancel_keeps_lines: "TestCancelKeepsLines",
  cancel_preserves_total: "TestCancelPreservesTotal",
  cancelled_is_terminal: "TestCancelledIsTerminal",
  pay_paid_is_noop: "TestPayPaidIsNoop",
  step_only_from_pending: "TestStepOnlyFromPending",
  no_exit_from_cancelled: "TestNoExitFromCancelled",
}
const theorems = proofsSource
  ? [...proofsSource.content.matchAll(/\/-- (.+) -\/\ntheorem (\w+)/g)].map(
      ([, doc, name]) => ({
        name,
        ruleZh: doc.split("：")[0].split("。")[0],
        statement: doc,
        goTest: RULE_GO_TEST[name] ?? null,
        verified: lakeBuild.ok,
      })
    )
  : []

// ── 8. 源码样本（代码对照页） ──────────────────────────────────────
const sourceFiles = [
  {
    key: "skel-types",
    label: "Skel 契约",
    path: "skel/order/skel/types.skel",
    language: "skel",
  },
  {
    key: "skel-service",
    label: "Skel 服务与权限",
    path: "skel/order/skel/service.skel",
    language: "skel",
  },
  {
    key: "lean-types",
    label: "生成的 Lean 类型",
    path: "lean/Gen/Commerce/Order/SkelTypes.lean",
    language: "lean",
  },
  {
    key: "lean-proofs",
    label: "Lean 定理（手写）",
    path: "lean/Proofs/OrderCore.lean",
    language: "lean",
  },
  {
    key: "go-data",
    label: "生成的 Go 类型",
    path: "generated-go/order/data.go",
    language: "go",
    maxLines: 90,
  },
  {
    key: "go-tests",
    label: "Go 性质测试",
    path: "core-go/order_test.go",
    language: "go",
  },
]
const sources = sourceFiles
  .map((f) => {
    const content = readIfExists(f.path, f.maxLines ?? 240)
    if (!content) return null
    return { ...f, demoPath: f.path, ...content }
  })
  .filter(Boolean)

// ── 9. 流水线步骤（与 run-demo.sh 六幕对应） ───────────────────────
const checkIdentity = run(
  "./bin/skelc check --skel-in ./skel/identity/skel",
  demo
)
const checkOrder = run("./bin/skelc check --skel-in ./skel/order/skel", demo)
const totalDeclarations = domains.reduce((n, d) => n + d.declarations.length, 0)

const pipeline = [
  {
    id: "check",
    title: "① 契约校验（skelc check）",
    status: checkIdentity.ok && checkOrder.ok ? "passed" : "failed",
    detail: `${domains.length} 个限界上下文、${totalDeclarations} 个声明通过校验`,
    command: "skelc check --skel-in ./skel/order/skel",
  },
  {
    id: "generate",
    title: "② 多目标生成（Go / TS / 公开契约 / Lean）",
    status: fs.existsSync(path.join(demo, "generated-go", "order", "data.go"))
      ? "passed"
      : "unknown",
    detail:
      "Go 服务端、TypeScript 客户端、公开 Skel、Lean 类型共享同一语义模型",
    command: "skelc gen go-module | gen ts | gen skel | skel2lean",
  },
  proveStep,
  {
    id: "bad-proof",
    title: "④ 假定理被 kernel 拒绝",
    status: badProof.rejected ? "expected-failure" : "failed",
    detail: badProof.falseGoal || "「已取消订单还能支付」被化简为 False",
    command: "lake env lean Bad/CancelledCanPay.lean",
  },
  {
    id: "property-tests",
    title: "⑤ 定理 → Go 性质测试回流",
    status: goTest.ok && propertyTests.length > 0 ? "passed" : "failed",
    detail: `${propertyTests.length} 条性质测试全部通过${goFailed.length ? `，${goFailed.length} 条失败` : ""}`,
    command: "go test ./core-go/ -v",
  },
  {
    id: "evolution",
    title: "⑥ 演进守护",
    status:
      diff.summary.breaking > 0 && momentB.proofError ? "passed" : "unknown",
    detail: `重命名方法检出 ${diff.summary.breaking} 处 BREAKING；字段改型后证明立即失效`,
    command: "skelc schema diff | skel2lean + lean",
  },
]

// ── 写出 ──────────────────────────────────────────────────────────
const snapshot = {
  generatedAt: new Date().toISOString(),
  demoPath: demo,
  domains,
  pipeline,
  theorems,
  propertyTests,
  diff: {
    summary: diff.summary,
    changes: (diff.changes ?? []).map((c) => ({
      code: c.code,
      impact: c.impact,
      path: c.path ?? c.skelName ?? "",
      message: c.message ?? "",
    })),
  },
  badProof,
  momentB,
  sources,
}

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`已写入 ${outFile}`)
console.log(
  `汇总：${domains.length} domains / ${totalDeclarations} 声明 / ${theorems.length} 定理 / ${propertyTests.length} 性质测试 / BREAKING=${diff.summary.breaking}`
)
