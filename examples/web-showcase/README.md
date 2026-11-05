# web-showcase

`@innate/ui` primitive 的 live 展示 app（Next.js，端口 4003）。**静态导出**，可部署为 GitHub Pages 站点，也可作为 Web Shell 的 **iframe 插件**。

```bash
pnpm --filter @innate/web-showcase dev    # http://localhost:4003
pnpm --filter @innate/web-showcase build  # 产物 → examples/web-showcase/dist/
```

## 接入 Web Shell（iframe）

一步一步说明：[apps in shell](https://github.com/variableway/innate-fe/blob/main/docs/use-cases/02-apps-in-shell.md)

```bash
# 终端 1：本 app
pnpm --filter @innate/web-showcase dev

# 终端 2：壳（examples 仓根，profile iframe-two 含 web-showcase）
pnpm dev --profile iframe-two
# → http://localhost:4020/plugins/web-showcase
```

静态导入进壳时用 `PLUGIN_BASE_PATH=/plugins/web-showcase` 再 build，然后 `innate-fe-cli import`（同上文档路径 B）。

## 路由与内容

- 每个 primitive 一个 `<Slot>Demo`，位于 `src/components/blocks/`
- 路由 `/components/<slug>`，注册在 `src/app/components/routes.ts`
- 除 primitive 展示外，还托管 `/blocks`、`/pages`、`/scenes`、`/theme-editor`、`/agent-quick-index` 路由（`src/app/` 下），对应 `src/components/{composites,pages,scenes}`、`three-column-shell.tsx`、`theme-selector.tsx`（后者只是 `@innate/ui` `ThemeSelector` 的 app 专属 wrapper，补 `custom` variant 与 Theme Editor 入口）
- 同时消费 `@innate/scene-catalog` 与 `@innate/admin-composites`（如 `src/components/composites/page-container-showcase.tsx`、`scene-blocks-showcase.tsx`）
- 新增 primitive（含补 demo）的完整流程见 [packages/ui/README.md](https://github.com/variableway/innate-fe/blob/main/packages/ui/README.md)

## 静态部署（GitHub Pages）

`next.config.js` 已配置 `output: 'export'`。GitHub Actions 在 `main` 分支相关变更时自动构建并发布：

- Workflow：[`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml)
- 线上 URL：<https://qdriven.github.io/innate-fe-examples/>
- 构建时由 `deploy-pages.yml` 覆盖到框架仓、按 `pages` profile 组装（`basePath` + `assetPrefix` 由 workflow 注入）

本地预览静态产物：

```bash
pnpm --filter @innate/web-showcase build
npx serve examples/web-showcase/dist
```

本地 dev 不使用 `basePath`；仅在 CI 部署时启用子路径前缀。
