import { useState } from "react"
import { toast } from "sonner"
import { AppLink, useParams, useRouter } from "../../../lib/routing"
import { ISSUE_PRIORITY_LABELS } from "../../../lib/issues/types"
import { listIssues as listAllIssues } from "../../../lib/issues/service"
import { removeMember, setMemberPermission } from "../../../lib/projects/service"
import { removeProject } from "../../../lib/projects/service"
import { PROJECT_PERMISSION_LABELS, PROJECT_PERMISSIONS, type ProjectPermission } from "../../../lib/projects/types"
import { findProjectById } from "../../../lib/projects/mock-data"
import { findUserById } from "../../../lib/users/mock-data"
import { listUsers } from "../../../lib/users/service"
import { useAsync } from "../../../lib/use-async"

/** 项目详情：基本信息 + 成员权限管理（关系面）+ 项目任务列表。 */
export function ProjectDetailPage() {
  const { projectId = "" } = useParams()
  const { push } = useRouter()
  const { data: issues } = useAsync(() => listAllIssues(projectId), [projectId])
  const { data: users, reload: reloadUsers } = useAsync(listUsers, [])
  // 成员变更直接改内存 store；用 version 手动触发重渲染。
  const [version, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)

  const project = findProjectById(projectId)

  if (!project) {
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">项目不存在或已被删除。</p>
        <AppLink href="/projects" className="mt-2 inline-block text-sm underline">
          ← 返回项目列表
        </AppLink>
      </div>
    )
  }

  const owner = findUserById(project.defaultOwnerId)
  const projectIssues = (issues ?? []).filter((i) => i.projectId === project.id)
  const candidates = (users ?? []).filter(
    (user) => !project.members.some((m) => m.userId === user.id)
  )

  async function handlePermission(userId: string, permission: string) {
    try {
      await setMemberPermission(projectId, {
        userId,
        permission: permission as ProjectPermission,
      })
      toast.success("权限已更新")
      bump()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新失败")
    }
  }

  async function handleRemoveMember(userId: string) {
    try {
      await removeMember(projectId, userId)
      toast.success("成员已移除")
      reloadUsers()
      bump()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "移除失败")
    }
  }

  async function handleAddMember(userId: string) {
    if (!userId) return
    await handlePermission(userId, "read")
  }

  async function handleDeleteProject() {
    if (!window.confirm(`确定删除项目「${project?.name}」？任务将一并删除。`))
      return
    try {
      await removeProject(project?.id ?? "")
      toast.success("项目已删除")
      push("/projects")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败")
    }
  }

  return (
    <div className="p-6" data-version={version}>
      <AppLink
        href="/projects"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回项目列表
      </AppLink>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              {project.key}
            </span>
            <h1 className="text-lg font-semibold">{project.name}</h1>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {project.description || "（无描述）"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            默认负责人：
            <span className="font-medium text-foreground">
              {owner ? owner.name : "（已删除）"}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <AppLink
            href={`/projects/${project.id}/edit`}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
          >
            编辑
          </AppLink>
          <button
            type="button"
            onClick={handleDeleteProject}
            className="rounded-md border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
          >
            删除
          </button>
        </div>
      </div>

      {/* 成员权限管理 */}
      <section className="mt-8" aria-label="成员权限">
        <h2 className="text-sm font-semibold">成员与权限</h2>
        <table className="mt-2 w-full max-w-2xl text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="py-2">成员</th>
              <th className="py-2">权限</th>
              <th className="w-24 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {project.members.map((member) => {
              const user = findUserById(member.userId)
              const isOwner = member.userId === project.defaultOwnerId
              return (
                <tr key={member.userId} className="border-b last:border-0">
                  <td className="py-2">
                    {user ? (
                      <AppLink
                        href={`/users/${user.id}`}
                        className="hover:underline"
                      >
                        {user.name}
                      </AppLink>
                    ) : (
                      "（已删除用户）"
                    )}
                    {isOwner ? (
                      <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                        默认负责人
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2">
                    <select
                      aria-label={`${user?.name ?? member.userId} 的权限`}
                      value={member.permission}
                      onChange={(e) =>
                        handlePermission(member.userId, e.target.value)
                      }
                      className="rounded-md border bg-background px-2 py-1 text-xs"
                    >
                      {PROJECT_PERMISSIONS.map((p) => (
                        <option key={p} value={p}>
                          {PROJECT_PERMISSION_LABELS[p]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2">
                    <button
                      type="button"
                      disabled={isOwner}
                      onClick={() => handleRemoveMember(member.userId)}
                      className="text-xs text-destructive underline disabled:opacity-40 disabled:no-underline"
                      title={
                        isOwner ? "默认负责人不可移除，请先更换负责人" : undefined
                      }
                    >
                      移除
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {candidates.length > 0 ? (
          <label className="mt-3 flex items-center gap-2 text-sm">
            添加成员：
            <select
              aria-label="添加成员"
              defaultValue=""
              onChange={(e) => {
                void handleAddMember(e.target.value)
                e.target.value = ""
              }}
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              <option value="">选择用户…</option>
              {candidates.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">
              （默认授予只读权限）
            </span>
          </label>
        ) : null}
      </section>

      {/* 项目任务 */}
      <section className="mt-8" aria-label="项目任务">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            任务（{projectIssues.length}）
          </h2>
          <AppLink
            href={`/issues/new?projectId=${project.id}`}
            className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
          >
            新建任务
          </AppLink>
        </div>
        {projectIssues.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">还没有任务。</p>
        ) : (
          <ul className="mt-2 max-w-2xl divide-y">
            {projectIssues.map((issue) => (
              <li key={issue.id} className="flex items-center gap-2 py-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground">
                  {issue.displayId}
                </span>
                <AppLink href={`/issues/${issue.id}`} className="hover:underline">
                  {issue.title}
                </AppLink>
                <span className="ml-auto text-xs text-muted-foreground">
                  {ISSUE_PRIORITY_LABELS[issue.priority]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
