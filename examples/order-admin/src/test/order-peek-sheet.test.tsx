import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { OrderPeekSheet } from "../components/orders/order-peek-sheet"
import type { Order } from "../lib/orders/types"

vi.mock("../lib/routing", () => ({
  AppLink: ({ href, children }: { href: string; children?: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useParams: () => ({}),
  useRouter: () => ({ push: vi.fn() }),
}))

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ORD-2026-0001",
    customer: "华东智造有限公司",
    status: "paid",
    category: "framework",
    reviewState: "approved",
    note: "Q4 框架采购",
    lines: [
      {
        id: "ORD-2026-0001-L1",
        sku: "SKU-1001",
        name: "工业传感器 S-200",
        quantity: 20,
        unitPrice: 320,
      },
      {
        id: "ORD-2026-0001-L2",
        sku: "SKU-1002",
        name: "网关模块 GW-8",
        quantity: 2,
        unitPrice: 1480,
      },
    ],
    createdAt: "2026-10-02T09:15:00.000Z",
    updatedAt: "2026-10-12T14:30:00.000Z",
    ...overrides,
  }
}

describe("OrderPeekSheet", () => {
  it("打开时展示订单号、客户、金额与明细行", async () => {
    render(<OrderPeekSheet order={makeOrder()} open onOpenChange={vi.fn()} />)

    // Sheet 是 Base UI portal，用 role + waitFor 等挂载
    expect(await screen.findByRole("dialog")).toBeTruthy()
    expect(await screen.findByText("ORD-2026-0001")).toBeTruthy()
    expect(screen.getByText("华东智造有限公司")).toBeTruthy()
    // 合计 = 20 × 320 + 2 × 1480
    expect(screen.getByText("¥9360.00")).toBeTruthy()
    // 明细行（品名 + SKU）
    expect(screen.getByText("工业传感器 S-200")).toBeTruthy()
    expect(screen.getByText("SKU-1001")).toBeTruthy()
    expect(screen.getByText("网关模块 GW-8")).toBeTruthy()
    // 种类与状态 Badge
    expect(screen.getByText("框架协议单")).toBeTruthy()
    expect(screen.getByText("已支付")).toBeTruthy()
    // 底部 AppLink 指向详情与编辑
    const detailLink = screen.getByRole("link", { name: /查看详情/ })
    expect(detailLink.getAttribute("href")).toBe("/orders/ORD-2026-0001")
    const editLink = screen.getByRole("link", { name: /编辑/ })
    expect(editLink.getAttribute("href")).toBe("/orders/ORD-2026-0001/edit")
  })

  it("关闭时触发 onOpenChange(false)", async () => {
    const onOpenChange = vi.fn()
    render(
      <OrderPeekSheet order={makeOrder()} open onOpenChange={onOpenChange} />
    )
    await screen.findByRole("dialog")
    // SheetContent 右上角关闭按钮（sr-only 文案 Close）
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    // Base UI 会带第二个 eventDetails 参数，只断言第一个 open 参数
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false)
  })

  it("order 为 null 时不渲染抽屉", () => {
    render(<OrderPeekSheet order={null} open onOpenChange={vi.fn()} />)
    expect(screen.queryByRole("dialog")).toBeNull()
    expect(screen.queryByText("ORD-2026-0001")).toBeNull()
  })
})
