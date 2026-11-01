# innate-fe-examples

[innate-fe](https://github.com/variableway/innate-fe) 的示例应用。`@innate/*` 和宿主壳在框架仓，本仓用 [`plugins.registry.yaml`](plugins.registry.yaml) 的 `pages` profile 把静态示例装成一个站点。

框架检出放在 `../../base/innate-fe` 或 `../../framework/innate-fe`。

```bash
pnpm install
pnpm all
```

产物在 `deploy/`。本地查看：`pnpm preview` → http://127.0.0.1:4173

打进这个包的是 `admin-tanstack`、`order-admin`、`making`、`awesome`，以及同源 iframe `web-showcase`、`wandesk-ui`。`admin-nextjs`、`skel-lean-ui`、`sqlite-admin` 需要服务端，不在这个包里。

线上站点：https://qdriven.github.io/innate-fe-examples/

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) 会在推到 `main` 时用同一套组装发布。框架仓是私有的，Actions 需要能读取 `variableway/innate-fe` 的 secret `INNATE_FE_TOKEN`（或 `FE_TEMPLATES_TOKEN`）。当前线上页发在 `gh-pages` 分支。
