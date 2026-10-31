import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { resetOrders } from "../lib/orders/mock-data"
import { OrdersPage } from "../pages/orders/page"

vi.mock("../lib/routing", () => ({
  AppLink: ({ href, children }: { href: string; children?: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useParams: () => ({}),
  useRouter: () => ({ push: vi.fn() }),
}))

const { toastSuccess, toastWarning, toastError } = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
  toastWarning: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccess,
    warning: toastWarning,
    error: toastError,
  },
}))

beforeEach(() => {
  resetOrders()
  toastSuccess.mockClear()
  toastWarning.mockClear()
  toastError.mockClear()
})

describe("OrdersPage 批量取消", () => {
  it("勾选非终态订单后确认批量取消，订单流转为已取消", async () => {
    render(<OrdersPage />)

    // 列表异步加载
    const checkbox = await screen.findByRole("checkbox", {
      name: "选择订单 ORD-2026-0002",
    })
    fireEvent.click(checkbox)

    fireEvent.click(await screen.findByText("批量操作"))
    fireEvent.click(await screen.findByText("批量取消"))

    // 二次确认
    fireEvent.click(await screen.findByText("确认批量取消"))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("已取消 1 笔订单")
    })
    // 已取消的订单回到终态，不能再被勾选
    await waitFor(() => {
      expect(
        screen
          .getByRole("checkbox", {
            name: "选择订单 ORD-2026-0002（不可取消）",
          })
          .getAttribute("aria-disabled")
      ).toBe("true")
    })
  })

  it("终态订单不可勾选，无法进入批量选择", async () => {
    render(<OrdersPage />)

    const terminalBox = await screen.findByRole("checkbox", {
      name: "选择订单 ORD-2026-0004（不可取消）",
    })
    expect(terminalBox.getAttribute("aria-disabled")).toBe("true")
  })
})
