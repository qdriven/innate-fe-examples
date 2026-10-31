import { beforeEach, describe, expect, it } from "vitest"
import { resetOrders } from "../lib/orders/mock-data"
import {
  bulkCancelOrders,
  createOrder,
  getOrder,
  InvalidStatusTransitionError,
  listOrders,
  OrderNotFoundError,
  transitionOrderStatus,
  updateOrder,
} from "../lib/orders/service"
import { orderTotal } from "../lib/orders/types"

const INPUT = {
  customer: "测试客户",
  note: "",
  lines: [{ sku: "SKU-T1", name: "测试物料", quantity: 2, unitPrice: 100 }],
}

beforeEach(() => {
  resetOrders()
})

describe("listOrders", () => {
  it("returns all seeded orders", async () => {
    const orders = await listOrders()
    expect(orders.length).toBeGreaterThanOrEqual(5)
  })

  it("filters by status and search", async () => {
    const drafts = await listOrders({ status: "draft" })
    expect(drafts.length).toBeGreaterThan(0)
    expect(drafts.every((order) => order.status === "draft")).toBe(true)

    const byId = await listOrders({ search: "ORD-2026-0001" })
    expect(byId.map((order) => order.id)).toEqual(["ORD-2026-0001"])

    const byCustomer = await listOrders({ search: "华东" })
    expect(byCustomer.every((order) => order.customer.includes("华东"))).toBe(
      true
    )
  })
})

describe("getOrder", () => {
  it("returns the order for a known id", async () => {
    const order = await getOrder("ORD-2026-0001")
    expect(order.customer).toBe("华东智造有限公司")
    expect(orderTotal(order)).toBeGreaterThan(0)
  })

  it("throws OrderNotFoundError for unknown ids", async () => {
    await expect(getOrder("ORD-9999")).rejects.toBeInstanceOf(
      OrderNotFoundError
    )
  })
})

describe("createOrder / updateOrder", () => {
  it("creates a draft order with generated id and line ids", async () => {
    const order = await createOrder(INPUT)
    expect(order.id).toMatch(/^ORD-2026-\d{4}$/)
    expect(order.status).toBe("draft")
    expect(order.lines).toHaveLength(1)
    expect(order.lines[0]?.id).toBe(`${order.id}-L1`)
    expect(orderTotal(order)).toBe(200)

    const again = await getOrder(order.id)
    expect(again.customer).toBe("测试客户")
  })

  it("updates fields but keeps status and timestamps baseline", async () => {
    const created = await createOrder(INPUT)
    const updated = await updateOrder(created.id, {
      ...INPUT,
      customer: "改名客户",
      note: "加急",
    })
    expect(updated.customer).toBe("改名客户")
    expect(updated.note).toBe("加急")
    expect(updated.status).toBe("draft")
    expect(updated.createdAt).toBe(created.createdAt)
  })
})

describe("transitionOrderStatus（状态机）", () => {
  it("walks the happy path draft → confirmed → paid → shipped → completed", async () => {
    const created = await createOrder(INPUT)
    const path = ["confirmed", "paid", "shipped", "completed"] as const
    let current = created
    for (const next of path) {
      current = await transitionOrderStatus(current.id, next)
      expect(current.status).toBe(next)
    }
    await expect(
      transitionOrderStatus(current.id, "cancelled")
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError)
  })

  it("cancels from non-terminal states but not from terminal ones", async () => {
    const created = await createOrder(INPUT)
    const cancelled = await transitionOrderStatus(created.id, "cancelled")
    expect(cancelled.status).toBe("cancelled")
    await expect(
      transitionOrderStatus(created.id, "confirmed")
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError)
  })

  it("rejects skipping states (draft → completed)", async () => {
    const created = await createOrder(INPUT)
    await expect(
      transitionOrderStatus(created.id, "completed")
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError)
  })

  it("cancels a shipped order（非终态均可取消）", async () => {
    const created = await createOrder(INPUT)
    let current = await transitionOrderStatus(created.id, "confirmed")
    current = await transitionOrderStatus(current.id, "paid")
    current = await transitionOrderStatus(current.id, "shipped")
    const cancelled = await transitionOrderStatus(current.id, "cancelled")
    expect(cancelled.status).toBe("cancelled")
  })
})

describe("bulkCancelOrders（批量取消）", () => {
  it("把选中的非终态订单全部流转为 cancelled", async () => {
    const result = await bulkCancelOrders([
      "ORD-2026-0001", // paid
      "ORD-2026-0002", // draft
      "ORD-2026-0003", // shipped
    ])
    expect(result.skipped).toHaveLength(0)
    expect(result.cancelled.map((order) => order.id)).toEqual([
      "ORD-2026-0001",
      "ORD-2026-0002",
      "ORD-2026-0003",
    ])
    expect(
      result.cancelled.every((order) => order.status === "cancelled")
    ).toBe(true)
    const stored = await getOrder("ORD-2026-0003")
    expect(stored.status).toBe("cancelled")
  })

  it("跳过终态订单并回报原因，不影响订单本身", async () => {
    const result = await bulkCancelOrders([
      "ORD-2026-0004", // completed
      "ORD-2026-0005", // cancelled
    ])
    expect(result.cancelled).toHaveLength(0)
    expect(result.skipped.map((skip) => skip.id)).toEqual([
      "ORD-2026-0004",
      "ORD-2026-0005",
    ])
    expect(result.skipped[0]?.reason).toContain("不可取消")
    const stored = await getOrder("ORD-2026-0004")
    expect(stored.status).toBe("completed")
  })

  it("跳过不存在的订单并回报原因", async () => {
    const result = await bulkCancelOrders(["ORD-9999"])
    expect(result.cancelled).toHaveLength(0)
    expect(result.skipped[0]).toEqual({ id: "ORD-9999", reason: "订单不存在" })
  })

  it("重复 id 只处理一次", async () => {
    const result = await bulkCancelOrders(["ORD-2026-0001", "ORD-2026-0001"])
    expect(result.cancelled).toHaveLength(1)
    expect(result.skipped).toHaveLength(0)
  })
})
