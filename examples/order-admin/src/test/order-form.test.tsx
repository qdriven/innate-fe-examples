import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { OrderForm } from "../components/orders/order-form"
import type { Order } from "../lib/orders/types"

const EXISTING: Order = {
  id: "ORD-2026-0003",
  customer: "南州传动科技",
  status: "shipped",
  note: "指定物流",
  lines: [
    {
      id: "ORD-2026-0003-L1",
      sku: "SKU-3001",
      name: "伺服电机",
      quantity: 4,
      unitPrice: 5600,
    },
  ],
  createdAt: "2026-09-21T08:40:00.000Z",
  updatedAt: "2026-10-20T16:05:00.000Z",
}

function fillLine(
  index: number,
  sku: string,
  name: string,
  qty: string,
  price: string
) {
  fireEvent.change(screen.getAllByPlaceholderText("SKU")[index]!, {
    target: { value: sku },
  })
  fireEvent.change(screen.getAllByPlaceholderText("品名")[index]!, {
    target: { value: name },
  })
  fireEvent.change(screen.getAllByPlaceholderText("数量")[index]!, {
    target: { value: qty },
  })
  fireEvent.change(screen.getAllByPlaceholderText("单价")[index]!, {
    target: { value: price },
  })
}

describe("OrderForm", () => {
  it("renders one empty line and blocks submit without customer", async () => {
    const onSubmit = vi.fn()
    render(<OrderForm submitLabel="保存订单" onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole("button", { name: "保存订单" }))
    expect(await screen.findByText("请填写客户名")).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("submits mapped OrderInput for a valid form", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<OrderForm submitLabel="保存订单" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText("客户 / 采购方"), {
      target: { value: "华东智造" },
    })
    fireEvent.change(screen.getByPlaceholderText("选填"), {
      target: { value: "加急" },
    })
    fillLine(0, "SKU-T1", "测试物料", "3", "120")
    fireEvent.click(screen.getByRole("button", { name: "保存订单" }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
    expect(onSubmit).toHaveBeenCalledWith({
      customer: "华东智造",
      note: "加急",
      lines: [{ sku: "SKU-T1", name: "测试物料", quantity: 3, unitPrice: 120 }],
    })
  })

  it("adds and removes line rows", () => {
    render(<OrderForm onSubmit={vi.fn()} />)
    expect(screen.getAllByPlaceholderText("SKU")).toHaveLength(1)

    fireEvent.click(screen.getByRole("button", { name: "添加明细" }))
    expect(screen.getAllByPlaceholderText("SKU")).toHaveLength(2)

    fireEvent.click(screen.getAllByRole("button", { name: "删除明细" })[1]!)
    expect(screen.getAllByPlaceholderText("SKU")).toHaveLength(1)
  })

  it("prefills from an existing order", () => {
    render(<OrderForm order={EXISTING} onSubmit={vi.fn()} />)
    expect(
      (screen.getByPlaceholderText("客户 / 采购方") as HTMLInputElement).value
    ).toBe("南州传动科技")
    expect(
      (screen.getAllByPlaceholderText("SKU")[0] as HTMLInputElement).value
    ).toBe("SKU-3001")
    expect(
      (screen.getAllByPlaceholderText("数量")[0] as HTMLInputElement).value
    ).toBe("4")
  })
})
