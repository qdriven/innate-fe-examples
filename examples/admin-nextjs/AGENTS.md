# admin-nextjs

同一套 ToB 场景的 Next.js 对照实现（:4012），外加 Prisma + better-auth。

**进壳方式：轨道 B iframe（live）**，不是 domain。有 `app/api/**`，不能 `output: 'export'`，因此 `plugin.json` 指向 `http://localhost:4012/`。协议对接清单：[iframe 协议](https://github.com/variableway/innate-fe/blob/main/packages/plugin-protocol/README.md)。

- 对照实现：`examples/admin-tanstack`（轨道 A domain）
- 共享 UI：只 `import` from `@innate/ui`；新增 primitive 走框架仓根 `pnpm ui:add`
- 独立开发：`pnpm --filter @innate/admin-nextjs-demo dev`（:4012）
- 挂进壳：先把自己加进 `plugins.registry.yaml` 的某个 profile（本仓没有预置包含 admin-nextjs 的 profile，因为它需要服务端），再在仓根 `pnpm dev --profile <name>` → `/plugins/admin-nextjs`
- 登录：默认演示旁路；真实鉴权需 `NEXT_PUBLIC_ENABLE_REAL_AUTH=1` 且先 `db:push` + `db:seed`
