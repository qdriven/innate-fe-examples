import { describe, expect, it } from "vitest"
import pluginManifestJson from "../../plugin.json"
import {
  groupNavItems,
  parsePluginManifest,
  resolveNavItems,
} from "@innate/plugin-protocol"
import { webDomain } from "../web-domain"

describe("admin-tanstack plugin.json（innate.plugin.v1）", () => {
  it("是合法的 domain 清单", () => {
    const manifest = parsePluginManifest(
      pluginManifestJson,
      "domains/admin-tanstack/plugin.json"
    )
    expect(manifest.kind).toBe("domain")
    expect(manifest.id).toBe("admin-tanstack")
  })

  it("壳侧栏只有一条入口，没有分组子菜单", () => {
    const manifest = parsePluginManifest(
      pluginManifestJson,
      "domains/admin-tanstack/plugin.json"
    )
    const items = resolveNavItems(manifest.ui)
    expect(items).toEqual([
      {
        label: "Admin",
        path: "/admin-tanstack",
        icon: "LayoutDashboard",
        order: 20,
      },
    ])
    expect(groupNavItems(items).map((g) => g.name)).toEqual(["default"])
  })
})

describe("admin-tanstack webDomain", () => {
  it("声明 id、app outlet 与从清单派生的 navItems / homeTile", () => {
    expect(webDomain.id).toBe("admin-tanstack")
    expect(webDomain.enabled).toBe(true)
    expect(webDomain.routes).toHaveLength(1)
    expect(webDomain.routes[0]?.outlet).toBe("app")

    const navItems = webDomain.capabilities.navItems as Array<{
      label: string
      path: string
      group?: string
    }>
    expect(navItems).toEqual([
      expect.objectContaining({
        label: "Admin",
        path: "/admin-tanstack",
      }),
    ])
    expect(navItems.some((item) => item.group)).toBe(false)

    expect(webDomain.capabilities.homeTile).toMatchObject({
      title: "Admin",
      path: "/admin-tanstack",
    })
  })
})
