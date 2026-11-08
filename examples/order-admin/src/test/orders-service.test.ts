import { beforeEach, describe, expect, it } from "vitest"
import { resetOrders } from "../lib/orders/mock-data"
import {
  bulkCancelOrders,
  createOrder,
  decideReview,
  getOrder,
  getOrderStats,
  InvalidReviewDecisionError,
  InvalidStatusTransitionError,
  listOrders,
  listReviewQueue,
  OrderNotFoundError,
  submitForReview,
  transitionOrderStatus,
  updateOrder,
} from "../lib/orders/service"
import { orderTotal, type OrderInput } from "../lib/orders/types"

const INPUT: OrderInput = {
  customer: "测试客户",
  category: "standard",
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

  it("filters by category and combines with status/search（AND）", async () => {
    const urgent = await listOrders({ category: "urgent" })
    expect(urgent.length).toBeGreaterThan(0)
    expect(urgent.every((order) => order.category === "urgent")).toBe(true)

    // category × status：种子里 0003 是 urgent + shipped
    const urgentShipped = await listOrders({
      category: "urgent",
      status: "shipped",
    })
    expect(urgentShipped.map((order) => order.id)).toEqual(["ORD-2026-0003"])

    // category × search：种子里 0002 是 standard + 临港
    const byCustomer = await listOrders({
      category: "standard",
      search: "临港",
    })
    expect(byCustomer.map((order) => order.id)).toEqual(["ORD-2026-0002"])

    // 四种种类各自都有种子
    for (const category of [
      "standard",
      "urgent",
      "subscription",
      "framework",
    ] as const) {
      const matched = await listOrders({ category })
      expect(matched.length).toBeGreaterThan(0)
      expect(matched.every((order) => order.category === category)).toBe(true)
    }

    // 无交集时返回空
    const none = await listOrders({
      category: "framework",
      search: "不存在的客户",
    })
    expect(none).toHaveLength(0)
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
    expect(order.category).toBe("standard")
    // 新建草稿即进入待审队列
    expect(order.reviewState).toBe("pending")
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
      category: "urgent",
      note: "加急",
    })
    expect(updated.customer).toBe("改名客户")
    expect(updated.category).toBe("urgent")
    expect(updated.note).toBe("加急")
    expect(updated.status).toBe("draft")
    expect(updated.createdAt).toBe(created.createdAt)
  })

  it("编辑换种类时保留不了旧种类的 categoryMeta，种类不变则保留", async () => {
    const created = await createOrder({
      ...INPUT,
      categoryMeta: {
        kind: "standard",
        dueDate: "2026-12-01",
        logisticsMethod: "德邦物流",
      },
    })
    const sameCategory = await updateOrder(created.id, INPUT)
    expect(sameCategory.categoryMeta).toEqual({
      kind: "standard",
      dueDate: "2026-12-01",
      logisticsMethod: "德邦物流",
    })

    const switched = await updateOrder(created.id, {
      ...INPUT,
      category: "urgent",
    })
    expect(switched.category).toBe("urgent")
    expect(switched.categoryMeta).toBeUndefined()
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

describe("审核队列与决策", () => {
  it("listReviewQueue 只返回 pending 订单", async () => {
    const queue = await listReviewQueue()
    expect(queue.length).toBeGreaterThan(0)
    expect(queue.every((order) => order.reviewState === "pending")).toBe(true)
    expect(queue.map((order) => order.id)).toContain("ORD-2026-0002")
    // 0001 已批准、0005 已拒绝，都不在队列
    expect(queue.map((order) => order.id)).not.toContain("ORD-2026-0001")
    expect(queue.map((order) => order.id)).not.toContain("ORD-2026-0005")
    // 按提交时间（updatedAt）升序
    const times = queue.map((order) => order.updatedAt)
    expect([...times].sort()).toEqual(times)
  })

  it("decideReview(approved) 写入 store 并出队", async () => {
    const decided = await decideReview("ORD-2026-0002", "approved")
    expect(decided.reviewState).toBe("approved")
    expect(decided.reviewDecidedAt).toBeTruthy()

    const stored = await getOrder("ORD-2026-0002")
    expect(stored.reviewState).toBe("approved")

    const queue = await listReviewQueue()
    expect(queue.map((order) => order.id)).not.toContain("ORD-2026-0002")
  })

  it("rejected 必填 reason：缺省抛错且不写入，填写后落库", async () => {
    await expect(
      decideReview("ORD-2026-0002", "rejected")
    ).rejects.toBeInstanceOf(InvalidReviewDecisionError)
    await expect(
      decideReview("ORD-2026-0002", "rejected", "   ")
    ).rejects.toBeInstanceOf(InvalidReviewDecisionError)
    // 两次失败都没动 store
    expect((await getOrder("ORD-2026-0002")).reviewState).toBe("pending")

    const rejected = await decideReview(
      "ORD-2026-0002",
      "rejected",
      "  预算不足  "
    )
    expect(rejected.reviewState).toBe("rejected")
    expect(rejected.reviewReason).toBe("预算不足")
    expect(rejected.reviewDecidedAt).toBeTruthy()
  })

  it("已决策的订单不可再次决策（终态）", async () => {
    await decideReview("ORD-2026-0002", "approved")
    await expect(
      decideReview("ORD-2026-0002", "rejected", "补一刀")
    ).rejects.toBeInstanceOf(InvalidReviewDecisionError)
    await expect(
      decideReview("ORD-2026-0002", "approved")
    ).rejects.toBeInstanceOf(InvalidReviewDecisionError)
  })

  it("submitForReview：pending 可提交并刷新提交时间，已决策抛错", async () => {
    const submitted = await submitForReview("ORD-2026-0002")
    expect(submitted.reviewState).toBe("pending")

    await expect(submitForReview("ORD-2026-0001")).rejects.toBeInstanceOf(
      InvalidReviewDecisionError
    )
    await expect(submitForReview("ORD-9999")).rejects.toBeInstanceOf(
      OrderNotFoundError
    )
  })
})

describe("审核与状态机耦合（rejected 拦截确认）", () => {
  it("rejected 的草稿不可 draft→confirmed，但可取消", async () => {
    const created = await createOrder(INPUT)
    await decideReview(created.id, "rejected", "定价超出授权")

    await expect(
      transitionOrderStatus(created.id, "confirmed")
    ).rejects.toBeInstanceOf(InvalidReviewDecisionError)
    // 状态没有被推进
    expect((await getOrder(created.id)).status).toBe("draft")

    const cancelled = await transitionOrderStatus(created.id, "cancelled")
    expect(cancelled.status).toBe("cancelled")
  })

  it("pending / approved 的草稿确认不受影响", async () => {
    const created = await createOrder(INPUT)
    const confirmed = await transitionOrderStatus(created.id, "confirmed")
    expect(confirmed.status).toBe("confirmed")

    const another = await createOrder(INPUT)
    await decideReview(another.id, "approved")
    const confirmedAgain = await transitionOrderStatus(another.id, "confirmed")
    expect(confirmedAgain.status).toBe("confirmed")
  })
})

describe("getOrderStats（dashboard 聚合）", () => {
  it("总数 / 待审 / 成交额 / 取消率 / 状态分布与种子一致", async () => {
    const stats = await getOrderStats()
    const all = await listOrders()

    expect(stats.total).toBe(all.length)
    expect(stats.total).toBeGreaterThanOrEqual(9)
    expect(stats.pendingReview).toBe(
      all.filter((order) => order.reviewState === "pending").length
    )
    expect(stats.pendingReview).toBeGreaterThanOrEqual(1)

    const expectedRevenue = all
      .filter((order) =>
        ["paid", "shipped", "completed"].includes(order.status)
      )
      .reduce((sum, order) => sum + orderTotal(order), 0)
    expect(stats.revenue).toBe(expectedRevenue)
    expect(stats.revenue).toBeGreaterThan(0)

    const cancelled = all.filter((order) => order.status === "cancelled").length
    expect(stats.cancelRate).toBeCloseTo(cancelled / all.length)

    expect(stats.byStatus).toHaveLength(6)
    expect(stats.byStatus.reduce((sum, item) => sum + item.count, 0)).toBe(
      stats.total
    )
  })

  it("按周金额趋势：周一升序、空周补 0、金额非负", async () => {
    const stats = await getOrderStats()
    expect(stats.weeklyAmount.length).toBeGreaterThan(1)

    const keys = stats.weeklyAmount.map((point) => point.weekStart)
    expect([...keys].sort()).toEqual(keys)
    for (const point of stats.weeklyAmount) {
      expect(point.weekStart).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      // weekStart 必须是周一（UTC）
      expect(new Date(`${point.weekStart}T00:00:00.000Z`).getUTCDay()).toBe(1)
      expect(point.amount).toBeGreaterThanOrEqual(0)
    }
    // 有成交的周金额 > 0（至少一周）
    expect(stats.weeklyAmount.some((point) => point.amount > 0)).toBe(true)
  })
})
