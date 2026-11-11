#!/usr/bin/env node
/**
 * 批量截图 web-showcase 组件 demo 页（修复后走查用）。
 * 用 taste-skill 的 shoot.mjs 逐页截图，串行执行（一次一个 Chrome）。
 *
 *   node shoot-components.mjs [--out dir] [--only slug,slug]
 */
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(here, "../src/app/components")
const routesText = readFileSync(resolve(appDir, "routes.ts"), "utf8")

// 从 routes.ts 提取 slug 清单（与 [slug]/page.tsx 的静态注册一致）
const slugs = [...routesText.matchAll(/slug: "([a-z0-9-]+)"/g)].map(
  (match) => match[1]
)
const only = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1].split(",")
  : null
const targets = only ? slugs.filter((s) => only.includes(s)) : slugs

const outDir = resolve(here, "shots")
mkdirSync(outDir, { recursive: true })

const shootFallback =
  "D:/innate-workspace/refine-factory/skills/innate-skills/references/taste-skill/skills/taste-skill/scripts/shoot.mjs"
const shootScript = existsSync(shootFallback)
  ? shootFallback
  : resolve(here, "../../../../../../refine-factory/skills/innate-skills/references/taste-skill/skills/taste-skill/scripts/shoot.mjs")

const base = "http://localhost:4003/components"
const results = []
for (const slug of targets) {
  const profile = `C:/Users/anyda/AppData/Local/Temp/opencode/showcase-walk/${slug}`
  const out = `${outDir}/${slug}.png`
  const run = spawnSync(
    "node",
    [
      shootScript,
      "--url",
      `${base}/${slug}`,
      "--w",
      "1280",
      "--h",
      "1600",
      "--out",
      out,
      "--profile",
      profile,
      "--no-tiles",
    ],
    { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", timeout: 120000 }
  )
  const ok = run.status === 0 && existsSync(out)
  results.push({ slug, ok, note: ok ? "" : (run.stderr || "").trim().slice(0, 120) })
  console.log(`${ok ? "ok  " : "FAIL"} ${slug}`)
}
writeFileSync(resolve(outDir, "walk-results.json"), JSON.stringify({ base, at: new Date().toISOString(), results }, null, 1))
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} ok -> ${outDir}`)
if (failed.length) {
  console.log("failed:", failed.map((f) => f.slug).join(", "))
  process.exit(1)
}
