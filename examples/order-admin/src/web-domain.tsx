import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { OrdersPage } from "./pages/orders/page"
import { OrderCreatePage } from "./pages/orders/new/page"
import { OrderDetailPage } from "./pages/orders/[orderId]/page"
import { OrderEditPage } from "./pages/orders/[orderId]/edit/page"

function pageRoute(
  parent: AnyRoute,
  path: string,
  component: () => ReactElement | null
) {
  return createRoute({
    getParentRoute: () => parent,
    path,
    component,
  })
}

export const webDomain = createWebDomain(DOMAIN_ID)
  .addRoute("app", (parent: AnyRoute) => {
    const layout = createRoute({
      getParentRoute: () => parent,
      id: "_order-admin",
      component: DomainLayout,
    })

    const detail = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/orders/$orderId`,
      component: OrderDetailPage,
    })

    const edit = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/orders/$orderId/edit`,
      component: OrderEditPage,
    })

    return layout.addChildren([
      pageRoute(layout, `${BASE_PATH}/orders`, OrdersPage),
      pageRoute(layout, `${BASE_PATH}/orders/new`, OrderCreatePage),
      detail,
      edit,
    ] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "订单管理",
    path: `${BASE_PATH}/orders`,
    icon: "ShoppingCart",
    order: 36,
  })
  .addCapability("homeTile", {
    title: "订单管理",
    description: "订单 CRUD 黄金样例：列表、详情、创建与状态流转。",
    path: `${BASE_PATH}/orders`,
  })
  .build()
