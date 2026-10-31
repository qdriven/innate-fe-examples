import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { SqliteAdminPage } from "./pages/admin/page"

export const webDomain = createWebDomain(DOMAIN_ID)
  .addRoute("app", (parent: AnyRoute) => {
    const layout = createRoute({
      getParentRoute: () => parent,
      id: "_sqlite-admin",
      component: DomainLayout,
    })
    const page = createRoute({
      getParentRoute: () => layout,
      path: BASE_PATH,
      component: SqliteAdminPage,
    })
    return layout.addChildren([page] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "SQLite",
    path: BASE_PATH,
    icon: "Database",
    order: 37,
    group: "Misc",
  })
  .addCapability("homeTile", {
    title: "SQLite Admin",
    description: "只读浏览指定的 SQLite 文件。",
    path: BASE_PATH,
  })
  .build()
