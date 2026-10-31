import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { OrdersTable } from "../components/orders/orders-table"
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
    note: "",
    lines: [
      {
        id: "ORD-2026-0001-L1",
        sku: "SKU-1001",
        name: "工业传感器 S-200",
        quantity: 20,
        unitPrice: 320,
      },
    ],
    createdAt: "2026-10-02T09:15:00.000Z",
    updatedAt: "2026-10-12T14:30:00.000Z",
    ...overrides,
  }
}

const ORDERS: readonly Order[] = [
  makeOrder(),
  makeOrder({
    id: "ORD-2026-0002",
    customer: "临港装备集团",
    status: "draft",
    lines: [
      {
        id: "ORD-2026-0002-L1",
        sku: "SKU-2001",
        name: "精密轴承 BR-45",
        quantity: 100,
        unitPrice: 46,
      },
    ],
  }),
]

/** 终态订单：不可勾选，也不能进入批量选择。 */
const TERMINAL_ORDER = makeOrder({
  id: "ORD-2026-0003",
  customer: "华北电控股份",
  status: "completed",
})

describe("OrdersTable", () => {
  it("renders a row per order with id, customer and status", () => {
    render(<OrdersTable orders={ORDERS} onCancel={vi.fn()} />)
    expect(screen.getByText("ORD-2026-0001")).toBeTruthy()
    expect(screen.getByText("ORD-2026-0002")).toBeTruthy()
    expect(screen.getByText("华东智造有限公司")).toBeTruthy()
    expect(screen.getByText("已支付")).toBeTruthy()
    expect(screen.getByText("草稿")).toBeTruthy()
    // 合计 = 20 × 320
    expect(screen.getByText("¥6400.00")).toBeTruthy()
  })

  it("shows the empty state when there are no orders", () => {
    render(<OrdersTable orders={[]} onCancel={vi.fn()} />)
    expect(screen.getByText("还没有订单")).toBeTruthy()
  })

  it("状态筛选框显示中文标签而不是原始值", () => {
    render(<OrdersTable orders={ORDERS} onCancel={vi.fn()} />)
    // Base UI 的 SelectValue 不给 items 映射时会直接渲染原始 value（"all"）
    expect(screen.getByText("全部状态")).toBeTruthy()
    expect(screen.queryByText("all")).not.toBeTruthy()
  })

  it("filters rows by search on id and customer", async () => {
    render(<OrdersTable orders={ORDERS} onCancel={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText("搜索订单号或客户"), {
      target: { value: "临港" },
    })
    await waitFor(() => {
      expect(screen.queryByText("ORD-2026-0001")).not.toBeTruthy()
    })
    expect(screen.getByText("ORD-2026-0002")).toBeTruthy()
  })

  it("shows the filtered empty state when nothing matches", async () => {
    render(<OrdersTable orders={ORDERS} onCancel={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText("搜索订单号或客户"), {
      target: { value: "不存在的客户" },
    })
    expect(await screen.findByText("没有匹配的订单")).toBeTruthy()
  })

  it("offers cancel in the row action menu for non-terminal orders", async () => {
    const onCancel = vi.fn()
    render(<OrdersTable orders={ORDERS} onCancel={onCancel} />)

    const triggers = screen.getAllByRole("button", { name: "订单操作" })
    // 第二行是 draft（非终态），菜单里应有取消
    fireEvent.click(triggers[1]!)
    const cancelItem = await screen.findByText("取消订单")
    fireEvent.click(cancelItem)
    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledWith(
        expect.objectContaining({ id: "ORD-2026-0002" })
      )
    })
  })
})

describe("OrdersTable 批量选择", () => {
  it("终态订单的勾选框禁用，不允许进入批量选择", () => {
    render(
      <OrdersTable
        orders={[...ORDERS, TERMINAL_ORDER]}
        onCancel={vi.fn()}
        onBulkCancel={vi.fn()}
      />
    )
    const terminalBox = screen.getByRole("checkbox", {
      name: "选择订单 ORD-2026-0003（不可取消）",
    })
    expect(terminalBox.getAttribute("aria-disabled")).toBe("true")

    const cancellableBox = screen.getByRole("checkbox", {
      name: "选择订单 ORD-2026-0002",
    })
    expect(cancellableBox.getAttribute("aria-disabled")).toBeNull()
  })

  it("未勾选时不出现批量操作入口", () => {
    render(
      <OrdersTable orders={ORDERS} onCancel={vi.fn()} onBulkCancel={vi.fn()} />
    )
    expect(screen.queryByText("批量操作")).toBeNull()
  })

  it("勾选后出现批量操作入口，确认时回调选中的订单", async () => {
    const onBulkCancel = vi.fn()
    render(
      <OrdersTable
        orders={ORDERS}
        onCancel={vi.fn()}
        onBulkCancel={onBulkCancel}
      />
    )
    fireEvent.click(
      screen.getByRole("checkbox", { name: "选择订单 ORD-2026-0002" })
    )
    fireEvent.click(await screen.findByText("批量操作"))
    fireEvent.click(await screen.findByText("批量取消"))
    await waitFor(() => {
      expect(onBulkCancel).toHaveBeenCalledWith([
        expect.objectContaining({ id: "ORD-2026-0002" }),
      ])
    })
  })

  it("全选只选中可取消的订单", async () => {
    const onBulkCancel = vi.fn()
    render(
      <OrdersTable
        orders={[...ORDERS, TERMINAL_ORDER]}
        onCancel={vi.fn()}
        onBulkCancel={onBulkCancel}
      />
    )
    fireEvent.click(screen.getByRole("checkbox", { name: "全选可取消订单" }))
    fireEvent.click(await screen.findByText("批量操作"))
    fireEvent.click(await screen.findByText("批量取消"))
    await waitFor(() => {
      expect(onBulkCancel).toHaveBeenCalledWith([
        expect.objectContaining({ id: "ORD-2026-0001" }),
        expect.objectContaining({ id: "ORD-2026-0002" }),
      ])
    })
  })
})
