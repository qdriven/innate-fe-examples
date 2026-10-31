---
id: approval-review
depends_on_patterns:
  - pattern-audit-readonly-banner
---

# Approval Review 场景规范

## 场景目标

适合审核、差异比对、审批意见流转和最终决策。

- 成功标准：审批人完成查看后做出批准 / 退回决策，意见留痕
- Use when：有明确的审批流、需要查看差异并留存意见
- Avoid when：只是查看记录（用 record-detail）

## 页面结构

- Header：审批上下文（提交人、SLA、当前节点）、审批状态
- Main：差异对比表、变更内容、影响范围
- Side Panel：审批意见输入、历史意见记录、当前上下文摘要
- Actions：批准、退回、追加备注　← 固定在底部或右侧面板底端
- Support：审计态 Banner　← [pattern-audit-readonly-banner]

## 关键约束

- 差异内容是主区，动作区固定在底部或右侧，不随主区滚动消失
- 审批意见必须留痕，不可删改
- period_locked：仅允许评论与申请，不允许直接修改数据
- RBAC 无审批权限时，操作区隐藏，仅展示只读内容
