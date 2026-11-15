# AGENTS — innate-fe-examples

> 示例应用仓（domain / iframe）。宿主壳与 `@innate/*` 在框架仓 `innate-fe`。

## 默认启动：全部项目（examples-all）

**任何需要跑通/验收示例的任务，默认启动本仓全部项目**，不要只起单个 app。

```bash
# 在本仓根目录
pnpm install
pnpm dev          # = bun run cli dev --profile examples-all
```

- **默认 profile 就是 `examples-all`**（`plugins.registry.yaml` 的 `defaultProfile`），`pnpm dev` 不带参数即全量。
- 显式等价：`pnpm dev examples-all` / `bun run cli dev --profile examples-all`。
- **不要**用 `empty` / 单 domain / 单 iframe profile 做常规任务验收，除非任务明确只要空壳。

### examples-all 起什么

| 类型 | id | 说明 |
|------|-----|------|
| domain（壳内） | admin-tanstack, order-admin, making, awesome, sqlite-admin, edu-notes, project-management | 编译进壳接缝 |
| 静态 iframe | web-showcase, wandesk-ui, kids-playground-ui | 缺产物时自动 `prepare`/build |
| live iframe | admin-nextjs **:4012**, skel-lean-ui **:4011** | dev plan 按 plugin.json 自动拉起 |
| 宿主壳 | webshell **:4020** | `shell:` 指向框架仓壳 |

### 启动后自检

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4020/          # 壳
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4012/          # admin-nextjs（可能 307→/dashboard）
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4011/          # skel-lean-ui
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4020/admin-tanstack/
```

- 端口被占（EADDRINUSE）：先停旧进程再起，或确认旧实例仍是本 profile。
- live iframe 没起：单独 `pnpm --filter @innate/admin-nextjs-demo dev`、`pnpm --filter @innate/skel-lean-ui dev`。
- 静态 iframe 缺 `public/plugins/<id>/index.html`：`bun scripts/cli.mjs prepare --profile examples-all`。

### 任务中的用法约定

1. **改 UI / 场景 / 组件统一**：起 examples-all，在壳 `:4020` 打开对应插件页验收。
2. **改 admin-nextjs / skel-lean-ui**：必须确认 :4012 / :4011 已起，否则壳内 iframe 失败态。
3. **只改框架 packages 而不依赖示例时**：仍建议起全量，避免接缝/联动回归漏测。
4. **CI / 门禁**：本仓 `pnpm typecheck && pnpm lint && pnpm test && pnpm all`；起服务不替代门禁。

## 注册表

- 事实源：[`plugins.registry.yaml`](plugins.registry.yaml)
- `defaultProfile: examples-all`；`shell:` 指向框架 `shells/webshell`（相对本仓 `../../framework/innate-fe/...`）
- 新增插件：写进对应 profile 的 `domains` / `iframes`；静态 iframe 优先补 `buildCommand: pnpm build`（避免在框架根 `pnpm --filter` 找不到包）

## 跨仓

- 框架仓门禁与收口：`fe-overview` / `pnpm ci:check` / `pnpm task:merge`（见框架 `AGENTS.md`）
- 本仓推 `main` 会触发 Pages deploy；本地全量构建 `pnpm all`

## 目录速查

```
examples/<id>/     # 各示例源码
domains/           # gen 打包面（勿手改）
plugins.registry.yaml
scripts/cli.mjs    # scan/gen/dev/prepare/…
```
