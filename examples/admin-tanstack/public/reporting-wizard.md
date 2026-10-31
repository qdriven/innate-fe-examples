---
id: reporting-wizard
depends_on_patterns:
  - pattern-wizard-stepper
  - pattern-audit-readonly-banner
---

# Reporting Wizard 场景规范

## 场景目标

适合填报、申报、配置初始化和提交前校验的**多步骤提交流程**。

- 成功标准：用户逐步完成所有必填项，通过最终校验后提交
- Use when：任务需要跨多个步骤、每步有独立校验逻辑
- Avoid when：只有单屏表单（直接用 record-detail 场景的编辑态）

## 页面结构

- Stepper：步骤导航（固定在顶部或左侧）　← [pattern-wizard-stepper]
- Main Form：当前步骤表单内容
- Side Summary：缺失项、校验结果、审批路径预览（可选）
- Footer Actions：保存草稿、上一步、下一步 / 提交

## 关键约束

- 步骤顺序固定且已完成的步骤可回溯
- 每步 Next 时进行最小必要校验，给出字段级反馈
- 提交前统一展示摘要页 + 风险提示
- 支持草稿保存（服务端持久化，非 localStorage）
- 中途退出后再进入自动恢复草稿状态
- audit_readonly：仅允许查看已提交数据，不允许再次填写
