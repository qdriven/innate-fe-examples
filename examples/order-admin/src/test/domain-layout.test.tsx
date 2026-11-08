/**
 * DomainLayout 顶栏测试：三条域内导航 href（AppLink 自动补 BASE_PATH、
 * 当前项 aria-current 高亮）与 ThemeSelector 主题切换落盘
 * （documentElement[data-theme] + localStorage["theme-variant"]）。
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { ThemeProvider } from "@innate/ui"
import { DomainLayout } from "../components/domain-layout"
import { resetOrders } from "../lib/orders/mock-data"

// AppLink 保持生产语义：非外链 href 统一补 BASE_PATH（同 lib/routing）
vi.mock("../lib/routing", async () => {
  const { withBasePath } = await import("../lib/base-path")
  return {
    AppLink: ({
      href,
      children,
      ...props
    }: Omit<ComponentPropsWithoutRef<"a">, "href"> & {
      href: string
      children?: ReactNode
    }) => (
      <a href={withBasePath(href)} {...props}>
        {children}
      </a>
    ),
    useParams: () => ({}),
    useRouter: () => ({ push: vi.fn() }),
  }
})

// DomainLayout 自挂 Toaster：只需占位，不拉起 sonner 真实渲染
vi.mock("sonner", () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}))

beforeEach(() => {
  resetOrders()
  localStorage.clear()
  document.documentElement.removeAttribute("data-theme")
})

/** 用最小路由树挂 DomainLayout（同壳测试的 renderInRouter 惯例）。 */
function renderLayout(initialPath = "/order-admin/orders") {
  const rootRoute = createRootRoute({ component: DomainLayout })
  const routes: any[] = [
    "/order-admin/dashboard",
    "/order-admin/orders",
    "/order-admin/review",
  ].map((path) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => null,
    })
  )
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })
  return render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

describe("DomainLayout 顶栏", () => {
  it("三条域内导航链接指向带 BASE_PATH 的路径，当前页项高亮", async () => {
    renderLayout()

    const dashboard = await screen.findByRole("link", { name: "总览" })
    const orders = await screen.findByRole("link", { name: "订单管理" })
    const review = await screen.findByRole("link", { name: "审核中心" })

    expect(dashboard.getAttribute("href")).toBe("/order-admin/dashboard")
    expect(orders.getAttribute("href")).toBe("/order-admin/orders")
    expect(review.getAttribute("href")).toBe("/order-admin/review")

    // 初始落在订单管理：该项 aria-current=page，其余不带
    expect(orders.getAttribute("aria-current")).toBe("page")
    expect(dashboard.getAttribute("aria-current")).toBeNull()
    expect(review.getAttribute("aria-current")).toBeNull()
  })

  it("点 ThemeSelector 菜单项后 data-theme 与 localStorage 同步切换", async () => {
    renderLayout()

    const trigger = await screen.findByRole("button", { name: /select theme/i })
    fireEvent.click(trigger)
    fireEvent.click(await screen.findByText("Linear"))

    await waitFor(() => {
      expect(document.documentElement.getAttribute("data-theme")).toBe("linear")
      expect(localStorage.getItem("theme-variant")).toBe("linear")
    })
  })
})
