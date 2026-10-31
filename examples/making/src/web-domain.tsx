import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import MakingPage from "./pages/making/page"
import MakingProjectsPage from "./pages/making/projects/page"
import MakingProjectDetailPage from "./pages/making/projects/[id]/page"
import MakingWeeklyPage from "./pages/making/weekly/page"
import MakingWeeklyDetailPage from "./pages/making/weekly/[id]/page"
import MakingInsightsPage from "./pages/making/insights/page"
import MakingInsightDetailPage from "./pages/making/insights/[id]/page"
import MakingIssuesPage from "./pages/making/issues/page"
import MakingIssueDetailPage from "./pages/making/issues/[project]/[number]/page"

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
      id: "_making",
      component: DomainLayout,
    })

    const makingProject = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/projects/$id`,
      component: function MakingProjectRoute() {
        return <MakingProjectDetailPage />
      },
    })

    const makingWeekly = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/weekly/$id`,
      component: function MakingWeeklyRoute() {
        return <MakingWeeklyDetailPage />
      },
    })

    const makingInsight = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/insights/$id`,
      component: function MakingInsightRoute() {
        return <MakingInsightDetailPage />
      },
    })

    const makingIssue = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/issues/$project/$number`,
      component: function MakingIssueRoute() {
        return <MakingIssueDetailPage />
      },
    })

    return layout.addChildren([
      pageRoute(layout, BASE_PATH, MakingPage),
      pageRoute(layout, `${BASE_PATH}/projects`, MakingProjectsPage),
      makingProject,
      pageRoute(layout, `${BASE_PATH}/weekly`, MakingWeeklyPage),
      makingWeekly,
      pageRoute(layout, `${BASE_PATH}/insights`, MakingInsightsPage),
      makingInsight,
      pageRoute(layout, `${BASE_PATH}/issues`, MakingIssuesPage),
      makingIssue,
    ] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "Making",
    path: BASE_PATH,
    icon: "Hammer",
    order: 33,
  })
  .addCapability("homeTile", {
    title: "Making",
    description: "项目、Issues 与周报。",
    path: BASE_PATH,
  })
  .build()
