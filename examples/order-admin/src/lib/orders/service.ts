import { findAll, findById, insertOrder, replaceOrder } from "./mock-data"
import {
  isCancellableStatus,
  ORDER_STATUS_LABELS,
  ORDER_TRANSITIONS,
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
