import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { resetOrders } from "../lib/orders/mock-data"
import { ReviewPage } from "../pages/review/page"

vi.mock("../lib/routing", () => ({
  AppLink: ({ href, children }: { href: string; children?: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useParams: () => ({}),
  useRouter: () => ({ push: vi.fn() }),
}))

const { toastSuccess, toastError } = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccess,
    error: toastError,
    warning: vi.fn(),
  },
}))

beforeEach(() => {
  resetOrders()
  toastSuccess.mockClear()
  toastError.mockClear()
})

/** 队列里出现的订单号（左侧 TableCard 的行）。 */
async function queueIds(): Promise<string[]> {
  const buttons = await screen.findAllByRole("button", {
    name: /选择审核订单 ORD-/,
  })
  return buttons.map((button) => (button.textContent ?? "").trim())
}

describe("ReviewPage 审核流程", () => {
  it("队列渲染全部 pending 种子，不含终态订单", async () => {
    render(<ReviewPage />)

    const ids = await queueIds()
    // P0 种子：0002 / 0008 / 0009 为 pending
    expect(ids).toContain("ORD-2026-0002")
    expect(ids).toContain("ORD-2026-0008")
    expect(ids).toContain("ORD-2026-0009")
    // 0001 approved / 0005 rejected 不在队列
    expect(ids).not.toContain("ORD-2026-0001")
    expect(ids).not.toContain("ORD-2026-0005")
    expect(ids).toHaveLength(3)
  })

  it("点批准后订单出队并 toast 成功", async () => {
    render(<ReviewPage />)

    await queueIds()
    // 队列按 updatedAt 升序，首条 = ORD-2026-0002，页面自动选中
    fireEvent.click(await screen.findByRole("button", { name: "批准" }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("订单 ORD-2026-0002 已批准")
    })
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "选择审核订单 ORD-2026-0002" })
      ).toBeNull()
    })
    // 队列减少但不空，且批准不会触发 error
    expect(toastError).not.toHaveBeenCalled()
    const remaining = await queueIds()
    expect(remaining).toHaveLength(2)
    expect(remaining).toContain("ORD-2026-0008")
  })

  it("退回未填原因被拦截，订单不出队", async () => {
    render(<ReviewPage />)

    await queueIds()
    fireEvent.click(await screen.findByRole("button", { name: "退回补充" }))

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("退回必须填写原因")
    })
    // 仍在队列中
    expect(
      screen.getByRole("button", { name: "选择审核订单 ORD-2026-0002" })
    ).toBeTruthy()
    expect(toastSuccess).not.toHaveBeenCalled()
  })

  it("填写原因后退回，订单出队", async () => {
    render(<ReviewPage />)

    await queueIds()
    fireEvent.change(screen.getByLabelText("退回原因（退回必填）"), {
      target: { value: "预算不足，退回修改" },
    })
    fireEvent.click(await screen.findByRole("button", { name: "退回补充" }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith("订单 ORD-2026-0002 已退回")
    })
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "选择审核订单 ORD-2026-0002" })
      ).toBeNull()
    })
    const remaining = await queueIds()
    expect(remaining).toHaveLength(2)
    expect(remaining).toContain("ORD-2026-0008")
  })
})
