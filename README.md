# innate-fe-examples

[innate-fe](https://github.com/variableway/innate-fe) 框架的**示例应用集合**：把框架的 `@innate/*` 包（UI primitive、domain 契约、ToB 场景资产）用两种轨道各跑一遍，作为参考实现与集成样板。

示例分两条轨道进同一个壳（webshell）：

| 轨道 | 形态 | 进壳方式 | 适合 | 现成示例 |
| ---- | ---- | ---- | ---- | ---- |
| **A · domain** | TanStack，与壳同一棵 React 树 | 源码打进宿主包，路由挂壳 outlet | 与壳共享路由 / 状态 / 设计语言 | `admin-tanstack` `feed` `making` `cheatsheets` `awesome` `order-admin` |
| **B · iframe** | Next.js / Vite，自带打包器 | 壳在 `/plugins/<id>` 嵌 iframe | 独立发布、独立技术栈 | `web-showcase` `admin-nextjs` `wandesk-ui` `skel-lean-ui` |

> 本仓只放示例应用源码。`@innate/*` 包、宿主壳 `shells/webshell`、打包 CLI `innate-fe-cli` 都在 [innate-fe 框架仓](https://github.com/variableway/innate-fe)——**构建依赖框架**（见下文「构建方式」）。

## 项目索引

| 示例 | 包名 | 轨道 | 端口 | 说明 |
| ---- | ---- | ---- | ---- | ---- |
| [`admin-tanstack`](examples/admin-tanstack) | `@innate/domain-admin-tanstack` | A domain | :4015 | 7 个 ToB 场景的 TanStack 参考实现，场景规范 + catalog + mock 全用上 |
| [`order-admin`](examples/order-admin) | `@innate/domain-order-admin` | A domain | — | 订单 CRUD 黄金样例：typed service + 三态 + 列表筛选排序分页 + 批量取消 + 表单校验 |
| [`feed`](examples/feed) | `@innate/domain-feed` | A domain | :4021 | Feed 模块，最小 domain 骨架（只消费 `@innate/ui`） |
| [`making`](examples/making) | `@innate/domain-making` | A domain | :4018 | Making 模块，同 feed 形态 |
| [`cheatsheets`](examples/cheatsheets) | `@innate/domain-cheatsheets` | A domain | :4017 | Cheatsheets 模块，同 feed 形态 |
| [`awesome`](examples/awesome) | `@innate/domain-awesome` | A domain | :4022 | Awesome 模块，同 feed 形态 |
| [`web-showcase`](examples/web-showcase) | `@innate/web-showcase` | B iframe | :4003 | `@innate/ui` primitive 的 live 展示（Next.js，静态导出，可上 GitHub Pages） |
| [`admin-nextjs`](examples/admin-nextjs) | `@innate/admin-nextjs-demo` | B iframe | :4012 | 同一套 ToB 场景的 Next.js 对照实现 + Prisma + better-auth |
| [`wandesk-ui`](examples/wandesk-ui) | `@innate/wandesk-ui` | B iframe | :4010 | 桌面 OS 风格参考 app（Vite + Tauri），不依赖 `@innate/ui` |
| [`skel-lean-ui`](examples/skel-lean-ui) | `@innate/skel-lean-ui` | B iframe | :4010 | Skel × Lean 契约验证台（Next.js），只用 `@innate/ui` |

每个示例目录下的 `README.md` 是该应用的详细说明（含框架时代的相对链接，指向框架仓的 `docs/`、`packages/`）。

## 构建方式

构建遵循 [innate-fe-cli](https://github.com/variableway/innate-fe/tree/main/innate-fe-cli) 的编排：`scan → gen → prepare → build → assemble → preview`。CLI 子命令与含义见框架仓 [`innate-fe-cli/README.md`](https://github.com/variableway/innate-fe/blob/main/innate-fe-cli/README.md)。

### 前置

- Node.js ≥ 20、pnpm（根 `package.json` 的 `packageManager` 声明版本）、Bun（CLI 用）。
- **innate-fe 框架检出**：`@innate/*` 包与宿主壳都在这里。本仓 `pnpm-workspace.yaml` 用相对 glob `../../framework/innate-fe/packages/*` 把框架包拉进 workspace，让 `@innate/*` 的 `workspace:*` 在本机解析到框架源码。该路径假定框架检出与本仓是同一棵工作树里的兄弟：

```text
innate-workspace/
├── framework/innate-fe/        # 框架：@innate/* 包 + shells/webshell + innate-fe-cli
└── apps/innate-fe-examples/    # 本仓：examples/*
```

### 安装

```bash
pnpm install
```

> 在 GitHub Actions 上构建需先 checkout 框架仓并放到上述相对位置（或改用 `innate-fe-cli install` 走私有 registry 拉 `@innate/ui` / `@innate/web-domain`）。框架的 `admin-composites` / `scene-*` / `plugin-protocol` 是 `private`，不发 registry，所以完整示例构建离不开框架检出。

### 两种构建粒度

**1）单应用独立构建**（不经过壳，最适合逐个看示例）：

```bash
# domain 独立预览（最小宿主）
pnpm --filter @innate/domain-admin-tanstack dev:standalone     # :4015
pnpm --filter @innate/domain-feed dev:standalone               # :4021

# iframe app 自己跑
pnpm --filter @innate/web-showcase dev      # :4003
pnpm --filter @innate/web-showcase build    # 产物 → examples/web-showcase/dist/（静态导出）
pnpm --filter @innate/admin-nextjs-demo dev # :4012
pnpm --filter @innate/wandesk-ui dev        # :4010
pnpm --filter @innate/skel-lean-ui dev      # :4010
```

**2）整站一条龙**（壳 + 该 profile 的 iframe，一个端口预览）：

`dev` / `build` / `assemble` / `all` / `preview` 需要框架的宿主壳 `shells/webshell`，在框架仓根跑（或让框架的 workspace 包含本仓 `examples/*`）：

```bash
# 在框架仓根（其 pnpm-workspace.yaml 包含本仓 examples/*）
bun innate-fe-cli/src/index.ts all --profile apps     # scan→gen→prepare→build→assemble → deploy/
bun innate-fe-cli/src/index.ts preview               # http://localhost:4173
```

`profile` 决定这次带哪些插件（见本仓 [`plugins.registry.yaml`](plugins.registry.yaml)）：`empty` 空壳 · `domain-one`/`domain-two` domain · `iframe-one`/`iframe-two` iframe · `mixed` 混合 · `orders` 订单 CRUD · `examples` skel-lean-ui。

### 本仓直跑 CLI（不需要壳的命令）

```bash
pnpm scan                       # 看某个 profile 带哪些插件
pnpm gen -- --profile mixed     # 写接缝 + 组装打包面（domains/）
pnpm verify-flags               # 死开关检测（flag 有但插件没进包）
pnpm gen:check                  # 接缝 ↔ yaml 对账
```

这些命令通过 `pnpm cli`（= `bun ../../framework/innate-fe/innate-fe-cli/src/index.ts`）调用框架的 CLI。

### 在 GitHub 上展示

- **web-showcase** 已是静态导出（`output: "export"`，`next.config.js` 配了 `GITHUB_PAGES` / `NEXT_PUBLIC_BASE_PATH`），可直接 `pnpm --filter @innate/web-showcase build` 产出 `dist/` 部署到 GitHub Pages。
- **整站 showcase**：用 `all --profile apps` 产出 `deploy/`（壳 + 静态 iframe），部署到 Pages。CI 需 checkout 框架仓放到相对位置。
- **纯代码展示**：本仓本身即可作为 GitHub 上的参考实现索引，README 即导航。

## 命令速查

```bash
# 单应用
pnpm --filter @innate/<pkg> dev            # 起该应用
pnpm --filter @innate/<pkg> build          # 构建
pnpm --filter @innate/domain-<id> dev:standalone   # domain 独立预览

# CLI（走框架 innate-fe-cli）
pnpm scan | gen | gen:check | verify-flags         # 不需要壳
pnpm dev | prepare | all | preview                 # 需要框架壳

# 全量
pnpm build:examples         # 构建所有带 build 脚本的示例
pnpm typecheck | lint | test
```

## 与框架仓的关系

- 本仓的示例是**源码事实源**；框架仓 `examples/` 已清空，框架的 `plugins.registry.yaml` / `pnpm-workspace.yaml` 改为引用本仓（或在框架 workspace 内 symlink 本仓 `examples/*`）来构建。
- `@innate/*` 包版本以框架仓为准，本仓不复制、不发版。
- 示例内部 README 里的 `../../docs/...`、`../../packages/...`、`tools/innate-fe-cli` 等相对链接指向框架仓，请到 [innate-fe](https://github.com/variableway/innate-fe) 查阅。
