---
id: integration-health
depends_on_patterns:
  - pattern-kpi-cards
  - pattern-list-table
  - pattern-audit-readonly-banner
---

# Integration Health 场景规范

## 场景目标

适合 IoT、ERP、SFTP、API 等**外部连接器的健康度监控和排障**。

- 成功标准：用户能快速定位失败连接器，触发重试或进入排障流程
- Use when：需要查看外部系统接入状态和最近同步健康度
- Avoid when：核心任务是配置连接器参数（用 policy-settings）

## 页面结构

- Summary：连接器总数、成功率、告警数　← [pattern-kpi-cards]
- Main：连接器状态列表（名称 / 类型 / 最近同步时间 / 状态）　← [pattern-list-table]
- Support：失败原因展开、重试入口、最近同步日志

## 关键约束

- 必须展示每个连接器的最近同步时间
- 失败状态必须给出明确动作入口（重试 / 排障指引）
- 健康度指标口径统一：成功率 = 近 24h 成功次数 / 总次数
- 告警数为 0 时不显示告警 Badge
