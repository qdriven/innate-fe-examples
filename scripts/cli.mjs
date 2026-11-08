/**
 * 调用 innate-fe-cli。优先用旁边检出的源码，其次用 PATH 里的 binary。
 *
 *   ..                          嵌套布局：本仓克隆进框架仓根 innate-fe-examples/
 *   ../../base/innate-fe        本机布局
 *   ../../framework/innate-fe   CI / 文档布局
 */
import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const args = process.argv.slice(2)
const sources = [
  "../innate-fe-cli/src/index.ts",
  "../../base/innate-fe/innate-fe-cli/src/index.ts",
  "../../framework/innate-fe/innate-fe-cli/src/index.ts",
]

for (const rel of sources) {
  const file = resolve(root, rel)
  if (!existsSync(file)) continue
  const result = spawnSync("bun", [file, ...args], { stdio: "inherit" })
  process.exit(result.status ?? 1)
}

const installed = spawnSync("innate-fe-cli", args, { stdio: "inherit" })
if (installed.error) {
  console.error(
    "找不到 innate-fe-cli。请把框架仓放在本仓上一级（嵌套布局）、../../base/innate-fe 或 ../../framework/innate-fe，或把 innate-fe-cli 装进 PATH。"
  )
  process.exit(1)
}
process.exit(installed.status ?? 1)
