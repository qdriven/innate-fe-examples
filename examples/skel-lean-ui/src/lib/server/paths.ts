import { execSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

// 服务端运行环境：定位 skel-lean-demo、二进制与 Lean 工具链。
// Next.js API 路由默认运行在 Node runtime，可以直接使用 child_process。

const APP_ROOT = process.cwd()

const DEMO_CANDIDATES = [
  process.env.SKEL_LEAN_DEMO,
  path.resolve(
    APP_ROOT,
    "..",
    "..",
    "..",
    "..",
    "..",
    "yorun-ai",
    "skel-lean-demo"
  ),
  "/Users/patrick/workspace/yorun-ai/skel-lean-demo",
].filter((p): p is string => Boolean(p))

export function findDemoDir(): string | null {
  return (
    DEMO_CANDIDATES.find((p) => fs.existsSync(path.join(p, "run-demo.sh"))) ??
    null
  )
}

export function demoPaths() {
  const demo = findDemoDir()
  if (!demo) return null
  const skelc = path.join(demo, "bin", "skelc")
  const skel2lean = path.join(demo, "bin", "skel2lean")
  const leanBuildLib = path.join(demo, "lean", ".lake", "build", "lib", "lean")
  if (
    !fs.existsSync(skelc) ||
    !fs.existsSync(skel2lean) ||
    !fs.existsSync(leanBuildLib)
  ) {
    return { demo, ready: false as const }
  }
  return { demo, ready: true as const, skelc, skel2lean, leanBuildLib }
}

export function execEnv(extra: Record<string, string> = {}) {
  return {
    ...process.env,
    PATH: `${path.join(os.homedir(), ".elan", "bin")}:/usr/local/bin:${process.env.PATH ?? ""}`,
    ...extra,
  }
}

// execSync 包装：返回 {ok, output}，不抛异常。
export function run(
  command: string,
  cwd: string,
  extraEnv: Record<string, string> = {}
): { ok: boolean; output: string } {
  try {
    const output = execSync(command, {
      cwd,
      encoding: "utf8",
      env: execEnv(extraEnv),
      stdio: ["ignore", "pipe", "pipe"],
    })
    return { ok: true, output: output ?? "" }
  } catch (error) {
    return {
      ok: false,
      output: `${(error as { stdout?: string }).stdout ?? ""}${(error as { stderr?: string }).stderr ?? ""}`,
    }
  }
}

export function makeWorkspace(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix))
}

// Skel 域名白名单：小写字母开头的点分层标识符。
// skel2lean 会把域名映射成输出路径，这里先验后跑，防止路径穿越。
export const DOMAIN_NAME_PATTERN = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/

export function extractDomainName(skelSource: string): string | null {
  const match = skelSource.match(/^\s*domain\s+([A-Za-z0-9_.]+)\s*$/m)
  return match ? match[1] : null
}

export function validateSkelSourceSafety(skelSource: string): string | null {
  if (/\bimport\b/.test(skelSource)) {
    return "Playground 当前支持单 domain 契约：请移除 import 声明（跨 domain 组合留给基线演示）"
  }
  const domain = extractDomainName(skelSource)
  if (!domain) {
    return "缺少 domain 声明（第一行应为 domain <name>）"
  }
  if (!DOMAIN_NAME_PATTERN.test(domain)) {
    return `domain 名称 ${domain} 不合法（应为小写字母开头的点分层标识符，例如 demo.inventory）`
  }
  return null
}

// 确认目录内的所有文件都真实位于 base 内（realpath 防穿越）。
export function filesUnder(base: string): string[] {
  const result: string[] = []
  const realBase = fs.realpathSync(base)
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (fs.realpathSync(full).startsWith(realBase + path.sep))
        result.push(full)
    }
  }
  walk(base)
  return result
}

// 把单文件 Skel 源写成一个 skelc 目录工作区：目录模式强制要求 domain.skel
// 只含 domain 声明，其余内容（同样以 domain 行开头）放 contract.skel。
export function writeSkelWorkspace(skelDir: string, skelSource: string): void {
  fs.mkdirSync(skelDir, { recursive: true })
  const lines = skelSource.split("\n")
  const domainLineIndex = lines.findIndex((l) => /^\s*domain\s+/.test(l))
  if (domainLineIndex < 0) {
    fs.writeFileSync(path.join(skelDir, "contract.skel"), skelSource)
    return
  }
  // domain.skel：domain 行 + 其上方紧邻的 @desc 行（若有）
  let start = domainLineIndex
  if (start > 0 && /^\s*@desc\(/.test(lines[start - 1])) start -= 1
  fs.writeFileSync(
    path.join(skelDir, "domain.skel"),
    `${lines.slice(start, domainLineIndex + 1).join("\n")}\n`
  )
  fs.writeFileSync(path.join(skelDir, "contract.skel"), skelSource)
}
