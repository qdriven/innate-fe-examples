---
id: record-detail
depends_on_patterns:
  - pattern-detail-layout
  - pattern-audit-readonly-banner
---

# Record Detail 场景规范

## 场景目标

适合单条业务记录的**摘要阅读、风险判断、审计追踪和关联信息查看**。

- 成功标准：用户在第一屏内能判断"这是什么、当前状态、能否操作"
- Use when：需要查看单条记录的完整信息与操作入口
- Avoid when：核心任务是编辑大量字段（用 reporting-wizard）

## 页面结构

- Header：标题、状态 Badge、主操作入口（编辑 / 提交 / 申请变更）
- Summary：关键字段摘要卡　← [pattern-detail-layout] 的 Summary 槽
- Side Panel：状态信息（同步健康 / 审计信息 / 关联对象）　← [pattern-detail-layout] 的 Side 槽
- Main：主体内容（业务明细 / 附件 / 关联列表）　← [pattern-detail-layout] 的 Main 槽
- Support：审计态 Banner　← [pattern-audit-readonly-banner]

## 关键约束

- 第一屏优先回答"是什么、状态如何、能否操作"
- 详情页结构保持稳定，不因字段增减改变主次层级
- audit_readonly：写操作入口隐藏或置灰，显示变更申请入口
- period_locked：仅允许查看、导出、对比
