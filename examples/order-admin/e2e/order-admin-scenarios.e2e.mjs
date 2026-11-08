/**
 * order-admin 场景 e2e 驱动：用 webshell 的 playwright 驱动壳上的 orders
 * profile，覆盖 issue #55 要求的场景面——dashboard、订单列表（CRUD 入口）、
 * 种类分类过滤、状态过滤、抽屉查看订单详情、审核流转、主题切换——逐项断言
 * 并截图。
 *
 * 运行前提（浏览器级，不进门禁）：
 *   1. 框架仓根起壳：bun innate-fe-cli/src/index.ts dev --profile orders（:4020）
 *   2. 本仓任一位置跑：node examples/order-admin/e2e/order-admin-scenarios.e2e.mjs
 *      （或 pnpm --filter @innate/domain-order-admin test:e2e）
 *
 * 环境变量：
 *   SHELL_URL           壳地址，默认 http://localhost:4020
 *   ORDER_ADMIN_E2E_OUT 截图目录，默认 <OS tmp>/order-admin-e2e
 *
 * playwright 不是本仓依赖：从框架仓 shells/webshell 的 node_modules 解析
 * （布局探测同 scripts/cli.mjs），避免 examples 仓再拉一份浏览器。
 */
import { createRequire } from "node:module"
import { mkdirSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const pkgDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(pkgDir, "..", "..", "..")

// 框架仓布局候选（同 scripts/cli.mjs）：
//   ..                          嵌套布局：本仓克隆进框架仓根 innate-fe-examples/
//   ../../base/innate-fe        本机布局
//   ../../framework/innate-fe   CI / 文档布局
const frameworkCandidates = [
  path.resolve(repoRoot, ".."),
  path.resolve(repoRoot, "..", "..", "base", "innate-fe"),
  path.resolve(repoRoot, "..", "..", "framework", "innate-fe"),
  process.env.INNATE_FE_ROOT,
].filter(Boolean)

const webshellPkg = frameworkCandidates
  .map((root) => path.join(root, "shells", "webshell", "package.json"))
  .find((file) => {
    try {
      createRequire(file).resolve("@playwright/test")
      return true
    } catch {
      return false
    }
  })

if (!webshellPkg) {
  console.error(
    "找不到 @playwright/test。请把框架仓放在本仓上一级（嵌套布局）、" +
      "../../base/innate-fe 或 ../../framework/innate-fe，或用 INNATE_FE_ROOT 指定框架仓根。"
  )
  process.exit(2)
}

const { chromium } = createRequire(webshellPkg)("@playwright/test")

const BASE = process.env.SHELL_URL || "http://localhost:4020"
const OUT = process.env.ORDER_ADMIN_E2E_OUT || path.join(tmpdir(), "order-admin-e2e")
mkdirSync(OUT, { recursive: true })

async function main() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    locale: "zh-CN",
    viewport: { width: 1440, height: 900 },
  })
  const page = await ctx.newPage()
  const results = []
  const shot = async (name) => {
    const file = path.join(OUT, `${name}.png`)
    await page.screenshot({ path: file, fullPage: false })
    results.push({ name, file })
    console.log(`[shot] ${name}`)
  }
  const check = (label, cond) => {
    results.push({ check: label, ok: Boolean(cond) })
    console.log(`${cond ? "PASS" : "FAIL"}  ${label}`)
    return Boolean(cond)
  }

  // 1. 壳首页
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" })
  check(
    "首页出现 order-admin tile",
    await page
      .getByTestId("tile-order-admin")
      .isVisible()
      .catch(() => false)
  )
  await shot("01-home")

  // 2. dashboard：KPI + 主图 + 最近订单
  await page.goto(`${BASE}/order-admin/dashboard`, { waitUntil: "networkidle" })
  check(
    "dashboard 标题「订单总览」",
    await page
      .getByRole("heading", { name: "订单总览" })
      .isVisible({ timeout: 15000 })
      .catch(() => false)
  )
  check(
    "KPI「待审核」",
    await page
      .getByText("待审核")
      .first()
      .isVisible()
      .catch(() => false)
  )
  check(
    "recharts 主图 svg",
    await page
      .locator("svg.recharts-surface")
      .first()
      .isVisible({ timeout: 15000 })
      .catch(() => false)
  )
  check(
    "最近订单含 ORD-2026-0001",
    await page
      .getByText("ORD-2026-0001")
      .first()
      .isVisible()
      .catch(() => false)
  )
  await shot("02-dashboard")

  // 3. 订单列表（CRUD 入口，9 条种子）
  await page.goto(`${BASE}/order-admin/orders`, { waitUntil: "networkidle" })
  check(
    "订单管理标题",
    await page
      .getByRole("heading", { name: "订单管理" })
      .isVisible({ timeout: 15000 })
      .catch(() => false)
  )
  check(
    "种子第 9 条 ORD-2026-0009",
    await page
      .getByText("ORD-2026-0009")
      .first()
      .isVisible()
      .catch(() => false)
  )
  await shot("03-orders-list")

  // 3b. 种类过滤：Select「全部种类」→ 标准单（nth(1)，nth(0) 是状态过滤）
  const filterBefore = await page.locator("tbody tr").count().catch(() => -1)
  await page.getByRole("combobox").nth(1).click()
  await page.getByRole("option", { name: "标准单" }).click()
  await page.waitForTimeout(400)
  const filterAfter = await page.locator("tbody tr").count().catch(() => -1)
  const kinds = await page
    .locator("tbody tr td:nth-child(5)")
    .allTextContents()
    .catch(() => [])
  check(
    `种类过滤生效（${filterBefore} → ${filterAfter} 行，且全是标准单）`,
    filterAfter > 0 &&
      filterAfter < filterBefore &&
      kinds.every((k) => k.trim() === "标准单")
  )
  await shot("04-orders-filtered")

  // 3c. 状态过滤：种类复位后再筛「草稿」（种子 3 条）
  await page.getByRole("combobox").nth(1).click()
  await page.getByRole("option", { name: "全部种类" }).click()
  await page.getByRole("combobox").nth(0).click()
  await page.getByRole("option", { name: "草稿" }).click()
  await page.waitForTimeout(400)
  const rowsDraft = await page.locator("tbody tr").count().catch(() => -1)
  check(`状态过滤：草稿 ${rowsDraft} 行（种子 3 条）`, rowsDraft === 3)

  // 4. 行操作 → 抽屉查看订单详情
  const rowMenu = page.getByRole("button", { name: "订单操作" }).first()
  if (await rowMenu.isVisible().catch(() => false)) {
    await rowMenu.click()
    await page.getByRole("menuitem", { name: /抽屉查看/ }).click()
    const dialog = page
      .getByRole("dialog")
      .filter({ hasText: /查看详情/ })
    check(
      "抽屉打开（含「查看详情」）",
      await dialog.isVisible({ timeout: 10000 }).catch(() => false)
    )
    await shot("05-order-drawer")
    await page.keyboard.press("Escape")
    await page.waitForTimeout(300)
  } else {
    check("行操作菜单可见", false)
  }

  // 5. 审核中心：待审队列 + 批准流转
  await page.goto(`${BASE}/order-admin/review`, { waitUntil: "networkidle" })
  check(
    "审核页标题",
    await page
      .getByRole("heading", { name: /审核/ })
      .first()
      .isVisible({ timeout: 15000 })
      .catch(() => false)
  )
  check(
    "待审单 ORD-2026-0002",
    await page
      .getByText("ORD-2026-0002")
      .first()
      .isVisible()
      .catch(() => false)
  )
  check(
    "批准按钮",
    await page
      .getByRole("button", { name: /批准/ })
      .first()
      .isVisible()
      .catch(() => false)
  )
  await shot("06-review")

  // 5b. 批准：断言限定待审队列卡片（避开 toast 文本），等 toast 淡出
  const approveBtn = page.getByRole("button", { name: /批准/ }).first()
  if (await approveBtn.isVisible().catch(() => false)) {
    const queue = page
      .locator("div")
      .filter({ hasText: "待审队列" })
      .locator("tbody")
      .first()
    await approveBtn.click()
    await page.waitForTimeout(1200)
    const queueHas0002 = await queue
      .getByText("ORD-2026-0002")
      .count()
      .catch(() => -1)
    check(
      `批准后 0002 离开待审队列（队列内计数 ${queueHas0002}）`,
      queueHas0002 === 0
    )
    await shot("07-review-after-approve")
  }

  // 6. 主题切换：data-theme 真变化
  await page.goto(`${BASE}/order-admin/orders`, { waitUntil: "networkidle" })
  const before = await page.evaluate(() =>
    document.documentElement.getAttribute("data-theme")
  )
  const trigger = page.getByRole("button", { name: /主题|Theme/i }).first()
  check(
    "主题切换入口可见",
    await trigger.isVisible({ timeout: 10000 }).catch(() => false)
  )
  if (await trigger.isVisible().catch(() => false)) {
    await trigger.click()
    await page.getByRole("menuitem").nth(1).click()
    await page.waitForTimeout(400)
    const after = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    )
    check(
      `主题切换生效（data-theme: ${before} → ${after}）`,
      after && after !== before
    )
    await shot("08-theme-switched")
  }

  await browser.close()

  const checks = results.filter((r) => r.check)
  const fails = checks.filter((r) => !r.ok)
  console.log(
    `\n==== 汇总：${checks.length - fails.length}/${checks.length} 通过，截图 ${results.filter((r) => r.file).length} 张 → ${OUT}`
  )
  if (fails.length) {
    console.log("失败项：" + fails.map((f) => f.check).join(" | "))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error("DRIVER ERROR:", e.message)
  process.exit(2)
})
