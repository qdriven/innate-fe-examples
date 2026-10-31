# innate-fe-examples

[innate-fe](https://github.com/variableway/innate-fe) 框架的**示例应用集合**：把框架的 `@innate/*` 包（UI primitive、domain 契约、ToB 场景资产）用两种轨道各跑一遍，作为参考实现与集成样板。

示例分两条轨道进同一个壳（webshell）：

| 轨道 | 形态 | 进壳方式 | 适合 | 现成示例 |
| ---- | ---- | ---- | ---- | ---- |
| **A · domain** | TanStack，与壳同一棵 React 树 | 源码打进宿主包，路由挂壳 outlet | 与壳共享路由 / 状态 / 设计语言 | `admin-tanstack` `feed` `making` `cheatsheets` `awesome` `order-admin` `sqlite-admin` |
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
| [`sqlite-admin`](examples/sqlite-admin) | `@innate/domain-sqlite-admin` | A domain | :4031 | 只读 SQLite 工作台。界面用 `@innate/ui`，查询打到本机 API，可切换数据库文件。不是静态站 |
| [`web-showcase`](examples/web-showcase) | `@innate/web-showcase` | B iframe | :4003 | `@innate/ui` primitive 的 live 展示（Next.js，静态导出，可上 GitHub Pages） |
| [`admin-nextjs`](examples/admin-nextjs) | `@innate/admin-nextjs-demo` | B iframe | :4012 | 同一套 ToB 场景的 Next.js 对照实现 + Prisma + better-auth |
| [`wandesk-ui`](examples/wandesk-ui) | `@innate/wandesk-ui` | B iframe | :4010 | 桌面 OS 风格参考 app（Vite + Tauri），不依赖 `@innate/ui` |
| [`skel-lean-ui`](examples/skel-lean-ui) | `@innate/skel-lean-ui` | B iframe | :4010 | Skel × Lean 契约验证台（Next.js），只用 `@innate/ui` |

每个示例目录下的 `README.md` 是该应用的详细说明（含框架时代的相对链接，指向框架仓的 `docs/`、`packages/`）。

## 构建方式

构建遵循 [innate-fe-cli](https://github.com/variableway/innate-fe/tree/main/innate-fe-cli) 的编排：`scan → gen → prepare → build → assemble → preview`。CLI 子命令与含义见框架仓 [`innate-fe-cli/README.md`](https://github.com/variableway/innate-fe/blob/main/innate-fe-cli/README.md)。

### 前置

- Node.js ≥ 20、pnpm（根 `package.json` 的 `packageManager` 声明版本）、Bun（CLI 用）。
- **innate-fe 框架检出**：`@innate/*` 包与宿主壳都在这里。本仓 `pnpm-workspace.yaml` 用相对 glob 把框架 `packages/` 拉进 workspace，让 `@innate/*` 的 `workspace:*` 解析到框架源码。两条路径都写了，不存在的那条会被忽略：

```text
# CI / 文档布局
innate-workspace/
├── framework/innate-fe/        # 框架：@innate/* 包 + shells/webshell + innate-fe-cli
└── apps/innate-fe-examples/    # 本仓：examples/*

# 本机布局
innate/
├── base/innate-fe/
└── innate-apps/innate-fe-examples/
```

### 安装

```bash
pnpm install
```

> GitHub Actions 会 checkout 框架仓 `variableway/innate-fe`（可用仓库变量 `FE_REPO` / `FE_REF` 覆盖），再按 `pages` profile 组装静态站，见下文「在 GitHub 上展示」。本机也可以 `innate-fe-cli registry publish` 把框架 `packages/` 下的 `@innate/*` 发到本地私有源（`http://127.0.0.1:4873`）。`private: true` 只拦住公网 npm，发布到私有源时 CLI 会临时去掉该字段并展开 `workspace:*`。

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

`profile` 决定这次带哪些插件（见本仓 [`plugins.registry.yaml`](plugins.registry.yaml)）：`empty` 空壳 · `domain-one`/`domain-two` domain · `iframe-one`/`iframe-two` iframe · `mixed` 混合 · `orders` 订单 CRUD · `examples` skel-lean-ui · `pages` 静态站全集 · `sqlite-admin` 本机 SQLite 工作台。

SQLite 工作台（需要本机文件，不进 Pages）：

```bash
pnpm --filter @innate/domain-sqlite-admin dev:server
# 另一个终端。页面里填写数据库路径，或启动前 export SQLITE_DB_PATH=/path/to/app.db
pnpm --filter @innate/domain-sqlite-admin dev:standalone   # :4031，代理 /api/sqlite-admin
```

### 本仓直跑 CLI（不需要壳的命令）

```bash
pnpm scan                       # 看某个 profile 带哪些插件
pnpm gen -- --profile mixed     # 写接缝 + 组装打包面（domains/）
pnpm verify-flags               # 死开关检测（flag 有但插件没进包）
pnpm gen:check                  # 接缝 ↔ yaml 对账
```

这些命令通过 `pnpm cli`（`scripts/cli.mjs`）调用框架的 CLI：优先 `../../base/innate-fe`，其次 `../../framework/innate-fe`，都没有时用 PATH 里的 `innate-fe-cli`。

### 在 GitHub 上展示

推到 `main` 会跑 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)：checkout 本仓和 GitHub 上的 `variableway/innate-fe`，把 `examples/` 盖进框架 workspace，再用 `innate-fe-cli` 的 `pages` profile 生成接缝、准备静态 iframe、构建壳并组装 `deploy/`，发到 GitHub Pages。壳的 `PUBLIC_PATH` 是 `/<仓库名>/`。框架仓若是私有的，给本仓配 secret `FE_TEMPLATES_TOKEN` 或 `INNATE_FE_TOKEN`。仓库变量 `FE_REPO` / `FE_REF` 可改地址和分支。

`pages` 里能看的静态内容：

- domain：`admin-tanstack`、`order-admin`、`feed`、`making`、`cheatsheets`、`awesome`（编进壳）
- iframe：`web-showcase`（静态导出）、`wandesk-ui`（Vite，`base: "./"`）

不进 Pages 的是需要服务端的应用：`admin-nextjs`（API + Prisma）、`skel-lean-ui`（Playground API）、`sqlite-admin`（本机 SQLite）。

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

- 本仓的示例是**源码事实源**。GitHub Pages 工作流把本仓 `examples/` 和 `plugins.registry.yaml` 盖到检出的框架仓上再组装，不改框架仓里提交的示例。
- `@innate/*` 包版本以框架仓为准，本仓不复制、不发版。
- 示例内部 README 里的 `../../docs/...`、`../../packages/...`、`tools/innate-fe-cli` 等相对链接指向框架仓，请到 [innate-fe](https://github.com/variableway/innate-fe) 查阅。
