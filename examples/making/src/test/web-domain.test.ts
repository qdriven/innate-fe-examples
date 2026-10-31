import { describe, expect, it } from "vitest"
import { webDomain } from "../web-domain"
import { BASE_PATH } from "../lib/base-path"

describe("making webDomain", () => {
  it("declares id, app outlet, nav and homeTile", () => {
    expect(webDomain.id).toBe("making")
    expect(webDomain.enabled).toBe(true)
    expect(webDomain.routes).toHaveLength(1)
    expect(webDomain.routes[0]?.outlet).toBe("app")
    expect(webDomain.capabilities.nav).toMatchObject({
      label: "Making",
      path: BASE_PATH,
    })
    expect(webDomain.capabilities.homeTile).toMatchObject({
      title: "Making",
      path: BASE_PATH,
    })
  })
})
