# Cyacle-X 场景规范目录（Machine-Readable）

本目录用于统一管理公司 UI 场景规范。智能体应先读取 `scenes_registry` 决策目标场景，再加载对应文档。

## 设计体系原则

- Shell 定型：侧边导航 + 顶部信息条 + 内容区约束宽度
- 全局范围：组织 -> 设施（全局上下文）；页面内允许局部细化筛选
- 权限模型：RBAC
- 审计态：`normal` / `audit_readonly` / `period_locked`
- 只读期：允许发起变更申请、补充备注、上传附件
- 单位策略：组织级默认单位（`org_default`）
- i18n：当前 `zh-CN`，预留国际化键

## 场景注册表

```yaml
version: 1.2.0
last_updated: 2026-03-12

scenes_registry:
  - id: dashboard
    doc: /docs/dashboard
    use_when: "能碳运营总览、KPI 趋势、异常下钻；设施级监控大屏"

  - id: workspace-list
    doc: /workspace-list.md
    use_when: "台账、订单、设备、任务等列表类管理页；核心操作是筛选、批量操作、进入详情"

  - id: record-detail
    doc: /record-detail.md
    use_when: "单条记录的详情查看、审计追踪、关联信息；核心操作是阅读和判断"

  - id: reporting-wizard
    doc: /reporting-wizard.md
    use_when: "填报、申报、配置初始化等多步骤提交流程；核心操作是逐步填写并提交"

  - id: approval-review
    doc: /approval-review.md
    use_when: "审核、差异比对、审批意见流转；核心操作是查看差异并做出批准/退回决策"

  - id: integration-health
    doc: /integration-health.md
    use_when: "IoT、ERP、API 等外部连接器的健康度监控和排障；核心操作是查看状态和触发重试"

  - id: policy-settings
    doc: /policy-settings.md
    use_when: "组织级默认策略、单位偏好、锁定规则等配置页；核心操作是开关和规则设置"
```

## 文档入口

| Pattern ID                    | 文档路径                                     |
| ----------------------------- | -------------------------------------------- |
| pattern-filterbar             | `/patterns/pattern-filterbar.md`             |
| pattern-list-table            | `/patterns/pattern-list-table.md`            |
| pattern-kpi-cards             | `/patterns/pattern-kpi-cards.md`             |
| pattern-audit-readonly-banner | `/patterns/pattern-audit-readonly-banner.md` |
| pattern-wizard-stepper        | `/patterns/pattern-wizard-stepper.md`        |
| pattern-detail-layout         | `/patterns/pattern-detail-layout.md`         |

- 场景文档模板：`/scene-template.md`
