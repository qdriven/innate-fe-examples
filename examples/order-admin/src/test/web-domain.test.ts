import { describe, expect, it } from "vitest"
import { createRootRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import { createStandaloneWebDomainRouter } from "@innate/web-domain"
import { BASE_PATH } from "../lib/base-path"
import { webDomain } from "../web-domain"

describe("order-admin webDomain", () => {
  it("declares id, app outlet, nav and homeTile", () => {
    expect(webDomain.id).toBe("order-admin")
    expect(webDomain.enabled).toBe(true)
    expect(webDomain.routes).toHaveLength(1)
    expect(webDomain.routes[0]?.outlet).toBe("app")
    expect(webDomain.capabilities.nav).toMatchObject({
      label: "订单管理",
      path: `${BASE_PATH}/orders`,
    })
    expect(webDomain.capabilities.homeTile).toMatchObject({
      title: "订单管理",
      path: `${BASE_PATH}/orders`,
    })
  })

  it("declares page paths for orders, dashboard and review", () => {
    // routes 只记录 outlet 挂载点，页面路径在工厂产出的布局子树里
    const layout = webDomain.routes[0]!.factory(
      createRootRoute() as unknown as AnyRoute
    )
    const children = (layout.children ?? []) as {
      options: { path?: string }
    }[]
    const paths = children.map((child) => child.options.path)
    expect(paths).toEqual(
      expect.arrayContaining([
        `${BASE_PATH}/orders`,
        `${BASE_PATH}/orders/new`,
        `${BASE_PATH}/orders/$orderId`,
        `${BASE_PATH}/orders/$orderId/edit`,
        `${BASE_PATH}/dashboard`,
        `${BASE_PATH}/review`,
      ])
    )
  })

  it("standalone router matches the orders list", async () => {
    const router = createStandaloneWebDomainRouter(webDomain, {
      initialEntries: [`${BASE_PATH}/orders`],
    })
    await router.load()
    expect(router.state.location.pathname).toBe(`${BASE_PATH}/orders`)
    expect(router.state.matches.map((match) => match.routeId)).not.toEqual([])
  })

  it("standalone router matches dashboard and review", async () => {
    for (const path of [`${BASE_PATH}/dashboard`, `${BASE_PATH}/review`]) {
      const router = createStandaloneWebDomainRouter(webDomain, {
        initialEntries: [path],
      })
      await router.load()
      expect(router.state.location.pathname).toBe(path)
      expect(router.state.matches.map((match) => match.routeId)).not.toEqual([])
    }
  })
})
