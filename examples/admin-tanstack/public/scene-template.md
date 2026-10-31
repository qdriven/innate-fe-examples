---
id: <scene-id>
last_updated: YYYY-MM-DD
personas: []
depends_on_patterns: []
---

# 场景名称

## 1. 场景目标与边界

- 目标：该页面解决什么业务判断或操作问题
- 成功标准：用户完成后的可验证结果
- Use when：适用条件
- Avoid when：不适用条件

## 2. 前置条件

- 数据依赖：来源系统、更新时间、是否可缺失
- 权限依赖：最小权限集合
- 组织范围：全局设施上下文要求

## 3. 语义结构树（稳定层）

```yaml
semantic_tree:
  - Header: [Title, GlobalActions]
  - Controls: [ScopeRefinement, TimeRange, DimensionFilters]
  - Summary: [KpiCards]
  - Main: [PrimaryPanel, SecondaryPanel]
  - Details: [DrilldownTable]
  - Support: [AuditInfo, DataFreshness]
```

## 4. Pattern 映射（实现层）

```yaml
mapping:
  Controls:
    pattern: pattern-filterbar
    slots: [time_range, dimension_filters]
  Summary:
    pattern: pattern-kpi-cards
    slots: [kpi_1, kpi_2, kpi_3]
  Support:
    patterns:
      - pattern-data-freshness
      - pattern-audit-readonly-banner
      - pattern-lock-state
      - pattern-change-request
```

## 5. 状态合同（必须覆盖）

- loading：骨架屏结构不改变页面骨架
- empty：空态必须给出下一步动作
- error：错误态需提供重试或排障入口
- partial_data：局部失败时标明影响范围
- rbac_denied：无权限时展示统一门禁样式
- audit_readonly：隐藏写入口；允许发起变更申请、补充备注、上传附件
- period_locked：不可编辑；允许查看、导出、对比

## 6. 不变量（Invariants）

- 使用既定 Shell，禁止替换主导航结构
- 内容宽度和间距只允许使用全局 Token
- 主操作区位置固定，禁止跨页漂移
- 同类模块标题层级与命名方式保持一致

## 7. 允许变体（Allowed Variations）

- 角色差异（同布局，不同操作可见性）
- 数据密度差异（卡片数量、表格列）
- 终端差异（移动端改为抽屉，不改语义结构）

## 8. 禁止项（Forbidden）

- 不允许引入未登记 Pattern 的关键交互
- 不允许跳过审计态/锁定态展示
- 不允许使用散装 spacing 类绕过 Token 规范

## 9. 单位与口径

- canonical_unit：系统基准单位
- display_unit：组织级默认显示单位
- precision：精度与舍入规则
- scope_boundary：统计边界说明

## 10. 交付验收清单

- 布局和 token 合规
- 状态覆盖完整
- 权限与审计态行为正确
- 关键交互具备可回溯事件
