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

/** 订单种类：标准单 / 加急单 / 订阅单 / 框架协议单（与履约 status 正交）。 */
export const ORDER_CATEGORIES = [
  "standard",
  "urgent",
  "subscription",
  "framework",
] as const

export type OrderCategory = (typeof ORDER_CATEGORIES)[number]

/** 种类中文标签：Base UI Select 必须显式映射，避免露出原始 value。 */
export const ORDER_CATEGORY_LABELS: Readonly<Record<OrderCategory, string>> = {
  standard: "标准单",
  urgent: "加急单",
  subscription: "订阅单",
  framework: "框架协议单",
}

/** standard 专属字段：交期与物流方式。 */
export interface StandardCategoryMeta {
  readonly kind: "standard"
  readonly dueDate: string
  readonly logisticsMethod: string
}

/** urgent 专属字段：SLA 响应时效、加急费率、超时升级联系人。 */
export interface UrgentCategoryMeta {
  readonly kind: "urgent"
  /** 响应时效（小时） */
  readonly slaHours: number
  /** 加急费率（1.2 = 基准价 × 1.2） */
  readonly rushRate: number
  readonly escalationContact: string
}

/** subscription 专属字段：补货周期、下次补货日、历史补货次数。 */
export interface SubscriptionCategoryMeta {
  readonly kind: "subscription"
  /** 补货周期（天） */
  readonly cycleDays: number
  readonly nextRestockAt: string
  readonly restockCount: number
}

/** framework 专属字段：协议号、额度、有效期。 */
export interface FrameworkCategoryMeta {
  readonly kind: "framework"
  readonly contractNo: string
  readonly creditLimit: number
  readonly creditUsed: number
  readonly validUntil: string
}

/** category → 专属字段的映射类型（详情区块按种类取对应结构）。 */
export type OrderCategoryMetaMap = {
  standard: StandardCategoryMeta
  urgent: UrgentCategoryMeta
  subscription: SubscriptionCategoryMeta
  framework: FrameworkCategoryMeta
}

/** 分类型专属字段的 discriminated 联合：按 kind 收窄，禁 any。 */
export type OrderCategoryMeta = OrderCategoryMetaMap[OrderCategory]

/**
 * 审核状态：与履约 status 正交的独立维度。
 * pending 决策中；approved / rejected 为终态（流转规则见 lib/orders/review.ts）。
 */
export type ReviewState = "pending" | "approved" | "rejected"

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
  readonly category: OrderCategory
  /** 分类型专属字段（可选）：按 categoryMeta.kind 收窄。 */
  readonly categoryMeta?: OrderCategoryMeta
  readonly reviewState: ReviewState
  /** rejected 时必填的拒绝原因（由 service 决策时写入）。 */
  readonly reviewReason?: string
  readonly reviewDecidedAt?: string
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
  readonly category: OrderCategory
  /** 可选：表单暂不采集，编辑时由 service 保留原值。 */
  readonly categoryMeta?: OrderCategoryMeta
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
  /** 与 status / search 以 AND 组合。 */
  readonly category?: OrderCategory
  readonly search?: string
}
