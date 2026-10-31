import { describe, expect, it } from "vitest"
import { BASE_PATH } from "../lib/base-path"
import { webDomain } from "../web-domain"

describe("sqlite-admin webDomain", () => {
  it("declares the sqlite admin route", () => {
    expect(webDomain.id).toBe("sqlite-admin")
    expect(webDomain.routes[0]?.outlet).toBe("app")
    expect(webDomain.capabilities.nav).toMatchObject({
      label: "SQLite",
      path: BASE_PATH,
    })
  })
})
