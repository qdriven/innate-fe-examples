import { findAll, findById, insertOrder, replaceOrder } from "./mock-data"
import {
  assertReviewTransition,
  InvalidReviewDecisionError,
  isPendingReview,
  type ReviewDecision,
  REVIEW_STATE_LABELS,
} from "./review"
import {
  isCancellableStatus,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_TRANSITIONS,
  orderTotal,
  type Order,
  type OrderFilter,
  type OrderInput,
  type OrderStatus,
} from "./types"

/**
 * typed service：页面唯一的数据入口（mock-first，与真实后端同签名）。
 * 切真实后端时把实现换成 fetch，页面零改动。
 */

const LATENCY_MS = 80

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, LATENCY_MS)
  })
}

export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`订单 ${id} 不存在`)
    this.name = "OrderNotFoundError"
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(id: string, from: OrderStatus, to: OrderStatus) {
    super(
      `订单 ${id} 不能从「${ORDER_STATUS_LABELS[from]}」流转到「${ORDER_STATUS_LABELS[to]}」`
    )
    this.name = "InvalidStatusTransitionError"
  }
}

export async function listOrders(filter: OrderFilter = {}): Promise<Order[]> {
  await delay()
  const search = filter.search?.trim().toLowerCase()
  return findAll().filter((order) => {
    if (filter.status && order.status !== filter.status) return false
    if (filter.category && order.category !== filter.category) return false
    if (
      search &&
      !order.id.toLowerCase().includes(search) &&
      !order.customer.toLowerCase().includes(search)
    ) {
      return false
    }
    return true
  })
}

export async function getOrder(id: string): Promise<Order> {
  await delay()
  const order = findById(id)
  if (!order) throw new OrderNotFoundError(id)
  return order
}

export async function createOrder(input: OrderInput): Promise<Order> {
  await delay()
  return insertOrder(input, new Date().toISOString())
}

export async function updateOrder(
  id: string,
  input: OrderInput
): Promise<Order> {
  await delay()
  const order = findById(id)
  if (!order) throw new OrderNotFoundError(id)
  const next: Order = {
    ...order,
    customer: input.customer,
    category: input.category,
    // 表单不采集 categoryMeta：种类未变时保留原值，换种类则清掉旧种类的字段
    categoryMeta:
      input.categoryMeta ??
      (input.category === order.category ? order.categoryMeta : undefined),
    note: input.note,
    lines: input.lines.map((line, index) => ({
      ...line,
      id: `${id}-L${index + 1}`,
    })),
    updatedAt: new Date().toISOString(),
  }
  replaceOrder(id, next)
  return next
}

export async function transitionOrderStatus(
  id: string,
  next: OrderStatus
): Promise<Order> {
  await delay()
  const order = findById(id)
  if (!order) throw new OrderNotFoundError(id)
  // 审核与状态机的唯一耦合：被拒的草稿不可确认（其余流转互不干扰）
  if (
    order.reviewState === "rejected" &&
    order.status === "draft" &&
    next === "confirmed"
  ) {
    throw new InvalidReviewDecisionError(
      `订单 ${id} 审核未通过${
        order.reviewReason ? `（${order.reviewReason}）` : ""
      }，不可确认`
    )
  }
  if (!ORDER_TRANSITIONS[order.status].includes(next)) {
    throw new InvalidStatusTransitionError(id, order.status, next)
  }
  const updated: Order = {
    ...order,
    status: next,
    updatedAt: new Date().toISOString(),
  }
  replaceOrder(id, updated)
  return updated
}

/** 批量取消时被跳过的订单及原因（供界面给出可感知反馈）。 */
export interface BulkCancelSkip {
  readonly id: string
  readonly reason: string
}

/** 批量取消结果：成功流转的订单 + 被跳过的订单。 */
export interface BulkCancelResult {
  readonly cancelled: readonly Order[]
  readonly skipped: readonly BulkCancelSkip[]
}

/**
 * 批量取消：可取消的订单流转到 cancelled；
 * 已是终态或已不存在的订单跳过并回报原因，不做整批回滚。
 */
export async function bulkCancelOrders(
  ids: readonly string[]
): Promise<BulkCancelResult> {
  await delay()
  const cancelled: Order[] = []
  const skipped: BulkCancelSkip[] = []
  for (const id of new Set(ids)) {
    const order = findById(id)
    if (!order) {
      skipped.push({ id, reason: "订单不存在" })
      continue
    }
    if (!isCancellableStatus(order.status)) {
      skipped.push({
        id,
        reason: `当前状态「${ORDER_STATUS_LABELS[order.status]}」不可取消`,
      })
      continue
    }
    const updated: Order = {
      ...order,
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    }
    replaceOrder(id, updated)
    cancelled.push(updated)
  }
  return { cancelled, skipped }
}

// ---------------------------------------------------------------------------
// 审核维度（reviewState 与履约 status 正交；流转规则见 ./review）
// ---------------------------------------------------------------------------

export { InvalidReviewDecisionError }

