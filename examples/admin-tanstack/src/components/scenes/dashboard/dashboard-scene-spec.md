---
id: dashboard
last_updated: 2026-03-12
personas: [org_admin, analyst]
depends_on_patterns:
  - pattern-kpi-cards
  - pattern-filterbar
  - pattern-audit-readonly-banner
---

# Dashboard 场景规范

## 场景目标

适合以**总览判断、趋势分析、结构拆解和异常下钻**为核心的监控型页面。

- 成功标准：用户能在首屏判断当前状态、定位主要波动，并进入下钻明细
- Use when：需要围绕同一业务对象做整页级监控与分析
- Avoid when：核心任务是录入表单、逐条编辑、审批流转或聊天协作

## 标准组件树

```tsx
<DashboardPage>
  <DashboardHeader />
  <DashboardFilters />
  <DashboardHero />

  <DashboardMain>
    <PrimaryPanel />
    <SecondaryPanels />
    <DashboardAside />
  </DashboardMain>

  <DashboardDetail />
</DashboardPage>
```

## 页面结构

- `DashboardPage`：位于 `SpecPageShell` 内容区内，只承载 dashboard 结构；必须继续使用统一的宽度与间距 token
- `DashboardHeader`：必需；包含标题、描述、主操作，以及整页上下文说明
- `DashboardFilters`：可选；只放作用于整页的全局筛选，如时间范围、业务范围、统计口径 ← [pattern-filterbar]
- `DashboardHero`：可选且最多 1 个；首屏只放高度概括信息，推荐 `MetricCards` 或 `SummaryStrip` ← [pattern-kpi-cards]
- `DashboardMain`：必需；承担首屏主叙事，且必须包含唯一的 `PrimaryPanel`
- `PrimaryPanel`：必需且唯一；推荐使用 `OverviewChart` 或 `TrendPanel` 承接主趋势或主分析
- `SecondaryPanels`：可选且最多 2 组；用于比较、分布、排行、进度等补充分析
- `DashboardAside`：可选且最多 1 组；用于提醒、洞察、快捷操作等次级信息
- `DashboardDetail`：可选且最多 1 组；承载表格、时间线、事件流、排行等下钻信息

## `/specific/dashboard` 推荐组合

- `DashboardHeader`：页面标题、场景描述、主操作与文档入口；不得用站点级 `SiteHeader` 替代页面 Header
- `DashboardFilters`：建议提供时间范围、业务范围、统计口径三类全局筛选；如无整页筛选需求可省略
- `DashboardHero`：采用 `MetricCards`，承载 3 到 4 个核心 KPI；不承载团队、聊天、表单等异质模块
- `PrimaryPanel`：采用 `OverviewChart` 或 `TrendPanel`，展示主趋势与同比/环比，是首屏唯一视觉重心
- `SecondaryPanels`：建议保留 2 组，分别承担结构分布与对比排行；超过 2 组的内容下沉到 `DashboardDetail`
- `DashboardAside`：如需辅助信息，使用单组 `InsightCard`、`AlertList` 或 `QuickActions`
- `DashboardDetail`：承载明细表格、事件流或排行表，用于解释首屏异常，不重复 Hero 指标

## 当前示例模块归位建议

- `DashboardExercise`：可作为 `PrimaryPanel` 候选，因为它是当前唯一具备主趋势叙事能力的大图
- `DashboardRevenue` 与 `DashboardSubscriptions`：更适合收敛为 `DashboardHero` 的 KPI 或 `SummaryStrip`，而不是各自独立争抢首屏层级
- `DashboardPayments`：应下沉到 `DashboardDetail`，作为 `DetailTable` 使用
- `DashboardChat`：仅在页面目标是“分析助手”时可进入 `DashboardAside`；默认监控型 dashboard 不建议出现
- `DashboardTeamMembers`：属于协作或成员管理，不属于标准监控 dashboard 首屏模块
- `DashboardPaymentMethod`：属于设置或交易流程，不属于 `/specific/dashboard` 的标准模块

## 审计与状态

- `audit_readonly`：禁止直接写操作，允许查看、导出、发起变更申请或备注
- `period_locked`：只允许查看、导出、对比
- RBAC 无权限时统一展示门禁态，不渲染伪可用操作
- 状态覆盖必须包含 `loading`、`empty`、`error`、`partial`、`audit`、`locked`

## 关键约束

- `DashboardHeader` 与 `DashboardMain` 必须存在
- 首屏只能有一个 dominant 模块；禁止并列多个主图争夺注意力
- `DashboardFilters` 一旦出现，默认作用于整页；禁止混入局部筛选
- `DashboardHero`、`SecondaryPanels`、`DashboardDetail` 之间禁止重复展示同一组统计
- `DashboardAside` 不能比 `PrimaryPanel` 更宽、更高或更显眼
- 不允许把团队、聊天、设置表单等无关模块拼成“示例拼盘”
- 不允许出现无明确语义的可点击卡片或图表

## 验收清单

- 页面继续走统一 `SpecPageShell`，并遵守 `--content-max-width`、`--content-min-width`、`--spacing-page`、`--spacing-section`、`--spacing-block`
- 页面布局以 `gap-*` 组织，不使用 `space-x-*` / `space-y-*`
- `/specific/dashboard` 首屏结构必须能清晰映射到 `DashboardHeader`、`DashboardHero`、`DashboardMain`、`DashboardDetail`
- 下钻链路稳定，文档入口统一指向 `/docs/dashboard`
