import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { CheatsheetsPage } from "./pages/cheatsheets/page"
import { CheatsheetDetailPage } from "./pages/cheatsheets/[slug]/page"

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
      id: "_cheatsheets",
      component: DomainLayout,
    })

    const detail = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/$slug`,
      component: function CheatsheetDetailRoute() {
        return <CheatsheetDetailPage />
      },
    })

    return layout.addChildren([
      pageRoute(layout, BASE_PATH, CheatsheetsPage),
      detail,
    ] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "Cheatsheets",
    path: BASE_PATH,
    icon: "FolderGit2",
    order: 34,
    group: "Misc",
  })
  .addCapability("homeTile", {
    title: "Cheatsheets",
    description: "开发速查表。",
    path: BASE_PATH,
  })
  .build()
