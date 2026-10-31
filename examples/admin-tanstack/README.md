# @innate/domain-admin-tanstack

原 `domains/admin-tanstack`（TanStack Start 独立 app），现为轨道 A **就地 domain**：源码在 `domains/admin-tanstack/`，`src/index.ts` 导出 `webDomain`。

- 包名：`@innate/domain-admin-tanstack`
- 挂载：宿主 `app` outlet，路径前缀 `/admin-tanstack`
- UI：primitive 走 `@innate/ui`；页面壳走 `@innate/admin-composites/spec-page-shell`
- 场景：`src/components/scenes/*-scene-view.tsx` + `@innate/scene-catalog`

```bash
# 挂进 webshell（不改壳源码）
bun tools/innate-fe-cli/src/index.ts dev --profile admin
# → http://localhost:4020  侧栏出现 Admin，首页有 tile

# 独立预览（最小宿主，无 webshell 壳）
pnpm --filter @innate/domain-admin-tanstack dev:standalone
# → http://localhost:4015
```

操作说明：[用例 2a 独立跑](../../docs/use-cases/02a-domain-standalone.md) · [用例 2b 打进壳](../../docs/use-cases/02b-domain-in-shell.md)。

## 路由（均带 `/admin-tanstack` 前缀）

`/admin-tanstack` 重定向到 `/scenes`。其余：`/scenes`、`/core`、`/patterns`、`/settings`、`/dashboard`（重定向 `/specific/dashboard`）、`/docs/$sceneId`、`/domain-packs`、`/governance`、`/help`、`/specific/dashboard`、`/specific/$sceneId`、`/workspace-list`、`/record-detail`、`/reporting-wizard`、`/approval-review`、`/integration-health`、`/policy-settings`。
