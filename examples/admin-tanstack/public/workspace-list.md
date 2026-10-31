---
id: workspace-list
depends_on_patterns:
  - pattern-filterbar
  - pattern-list-table
  - pattern-kpi-cards
  - pattern-audit-readonly-banner
---

# Workspace List 场景规范

## 场景目标

适合台账、订单、资产、工单等以**筛选、批量操作、列表浏览**为核心的页面。

- 成功标准：用户能快速定位目标记录，完成批量操作或进入详情
- Use when：需要管理多条同类业务记录
- Avoid when：核心任务是逐步填写提交（用 reporting-wizard）

## 页面结构

- Header：标题、主操作（新建）、批量动作、导入导出
- Controls：搜索、时间筛选、状态筛选、高级筛选　← [pattern-filterbar]
- Summary：待处理数、异常数、完成率　← [pattern-kpi-cards]（可选，仅在有统计价值时展示）
- Main：分页列表表格　← [pattern-list-table]
- Support：数据更新时间、审计态 Banner　← [pattern-audit-readonly-banner]

## 关键约束

- 筛选条固定在内容区顶部，不随滚动消失
- 批量操作栏只在选中行后出现或高亮
- 表格行点击进入详情（record-detail 场景）
- audit_readonly：隐藏新建/删除，保留查看/导出
- period_locked：只允许查看、导出
