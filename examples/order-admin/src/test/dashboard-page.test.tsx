import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { resetOrders } from "../lib/orders/mock-data"
import {
  getOrderStats,
  listOrders,
  type OrderStats,
} from "../lib/orders/service"
import { ORDER_STATUSES } from "../lib/orders/types"
import { DashboardPage } from "../pages/dashboard/page"

vi.mock("../lib/routing", () => ({
  AppLink: ({ href, children }: { href: string; children?: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useParams: () => ({}),
  useRouter: () => ({ push: vi.fn() }),
}))

// 统计 / 列表做成可注错的薄壳：默认走真实实现（读 resetOrders 后的种子）
vi.mock("../lib/orders/service", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../lib/orders/service")>()
  return {
    ...actual,
    getOrderStats: vi.fn(actual.getOrderStats),
    listOrders: vi.fn(actual.listOrders),
  }
})

/**
 * jsdom 没有 ResizeObserver，而 recharts 3 的 ResponsiveContainer 靠它拿
 * 容器尺寸（拿不到就一直空渲染）。这里同步回一个固定尺寸让图表出 svg——
 * 只断言图表容器与 svg 存在，不比像素。
 */
class ResizeObserverStub {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element): void {
    const entry = {
      target,
      contentRect: { width: 640, height: 240 },
    } as unknown as ResizeObserverEntry
    this.callback([entry], this as unknown as ResizeObserver)
  }

  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverStub)

const emptyStats: OrderStats = {
  total: 0,
  pendingReview: 0,
  revenue: 0,
  cancelRate: 0,
  byStatus: ORDER_STATUSES.map((status) => ({ status, count: 0 })),
  weeklyAmount: [],
}

beforeEach(() => {
  resetOrders()
})

describe("DashboardPage", () => {
  it("先渲染加载骨架，加载完成后 KPI 与种子一致", async () => {
    const { container } = render(<DashboardPage />)

    // service 有 80ms 延迟：同步阶段只有骨架，没有 KPI
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeNull()
    expect(screen.queryByText("订单总数")).toBeNull()

    const totalLabel = await screen.findByText("订单总数")
    expect(within(totalLabel.parentElement!).getByText("9")).not.toBeNull()
    const pendingLabel = await screen.findByText("待审核")
    expect(within(pendingLabel.parentElement!).getByText("3")).not.toBeNull()
    // 成交额 = 0001(9360) + 0003(32240) + 0004(9800) + 0007(6080)
    expect(screen.getByText("¥57,480")).not.toBeNull()
    expect(screen.getByText("11.1%")).not.toBeNull()
    expect(screen.getByText("履约状态分布")).not.toBeNull()
  })

  it("统计接口出错时展示告警与重试，重试后恢复", async () => {
    vi.mocked(getOrderStats).mockImplementationOnce(() =>
      Promise.reject(new Error("统计服务不可用"))
    )

    render(<DashboardPage />)

    expect(await screen.findByText("总览加载失败")).not.toBeNull()
    expect(screen.getByText("统计服务不可用")).not.toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /重试/ }))
    expect(await screen.findByText("订单总数")).not.toBeNull()
  })

  it("无订单时展示空态，不渲染 KPI", async () => {
    vi.mocked(getOrderStats).mockImplementationOnce(() =>
      Promise.resolve(emptyStats)
    )
    vi.mocked(listOrders).mockImplementationOnce(() => Promise.resolve([]))

    render(<DashboardPage />)

    expect(await screen.findByText("暂无订单数据")).not.toBeNull()
    expect(screen.queryByText("订单总数")).toBeNull()
  })

  it("最近订单出现 0001 且链接进详情，主图渲染 svg", async () => {
    render(<DashboardPage />)

    const link = await screen.findByRole("link", { name: "ORD-2026-0001" })
    expect(link.getAttribute("href")).toBe("/order-admin/orders/ORD-2026-0001")

    await waitFor(() => {
      const chart = document.querySelector('[data-slot="chart"]')
      expect(chart).not.toBeNull()
      expect(chart?.querySelector("svg")).not.toBeNull()
    })
  })
})
