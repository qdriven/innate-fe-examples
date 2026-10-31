import { describe, expect, it } from "vitest"
import { webDomain } from "../web-domain"
import { BASE_PATH } from "../lib/base-path"

describe("awesome webDomain", () => {
  it("declares id, app outlet, nav and homeTile", () => {
    expect(webDomain.id).toBe("awesome")
    expect(webDomain.enabled).toBe(true)
    expect(webDomain.routes).toHaveLength(1)
    expect(webDomain.routes[0]?.outlet).toBe("app")
    expect(webDomain.capabilities.nav).toMatchObject({
      label: "Awesome",
      path: BASE_PATH,
    })
    expect(webDomain.capabilities.homeTile).toMatchObject({
      title: "Awesome",
      path: BASE_PATH,
    })
  })
})
