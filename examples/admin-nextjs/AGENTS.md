# admin-nextjs

同一套 ToB 场景的 Next.js 对照实现（:4012），外加 Prisma + better-auth。

**进壳方式：轨道 B iframe（live）**，不是 domain。有 `app/api/**`，不能 `output: 'export'`，因此 `plugin.json` 指向 `http://localhost:4012/`。协议对接清单：[iframe 协议](https://github.com/variableway/innate-fe/blob/main/packages/plugin-protocol/README.md)。

- 对照实现：`examples/admin-tanstack`（轨道 A domain）
- 共享 UI：只 `import` from `@innate/ui`；新增 primitive 走框架仓根 `pnpm ui:add`
- 独立开发：`pnpm --filter @innate/admin-nextjs-demo dev`（:4012）
- 挂进壳：先把自己加进 `plugins.registry.yaml` 的某个 profile（本仓没有预置包含 admin-nextjs 的 profile，因为它需要服务端），再在仓根 `pnpm dev --profile <name>` → `/plugins/admin-nextjs`
- 登录：默认演示旁路；真实鉴权需 `NEXT_PUBLIC_ENABLE_REAL_AUTH=1` 且先 `db:push` + `db:seed`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
