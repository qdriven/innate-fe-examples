# edu-notes —— 教育场景模板（学习手账）

`edu` 主题 + `@innate/ink` 手绘装饰层的 domain 黄金样例，演示「教育类产品」在
innate-fe 里的完整做法。轨道 A（domain，与壳同树）。

## 三个场景

| 路由 | 场景 | ink 组件 | 要点 |
| --- | --- | --- | --- |
| `/edu-notes/schedule` | 课程表 | StickyNote（科目→便利贴色） | 网格 + 空档虚线格 + 三态 |
| `/edu-notes/notes` | 笔记本 | Highlight（标题荧光笔）、Tape（胶带装饰） | 状态流转谓词 `canTransition` 单点 |
| `/edu-notes/tasks` | 作业看板 | Stamp（DONE 印章） | 四列看板 + `canMoveTo` 谓词 + done 不出列 |

## 与 order-admin 的差异（模板要点）

- **主题**：壳里切 `edu`（ThemeSelector → Edu）看完整纸感；其他主题下 ink 用
  自己的 `--ll-*` 默认纸色仍然成立（引擎取色与语义层解耦）。
- **装饰层**：`@innate/ink` 是 L1.5 装饰层，只做视觉装饰；交互与数据仍走
  `@innate/ui` primitive。**不要**拿 ink 组件替代表单/按钮等交互件。
- **CSS 接线**：`globals.css` 里 `@import "@innate/ink/theme.css"` + `ink.css`
  （Tailwind 编译）+ `fonts.css`（字体），并 `@source` 扫 ink 的 src。
- **领域谓词单点**：`canTransition` / `canMoveTo` / `isConflicted` 都在
  `lib/<domain>/types.ts` 导出，UI 与 service 共用——这是 fe-feature 的禁忌项
  （同一判定写多处）的反面示范位。
- **vitest 池**：forks + maxWorkers 2 + testTimeout 30s（ink 首渲染有纹理计算
  开销），与 admin-tanstack 的隔离策略一致。

## 数据

mock-first：`lib/<domain>/mock-data.ts` → `service.ts` 是唯一数据入口，
换 api-first 时只改 service。

## 本地开发

```sh
# 框架仓：起壳（edu profile）
bun innate-fe-cli/src/index.ts dev --profile edu
# 独立预览（examples 仓）
pnpm --filter @innate/domain-edu-notes dev:standalone   # :4022
```
