import { describe, expect, it } from "vitest"
import { createRootRoute } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import { createStandaloneWebDomainRouter } from "@innate/web-domain"
import { BASE_PATH, DOMAIN_ID } from "../lib/base-path"
import { webDomain } from "../web-domain"
import { canTransitionStatus, ISSUE_TRANSITIONS } from "../lib/issues/service"
import {
  ISSUE_ASSIGNMENT_ROLES,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
} from "../lib/issues/types"
import { PROJECT_PERMISSIONS } from "../lib/projects/types"
import { findAllIssues } from "../lib/issues/mock-data"
import { findAllProjects } from "../lib/projects/mock-data"
import { findAllUsers } from "../lib/users/mock-data"

describe("project-management webDomain", () => {
  it("declares id, app outlet, nav and homeTile", () => {
    expect(webDomain.id).toBe(DOMAIN_ID)
    expect(DOMAIN_ID).toBe("project-management")
    expect(webDomain.enabled).toBe(true)
    expect(webDomain.routes).toHaveLength(1)
    expect(webDomain.routes[0]?.outlet).toBe("app")
    expect(webDomain.capabilities.nav).toMatchObject({
      label: "项目管理",
      path: `${BASE_PATH}/projects`,
    })
    expect(webDomain.capabilities.homeTile).toMatchObject({
      title: "项目管理",
      path: `${BASE_PATH}/projects`,
    })
  })

  it("declares page paths for projects, issues and users", () => {
    // routes 只记录 outlet 挂载点，页面路径在工厂产出的布局子树里
    const layout = webDomain.routes[0]!.factory(
      createRootRoute() as unknown as AnyRoute
    )
    const children = (layout.children ?? []) as {
      options: { path?: string }
    }[]
    const paths = children.map((child) => child.options.path)
    expect(paths).toEqual(
      expect.arrayContaining([
        `${BASE_PATH}/projects`,
        `${BASE_PATH}/projects/new`,
        `${BASE_PATH}/projects/$projectId`,
        `${BASE_PATH}/projects/$projectId/edit`,
        `${BASE_PATH}/issues`,
        `${BASE_PATH}/issues/new`,
        `${BASE_PATH}/issues/$issueId`,
        `${BASE_PATH}/users`,
        `${BASE_PATH}/users/new`,
        `${BASE_PATH}/users/$userId`,
        `${BASE_PATH}/users/$userId/edit`,
      ])
    )
  })

  it("standalone router matches the projects list", async () => {
    const router = createStandaloneWebDomainRouter(webDomain, {
      initialEntries: [`${BASE_PATH}/projects`],
    })
    await router.load()
    expect(router.state.location.pathname).toBe(`${BASE_PATH}/projects`)
    expect(router.state.matches.map((match) => match.routeId)).not.toEqual([])
  })
})

describe("issue 状态机", () => {
  it("TRANSITIONS 覆盖全部状态且合法", () => {
    for (const status of ISSUE_STATUSES) {
      expect(ISSUE_TRANSITIONS[status]).toBeDefined()
    }
  })

  it("todo → in_progress → done 主链路可走通", () => {
    expect(canTransitionStatus("todo", "in_progress")).toBe(true)
    expect(canTransitionStatus("in_progress", "done")).toBe(true)
  })

  it("非法流转被拒绝", () => {
    expect(canTransitionStatus("todo", "done")).toBe(false)
    expect(canTransitionStatus("done", "todo")).toBe(false)
  })

  it("done 只能重开回 in_progress", () => {
    expect(ISSUE_TRANSITIONS.done).toEqual(["in_progress"])
  })
})

describe("种子数据关系一致性", () => {
  it("每个 issue 的 projectId / 三角色都指向存在的实体", () => {
    const userIds = new Set(findAllUsers().map((user) => user.id))
    const projectIds = new Set(findAllProjects().map((project) => project.id))
    for (const issue of findAllIssues()) {
      expect(projectIds.has(issue.projectId)).toBe(true)
      if (issue.ownerId !== null) expect(userIds.has(issue.ownerId)).toBe(true)
      if (issue.assigneeId !== null)
        expect(userIds.has(issue.assigneeId)).toBe(true)
      if (issue.assignerId !== null)
        expect(userIds.has(issue.assignerId)).toBe(true)
    }
  })

  it("默认负责人都是项目成员且权限为 admin", () => {
    const userIds = new Set(findAllUsers().map((user) => user.id))
    for (const project of findAllProjects()) {
      const defaultOwnerId = project.defaultOwnerId
      expect(defaultOwnerId).not.toBeNull()
      if (defaultOwnerId === null) continue
      expect(userIds.has(defaultOwnerId)).toBe(true)
      const owner = project.members.find(
        (member) => member.userId === defaultOwnerId
      )
      expect(owner?.permission).toBe("admin")
    }
  })

  it("displayId 遵循 {project.key}-{seq} 格式", () => {
    for (const issue of findAllIssues()) {
      expect(issue.displayId).toMatch(/^[A-Z]+-\d+$/)
    }
  })
})

describe("枚举契约", () => {
  it("状态 / 优先级 / 角色 / 权限值齐全", () => {
    expect(ISSUE_STATUSES).toEqual(["todo", "in_progress", "done"])
    expect(ISSUE_PRIORITIES).toEqual(["low", "medium", "high", "urgent"])
    expect(ISSUE_ASSIGNMENT_ROLES).toEqual(["owner", "assignee", "assigner"])
    expect(PROJECT_PERMISSIONS).toEqual(["read", "write", "admin"])
  })
})
