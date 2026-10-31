import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { BulkCancelOrdersDialog } from "../components/orders/bulk-cancel-orders-dialog"
import type { Order } from "../lib/orders/types"

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ORD-2026-0001",
    customer: "华东智造有限公司",
    status: "paid",
    note: "",
    lines: [],
    createdAt: "2026-10-02T09:15:00.000Z",
    updatedAt: "2026-10-12T14:30:00.000Z",
    ...overrides,
  }
}

const ORDERS: readonly Order[] = [
  makeOrder(),
  makeOrder({ id: "ORD-2026-0002", customer: "临港装备集团", status: "draft" }),
]

describe("BulkCancelOrdersDialog", () => {
  it("列出待取消的订单并可确认", async () => {
    const onConfirm = vi.fn()
    render(
      <BulkCancelOrdersDialog
        orders={ORDERS}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    )
    expect(await screen.findByText("批量取消 2 笔订单？")).toBeTruthy()
    expect(screen.getByText("ORD-2026-0001、ORD-2026-0002")).toBeTruthy()
    fireEvent.click(screen.getByText("确认批量取消"))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("没有待取消订单时不渲染确认框", () => {
    render(
      <BulkCancelOrdersDialog
        orders={null}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )
    expect(screen.queryByText("确认批量取消")).toBeNull()
  })
})
