import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { OrderDetailSections } from "../components/orders/order-detail-sections"
import type { Order } from "../lib/orders/types"

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ORD-2026-0001",
    customer: "华东智造有限公司",
    status: "paid",
    category: "standard",
    reviewState: "approved",
    note: "",
    lines: [],
    createdAt: "2026-10-02T09:15:00.000Z",
    updatedAt: "2026-10-12T14:30:00.000Z",
    ...overrides,
  }
}

/** 取键值行（label 所在 div）的整行文本，用于断言行内 value。 */
function rowText(label: string): string {
  return screen.getByText(label).closest("div")?.textContent ?? ""
}

describe("OrderDetailSections", () => {
  it("standard 订单渲染交付信息区块与关键值", () => {
    render(
      <OrderDetailSections
        order={makeOrder({
          category: "standard",
          categoryMeta: {
            kind: "standard",
            dueDate: "2026-11-15",
            logisticsMethod: "德邦物流",
          },
        })}
      />
    )
    expect(screen.getByText("交付信息")).toBeTruthy()
    expect(screen.getByText("种类：标准单")).toBeTruthy()
    expect(rowText("交期")).toContain("2026-11-15")
    expect(rowText("物流方式")).toContain("德邦物流")
  })

  it("urgent 订单渲染加急 SLA 区块与关键值", () => {
    render(
      <OrderDetailSections
        order={makeOrder({
          category: "urgent",
          categoryMeta: {
            kind: "urgent",
            slaHours: 24,
            rushRate: 1.2,
            escalationContact: "值班经理 138-0000-0000",
          },
        })}
      />
    )
    expect(screen.getByText("加急 SLA")).toBeTruthy()
    expect(screen.getByText("种类：加急单")).toBeTruthy()
    expect(rowText("响应时效")).toContain("24 小时")
    expect(rowText("加急费率")).toContain("1.2×")
    expect(rowText("超时升级联系人")).toContain("值班经理 138-0000-0000")
  })

  it("subscription 订单渲染订阅周期区块与关键值", () => {
    render(
      <OrderDetailSections
        order={makeOrder({
          category: "subscription",
          categoryMeta: {
            kind: "subscription",
            cycleDays: 30,
            nextRestockAt: "2026-11-30",
            restockCount: 6,
          },
        })}
      />
    )
    expect(screen.getByText("订阅周期")).toBeTruthy()
    expect(screen.getByText("种类：订阅单")).toBeTruthy()
    expect(rowText("补货周期")).toContain("30 天")
    expect(rowText("下次补货日")).toContain("2026-11-30")
    expect(rowText("历史补货次数")).toContain("6 次")
  })

  it("framework 订单渲染协议额度区块与关键值", () => {
    render(
      <OrderDetailSections
        order={makeOrder({
          category: "framework",
          categoryMeta: {
            kind: "framework",
            contractNo: "HT-2026-Q4-018",
            creditLimit: 800000,
            creditUsed: 246000,
            validUntil: "2027-06-30",
          },
        })}
      />
    )
    expect(screen.getByText("协议额度")).toBeTruthy()
    expect(screen.getByText("种类：框架协议单")).toBeTruthy()
    expect(screen.queryByText("协议号")).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /协议额度/ }))
    expect(rowText("协议号")).toContain("HT-2026-Q4-018")
    expect(rowText("授信额度")).toContain("¥800000")
    expect(rowText("已用额度")).toContain("¥246000")
    expect(rowText("剩余额度")).toContain("¥554000")
    expect(rowText("有效期")).toContain("2027-06-30")
  })

  it("缺少 categoryMeta 时区块仍在，值全部兜底「—」", () => {
    const { rerender } = render(
      <OrderDetailSections order={makeOrder({ category: "urgent" })} />
    )
    expect(screen.getByText("加急 SLA")).toBeTruthy()
    expect(screen.getAllByText("—")).toHaveLength(3)

    rerender(
      <OrderDetailSections
        order={makeOrder({
          category: "framework",
          categoryMeta: undefined,
        })}
      />
    )
    expect(screen.getByText("协议额度")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: /协议额度/ }))
    expect(screen.getAllByText("—")).toHaveLength(5)
  })

  it("categoryMeta.kind 与种类不匹配时按种类兜底「—」", () => {
    render(
      <OrderDetailSections
        order={makeOrder({
          category: "standard",
          categoryMeta: {
            kind: "urgent",
            slaHours: 12,
            rushRate: 1.5,
            escalationContact: "调度中心",
          },
        })}
      />
    )
    expect(screen.getByText("交付信息")).toBeTruthy()
    expect(screen.getAllByText("—")).toHaveLength(2)
  })
})
