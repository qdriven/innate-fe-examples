import { describe, expect, it } from "vitest"
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
})
