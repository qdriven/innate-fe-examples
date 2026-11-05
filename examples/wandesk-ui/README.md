# @innate/wandesk-ui

从 [Wandesk](https://github.com/nicepkg/wandesk) 抽取的 **Desktop OS 风格 UI** 参考应用，已纳入 innate-fe-examples pnpm workspace。

> 定位：**reference app**（桌面工作台 / 多窗口 / AI chat），不是 admin dashboard 模板，也不依赖 `@innate/ui` / scene-catalog。

## 在 monorepo 中运行

```bash
# 仓库根
pnpm install
pnpm --filter @innate/wandesk-ui dev
```

默认 Vite 端口见 `ui/vite.config.ts`（4010）。可选：`pnpm --filter @innate/wandesk-ui tauri:dev`（Cargo 产物走 [`framework/innate-backend/innate-go/desktop`](../../../../framework/innate-backend/innate-go/desktop/) 共享 `CARGO_TARGET_DIR`）。

## 接入 Web Shell（iframe）

已具备 `base: "./"` 与 `HashRouter`，可直接挂轨道 B。步骤：[apps in shell](https://github.com/variableway/innate-fe/blob/main/docs/use-cases/02-apps-in-shell.md)

```bash
# 终端 1
pnpm --filter @innate/wandesk-ui dev

# 终端 2（examples 仓根，profile iframe-two 含 web-showcase + wandesk-ui）
pnpm dev --profile iframe-two
# → http://localhost:4020/plugins/wandesk-ui
```

## 技术栈（现状）

| 层      | 选择                                                         |
| ------- | ------------------------------------------------------------ |
| 框架    | Vite + React 18 + React Router 7（**不是** TanStack / Next） |
| 样式    | Tailwind CSS 4 + 大量自定义 CSS（壁纸、窗口玻璃态）          |
| UI 原语 | **无 shadcn**；手写窗口管理 / Taskbar / Launcher             |
| 数据    | `ui/src/mock/` 拦截 fetch + 模拟 WS                          |
| 桌面壳  | 可选 Tauri 2（`tauri/`）                                     |

## 目录

```
wandesk-ui/
├── ui/           # 前端源码（Vite root）
├── apps/         # 运行态 APP.md（agent 文档，非 React apps）
├── language/     # i18n
├── scripts/      # i18n bake + tauri helpers
└── tauri/        # 可选桌面壳
```

原独立项目 README 说明见同目录历史内容；workspace 集成以本文为准。
