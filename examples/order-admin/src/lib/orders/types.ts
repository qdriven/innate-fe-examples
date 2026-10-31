/** 订单管理黄金样例的领域类型（无 UI 依赖）。 */

export const ORDER_STATUSES = [
  "draft",
  "confirmed",
  "paid",
  "shipped",
  "completed",
  "cancelled",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

/** 合法状态流转：非终态可取消；completed / cancelled 为终态。 */
export const ORDER_TRANSITIONS: Readonly<
  Record<OrderStatus, readonly OrderStatus[]>
> = {
  draft: ["confirmed", "cancelled"],
  confirmed: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
}

export const ORDER_STATUS_LABELS: Readonly<Record<OrderStatus, string>> = {
  draft: "草稿",
  confirmed: "已确认",
  paid: "已支付",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
}

/** 详情页 / 表格操作按钮上的流转文案。 */
export const ORDER_ACTION_LABELS: Readonly<Record<OrderStatus, string>> = {
  draft: "草稿",
  confirmed: "确认订单",
  paid: "标记支付",
  shipped: "标记发货",
  completed: "完成订单",
  cancelled: "取消订单",
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return ORDER_TRANSITIONS[status].length === 0
}

/**
 * 是否可取消：状态机允许流转到 cancelled（draft / confirmed / paid / shipped）。
 * 终态（completed / cancelled）不可取消，行选择与批量操作都以此为准。
 */
export function isCancellableStatus(status: OrderStatus): boolean {
  return ORDER_TRANSITIONS[status].includes("cancelled")
}

export interface OrderLine {
  readonly id: string
  readonly sku: string
  readonly name: string
  readonly quantity: number
  readonly unitPrice: number
}

export interface Order {
  readonly id: string
  readonly customer: string
  readonly status: OrderStatus
  readonly note: string
  readonly lines: readonly OrderLine[]
  readonly createdAt: string
  readonly updatedAt: string
}

export function orderTotal(order: Order): number {
  return order.lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0
  )
}

/** 创建 / 编辑表单的输入；id、状态与时间戳由 service 生成。 */
export interface OrderInput {
  readonly customer: string
  readonly note: string
  readonly lines: readonly OrderLineInput[]
}

export interface OrderLineInput {
  readonly sku: string
  readonly name: string
  readonly quantity: number
  readonly unitPrice: number
}

export interface OrderFilter {
  readonly status?: OrderStatus
  readonly search?: string
}
