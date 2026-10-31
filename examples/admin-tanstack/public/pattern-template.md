---
id: <pattern-id>
status: draft
last_updated: 2026-03-11
applies_to_intent: [monitor, decide, act, configure, integrate, govern]
dependencies: []
---

# Pattern 名称

## 1. Purpose

- 说明该模式解决的通用问题与适用上下文

## 2. Invariants

- 核心结构不可变化项
- 关键交互顺序不可变化项
- 必须满足的可访问性要求

## 3. Slots

- `slot_a`: 允许填充内容定义
- `slot_b`: 允许填充内容定义

## 4. Variants

- `default`: 标准状态
- `readonly`: 只读态
- `locked`: 锁定态
- `dense`: 高密度态

## 5. Required States

- loading
- empty
- error
- partial_data
- permission_denied

## 6. Data Contract

- 输入参数
- 输出视图结构
- 异常处理要求

## 7. Telemetry Contract

- 关键事件命名规范
- 关键事件最小字段集合

## 8. Anti-patterns

- 常见错误用法 1
- 常见错误用法 2

## 9. Component Reference

- 组件实现可外链至 shadcn 文档或内部组件文档