/** 待审队列：reviewState 为 pending 的订单，按提交时间（updatedAt）升序。 */
export async function listReviewQueue(): Promise<Order[]> {
  await delay()
  return findAll()
    .filter((order) => isPendingReview(order.reviewState))
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
}

/**
 * 提交审核：仅 pending 订单可（重新）提交，刷新提交时间；
 * approved / rejected 为终态，不可重开，抛 InvalidReviewDecisionError。
 */
export async function submitForReview(id: string): Promise<Order> {
  await delay()
  const order = findById(id)
  if (!order) throw new OrderNotFoundError(id)
  if (!isPendingReview(order.reviewState)) {
    throw new InvalidReviewDecisionError(
      `订单 ${id} 已${REVIEW_STATE_LABELS[order.reviewState]}，不可提交审核`
    )
  }
  const updated: Order = {
    ...order,
    updatedAt: new Date().toISOString(),
  }
  replaceOrder(id, updated)
  return updated
}

/**
 * 审核决策：pending → approved / rejected。
 * rejected 必填 reason（去空白后为空即抛），并写入 reviewReason / reviewDecidedAt。
 */
export async function decideReview(
  id: string,
  decision: ReviewDecision,
  reason?: string
): Promise<Order> {
  await delay()
  const order = findById(id)
  if (!order) throw new OrderNotFoundError(id)
  assertReviewTransition(order.reviewState, decision)
  const trimmedReason = reason?.trim()
  if (decision === "rejected" && !trimmedReason) {
    throw new InvalidReviewDecisionError("拒绝审核必须填写原因")
  }
  const updated: Order = {
    ...order,
    reviewState: decision,
    reviewReason: decision === "rejected" ? trimmedReason : undefined,
    reviewDecidedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  replaceOrder(id, updated)
  return updated
}

// ---------------------------------------------------------------------------
// dashboard 只读聚合（getOrderStats）
// ---------------------------------------------------------------------------

export interface OrderStatusCount {
  readonly status: OrderStatus
  readonly count: number
}

/** 按周金额趋势点：weekStart 为该周周一（UTC，YYYY-MM-DD）。 */
export interface OrderWeeklyAmountPoint {
  readonly weekStart: string
  readonly amount: number
}

/** dashboard 聚合口径：总数 / 待审 / 成交额 / 取消率 + 状态分布 + 按周成交金额。 */
export interface OrderStats {
  readonly total: number
  readonly pendingReview: number
  /** 成交额：paid / shipped / completed 订单的金额合计（不含取消）。 */
  readonly revenue: number
  /** 取消率：cancelled / total（0~1，总数为 0 时为 0）。 */
  readonly cancelRate: number
  readonly byStatus: readonly OrderStatusCount[]
  /** 按下单周聚合的成交金额，周一升序、空周补 0（供图表连续 X 轴）。 */
  readonly weeklyAmount: readonly OrderWeeklyAmountPoint[]
}

const REVENUE_STATUSES: readonly OrderStatus[] = [
  "paid",
  "shipped",
  "completed",
]

/** 取 ISO 时间所在周的周一（UTC）。 */
function weekStartOf(iso: string): string {
  const date = new Date(iso)
  const day = date.getUTCDay()
  // 0=周日 归到上一周的周一
  const offset = day === 0 ? -6 : 1 - day
  date.setUTCDate(date.getUTCDate() + offset)
  date.setUTCHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

/** 只读统计聚合：mock-first，切真实后端时换成对应接口，页面零改动。 */
export async function getOrderStats(): Promise<OrderStats> {
  await delay()
  const orders = findAll()
  const total = orders.length
  const pendingReview = orders.filter((order) =>
    isPendingReview(order.reviewState)
  ).length
  const revenueOrders = orders.filter((order) =>
    REVENUE_STATUSES.includes(order.status)
  )
  const revenue = revenueOrders.reduce(
    (sum, order) => sum + orderTotal(order),
    0
  )
  const cancelled = orders.filter(
    (order) => order.status === "cancelled"
  ).length
  const byStatus: OrderStatusCount[] = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }))

  const amountByWeek = new Map<string, number>()
  for (const order of revenueOrders) {
    const week = weekStartOf(order.createdAt)
    amountByWeek.set(week, (amountByWeek.get(week) ?? 0) + orderTotal(order))
  }
  const weeklyAmount: OrderWeeklyAmountPoint[] = []
  const weeks = [...amountByWeek.keys()].sort()
  if (weeks.length > 0) {
    const lastWeek = weeks[weeks.length - 1]!
    let cursor = new Date(`${weeks[0]}T00:00:00.000Z`)
    let key = cursor.toISOString().slice(0, 10)
    while (key <= lastWeek) {
      weeklyAmount.push({ weekStart: key, amount: amountByWeek.get(key) ?? 0 })
      cursor.setUTCDate(cursor.getUTCDate() + 7)
      key = cursor.toISOString().slice(0, 10)
    }
  }

  return {
    total,
    pendingReview,
    revenue,
    cancelRate: total === 0 ? 0 : cancelled / total,
    byStatus,
    weeklyAmount,
  }
}
