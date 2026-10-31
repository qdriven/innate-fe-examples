import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { AwesomePage } from "./pages/awesome/page"
import { AwesomeCategoryPage } from "./pages/awesome/[category]/page"

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
      id: "_awesome",
      component: DomainLayout,
    })

    const category = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/$category`,
      component: function AwesomeCategoryRoute() {
        return <AwesomeCategoryPage />
      },
    })

    return layout.addChildren([
      pageRoute(layout, BASE_PATH, AwesomePage),
      category,
    ] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "Awesome",
    path: BASE_PATH,
    icon: "Tag",
    order: 35,
    group: "Misc",
  })
  .addCapability("homeTile", {
    title: "Awesome",
    description: "精选工具与资源。",
    path: BASE_PATH,
  })
  .build()
