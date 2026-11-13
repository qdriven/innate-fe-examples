import { AppLink, useParams } from "../../../lib/routing"
import { getUser } from "../../../lib/users/service"
import { useAsync } from "../../../lib/use-async"
import { findAllIssues } from "../../../lib/issues/mock-data"
import { findAllProjects } from "../../../lib/projects/mock-data"
import {
  ISSUE_ASSIGNMENT_ROLE_LABELS,
  ISSUE_ASSIGNMENT_ROLES,
  ISSUE_STATUS_LABELS,
  type IssueAssignmentRole,
} from "../../../lib/issues/types"
import { PROJECT_PERMISSION_LABELS } from "../../../lib/projects/types"

/** 用户详情：基本信息 + 负责/参与的项目 + 经手的任务（三角色视角）。 */
export function UserDetailPage() {
  const { userId = "" } = useParams()
  const { data: user, loading, error } = useAsync(
    () => getUser(userId),
    [userId]
  )

  if (loading)
    return <p className="p-6 text-sm text-muted-foreground">加载中…</p>
  if (error)
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">{error.message}</p>
        <AppLink href="/users" className="mt-2 inline-block text-sm underline">
          ← 返回用户列表
        </AppLink>
      </div>
    )
  if (!user) return null

  const projects = findAllProjects()
  const ownedProjects = projects.filter((p) => p.defaultOwnerId === user.id)
  const memberships = projects.flatMap((project) => {
    const member = project.members.find((m) => m.userId === user.id)
    return member ? [{ project, permission: member.permission }] : []
  })
  const issues = findAllIssues()
  const issueRoles = issues.flatMap((issue) => {
    const roles = ISSUE_ASSIGNMENT_ROLES.filter(
      (role: IssueAssignmentRole) =>
        (role === "owner" && issue.ownerId === user.id) ||
        (role === "assignee" && issue.assigneeId === user.id) ||
        (role === "assigner" && issue.assignerId === user.id)
    )
    return roles.length > 0 ? [{ issue, roles }] : []
  })

  return (
    <div className="mx-auto max-w-2xl p-6">
      <AppLink
        href="/users"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回用户列表
      </AppLink>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="size-10 rounded-full"
            style={{ backgroundColor: user.color }}
          />
          <div>
            <h1 className="text-lg font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <AppLink
          href={`/users/${user.id}/edit`}
          className="shrink-0 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
        >
          编辑
        </AppLink>
      </div>

      {/* 项目关系 */}
      <section className="mt-8" aria-label="项目">
        <h2 className="text-sm font-semibold">项目</h2>
        {ownedProjects.length === 0 && memberships.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">未参与任何项目。</p>
        ) : (
          <ul className="mt-2 divide-y rounded-lg border">
            {ownedProjects.map((project) => (
              <li key={`own-${project.id}`} className="px-4 py-2.5 text-sm">
                <AppLink
                  href={`/projects/${project.id}`}
                  className="font-medium hover:underline"
                >
                  {project.name}
                </AppLink>
                <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                  默认负责人
                </span>
              </li>
            ))}
            {memberships
              .filter(
                ({ project }) =>
                  !ownedProjects.some((owned) => owned.id === project.id)
              )
              .map(({ project, permission }) => (
                <li key={`member-${project.id}`} className="px-4 py-2.5 text-sm">
                  <AppLink
                    href={`/projects/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.name}
                  </AppLink>
                  <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    {PROJECT_PERMISSION_LABELS[permission]}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </section>

      {/* 任务关系 */}
      <section className="mt-8" aria-label="任务">
        <h2 className="text-sm font-semibold">
          经手的任务（{issueRoles.length}）
        </h2>
        {issueRoles.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">还没有经手任务。</p>
        ) : (
          <ul className="mt-2 divide-y rounded-lg border">
            {issueRoles.map(({ issue, roles }) => (
              <li key={issue.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                  {issue.displayId}
                </span>
                <AppLink
                  href={`/issues/${issue.id}`}
                  className="min-w-0 flex-1 truncate text-sm hover:underline"
                >
                  {issue.title}
                </AppLink>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {roles
                    .map((role) => ISSUE_ASSIGNMENT_ROLE_LABELS[role])
                    .join(" / ")}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {ISSUE_STATUS_LABELS[issue.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
