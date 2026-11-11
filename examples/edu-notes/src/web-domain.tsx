import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { SchedulePage } from "./pages/schedule/page"
import { NotesPage } from "./pages/notes/page"
import { TasksPage } from "./pages/tasks/page"

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
      id: "_edu-notes",
      component: DomainLayout,
    })

    return layout.addChildren([
      pageRoute(layout, `${BASE_PATH}/schedule`, SchedulePage),
      pageRoute(layout, `${BASE_PATH}/notes`, NotesPage),
      pageRoute(layout, `${BASE_PATH}/tasks`, TasksPage),
    ] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "学习手账",
    path: `${BASE_PATH}/schedule`,
    icon: "LayoutDashboard",
    order: 40,
  })
  .addCapability("homeTile", {
    title: "学习手账",
    description:
      "教育场景模板：便利贴课程表、手账笔记本、作业看板（edu 主题 + ink 装饰层）。",
    path: `${BASE_PATH}/schedule`,
  })
  .build()
