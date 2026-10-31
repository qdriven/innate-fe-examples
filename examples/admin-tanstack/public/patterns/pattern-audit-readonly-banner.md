---
id: pattern-audit-readonly-banner
status: stable
---

# pattern-audit-readonly-banner

## 是什么

审计态提示横幅模式，在审计只读期（`audit_readonly`）或期间锁定期（`period_locked`）时展示，明确告知用户当前操作限制。

## 必须遵守

- Banner 固定在页面内容区顶部（Header 之下、Controls 之上），不可被关闭
- `audit_readonly` 状态：显示"审计只读期 · 数据不可修改，可发起变更申请"，保留变更申请入口
- `period_locked` 状态：显示"期间已锁定 · 仅允许查看、导出和对比"，隐藏所有写操作入口
- Banner 颜色语义：`audit_readonly` 用警告色（amber），`period_locked` 用中性色（灰）

## 禁止

- 不允许在审计态下隐藏 Banner（无论用户是否已知情）
- 不允许在 `period_locked` 状态下仍显示编辑、删除按钮（哪怕置灰也不行，必须完全隐藏）
- 不允许将变更申请入口也隐藏（`audit_readonly` 下该入口始终可用）
