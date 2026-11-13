import { createRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import { createWebDomain } from "@innate/web-domain"
import { DomainLayout } from "./components/domain-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { ProjectsPage } from "./pages/projects/page"
import { ProjectCreatePage } from "./pages/projects/new/page"
import { ProjectDetailPage } from "./pages/projects/[projectId]/page"
import { ProjectEditPage } from "./pages/projects/[projectId]/edit/page"
import { IssuesPage } from "./pages/issues/page"
import { IssueCreatePage } from "./pages/issues/new/page"
import { IssueDetailPage } from "./pages/issues/[issueId]/page"
import { UsersPage } from "./pages/users/page"
import { UserCreatePage } from "./pages/users/new/page"
import { UserDetailPage } from "./pages/users/[userId]/page"
import { UserEditPage } from "./pages/users/[userId]/edit/page"

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
      id: "_project-management",
      component: DomainLayout,
    })

    const projectDetail = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/projects/$projectId`,
      component: ProjectDetailPage,
    })

    const projectEdit = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/projects/$projectId/edit`,
      component: ProjectEditPage,
    })

    const issueDetail = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/issues/$issueId`,
      component: IssueDetailPage,
    })

    const userDetail = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/users/$userId`,
      component: UserDetailPage,
    })

    const userEdit = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/users/$userId/edit`,
      component: UserEditPage,
    })

    return layout.addChildren([
      pageRoute(layout, `${BASE_PATH}/projects`, ProjectsPage),
      pageRoute(layout, `${BASE_PATH}/projects/new`, ProjectCreatePage),
      projectDetail,
      projectEdit,
      pageRoute(layout, `${BASE_PATH}/issues`, IssuesPage),
      pageRoute(layout, `${BASE_PATH}/issues/new`, IssueCreatePage),
      issueDetail,
      pageRoute(layout, `${BASE_PATH}/users`, UsersPage),
      pageRoute(layout, `${BASE_PATH}/users/new`, UserCreatePage),
      userDetail,
      userEdit,
    ] as never) as unknown as AnyRoute
  })
  .addCapability("nav", {
    label: "项目管理",
    path: `${BASE_PATH}/projects`,
    icon: "KanbanSquare",
    order: 38,
  })
  .addCapability("homeTile", {
    title: "项目管理",
    description:
      "项目 / 任务 / 用户三实体 CRUD 与关系管理：成员权限、三角色指派、状态流转。",
    path: `${BASE_PATH}/projects`,
  })
  .build()
