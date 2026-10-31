---
id: policy-settings
depends_on_patterns:
  - pattern-audit-readonly-banner
---

# Policy Settings 场景规范

## 场景目标

适合**组织级默认策略、单位偏好、锁定规则和通知策略**配置。

- 成功标准：用户完成配置项修改，变更立即生效或进入审批流
- Use when：需要设置全局或组织级策略，影响所有用户或场景
- Avoid when：只是查看某条记录的配置（用 record-detail）

## 页面结构

- Header：配置名称、作用范围（组织级 / 设施级）
- Main：策略分组 → 策略开关 / 规则项 / 默认值输入
- Side Summary：当前生效配置快照（可选）
- Support：审计态 Banner　← [pattern-audit-readonly-banner]

## 关键约束

- 每个配置项必须明确标注作用范围（组织级影响所有成员）
- 高风险规则变更（如锁定期策略）必须弹出影响范围提示
- 配置变更自动记录变更日志（变更人、变更时间、变更前后值）
- audit_readonly：配置只读，不允许修改
