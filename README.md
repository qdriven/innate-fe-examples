# innate-fe-examples

[innate-fe](https://github.com/variableway/innate-fe) 的示例应用。`@innate/*` 和宿主壳在框架仓，本仓用 [`plugins.registry.yaml`](plugins.registry.yaml) 的 `pages` profile 把静态示例装成一个站点。

框架检出放在 `../../base/innate-fe` 或 `../../framework/innate-fe`。

> **Agent / 开发约定**：任务默认启动 **全部示例**（profile = `examples-all`），见 [AGENTS.md](./AGENTS.md)。

```bash
pnpm install
pnpm all
```

产物在 `deploy/`。本地查看：`pnpm preview` → http://127.0.0.1:4173

## 本地启动全部项目（默认）

日常开发与验收用 **examples-all**（也是 `defaultProfile`）：

```bash
pnpm dev    # = bun run cli dev --profile examples-all
```

会同时拉起：

- **壳** webshell → http://localhost:4020  
- **live iframe**：admin-nextjs → :4012 · skel-lean-ui → :4011  
- **domain ×7**（admin-tanstack / order-admin / making / awesome / sqlite-admin / edu-notes / project-management）编译进壳  
- **静态 iframe**（web-showcase / wandesk-ui / kids-playground-ui）缺产物时自动 prepare  

不要用 `empty` 或单插件 profile 做常规验收，除非任务明确只要空壳。端口占用、prepare、自检命令见 [AGENTS.md](./AGENTS.md)。

打进这个包的是 `admin-tanstack`、`order-admin`、`making`、`awesome`，以及同源 iframe `web-showcase`、`wandesk-ui`。`admin-nextjs`、`skel-lean-ui`、`sqlite-admin` 需要服务端，不在这个包里。

线上站点：https://qdriven.github.io/innate-fe-examples/

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) 会在推到 `main` 时用同一套组装发布。框架仓是私有的，Actions 需要能读取 `variableway/innate-fe` 的 secret `INNATE_FE_TOKEN`（或 `FE_TEMPLATES_TOKEN`）。当前线上页发在 `gh-pages` 分支。本地打这个 Pages 包（`PUBLIC_PATH=/innate-fe-examples/`，并写入 `404.html` 与 `.nojekyll`）：`bun scripts/assemble-site.mjs pages`。不要设 `GITHUB_PAGES=true`。

## Agent 技能

本仓不放技能副本；在框架仓根把技能装到本仓（用绝对路径最稳）：

```bash
pnpm --filter @innate/fe-skillkits skills:install -- --target <本仓绝对路径>/.agents/skills --clean --overwrite
```

技能源在框架仓 `packages/skills-kit/skills/`。跨仓路径、命令与门禁见 `fe-overview/references/repo-map.md`：框架仓用 `pnpm ci:check`，本仓用 `pnpm typecheck && pnpm lint && pnpm test && pnpm all`；e2e 需要把本仓 registry 覆盖进框架壳后跑。
