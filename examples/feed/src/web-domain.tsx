import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { FeedPage } from "./pages/feed/page"
import { FeedDetailPage } from "./pages/feed/[slug]/page"

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
      id: "_feed",
      component: DomainLayout,
    })

    const detail = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/$slug`,
      component: function FeedDetailRoute() {
        return <FeedDetailPage />
      },
    })

    return layout.addChildren([
      pageRoute(layout, BASE_PATH, FeedPage),
      detail,
    ] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "Feed",
    path: BASE_PATH,
    icon: "Newspaper",
    order: 31,
    group: "Misc",
  })
  .addCapability("homeTile", {
    title: "Feed",
    description: "统一内容流。",
    path: BASE_PATH,
  })
  .build()
