# @innate/domain-order-admin

订单管理 CRUD **黄金样例**（domain 轨道）：验证 agent 技能可执行性的最小完整闭环——
typed service（mock-first）+ 三态 + 列表筛选排序分页 + 行选择批量取消 + 创建 / 编辑表单（react-hook-form + zod）

- 状态机流转（DRAFT → CONFIRMED → PAID → SHIPPED → COMPLETED，非终态可取消）。

* 路由：`/order-admin/orders`（列表）· `/orders/new`（创建）· `/orders/$orderId`（详情）· `/orders/$orderId/edit`（编辑）
* 批量取消：列表行勾选（非终态才可勾）→「批量操作 → 批量取消」→ AlertDialog 二次确认 → 全部流转为 `cancelled`；终态订单不可勾选，执行时状态已变的订单被跳过并回报原因
* 数据：`src/lib/orders/`（types / mock-data / service），换真实后端只改 service 内部
* 挂壳：`plugins.registry.yaml` 的 `orders` profile（`bun innate-fe-cli/src/index.ts dev --profile orders`）

改技能后用它做回归：按 fe-starter / fe-feature 重走一遍，门禁应全绿。
