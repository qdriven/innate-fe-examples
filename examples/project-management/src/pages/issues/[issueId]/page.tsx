import { toast } from "sonner"
import { cn } from "@innate/ui"
import { AppLink, useParams } from "../../../lib/routing"
import {
  ISSUE_LABEL_LABELS,
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUS_LABELS,
  ISSUE_ASSIGNMENT_ROLE_LABELS,
  ISSUE_ASSIGNMENT_ROLES,
  type IssueAssignmentRole,
  type IssueStatus,
} from "../../../lib/issues/types"
import {
  canTransitionStatus,
  getIssue,
  patchIssue,
  removeIssue,
} from "../../../lib/issues/service"
import { useAsync } from "../../../lib/use-async"
import { findProjectById } from "../../../lib/projects/mock-data"
import { findUserById } from "../../../lib/users/mock-data"

const NEXT_ACTIONS: Readonly<
  Record<IssueStatus, ReadonlyArray<{ to: IssueStatus; label: string }>>
> = {
  todo: [{ to: "in_progress", label: "开始" }],
  in_progress: [
    { to: "done", label: "完成" },
    { to: "todo", label: "退回待办" },
  ],
  done: [{ to: "in_progress", label: "重新打开" }],
}

/** 任务详情：三角色人员卡 + 标签 + 状态机流转 + 删除。 */
export function IssueDetailPage() {
  const { issueId = "" } = useParams()
  const { data: issue, loading, error, reload } = useAsync(
    () => getIssue(issueId),
    [issueId]
  )

  if (loading)
    return <p className="p-6 text-sm text-muted-foreground">加载中…</p>
  if (error)
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">{error.message}</p>
        <AppLink href="/issues" className="mt-2 inline-block text-sm underline">
          ← 返回任务列表
        </AppLink>
      </div>
    )
  if (!issue) return null

  const project = findProjectById(issue.projectId)
  const roleUsers = new Map(
    ISSUE_ASSIGNMENT_ROLES.map((role) => {
      const id =
        role === "owner"
          ? issue.ownerId
          : role === "assignee"
            ? issue.assigneeId
            : issue.assignerId
      const user = findUserById(id)
      return [role, user]
    })
  )

  async function handleStatus(to: IssueStatus) {
    try {
      await patchIssue(issue!.id, { status: to })
      toast.success(`状态已更新为「${ISSUE_STATUS_LABELS[to]}」`)
      reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "流转失败")
    }
  }

  async function handleDelete() {
    if (!window.confirm(`确定删除任务 ${issue!.displayId}？`)) return
    try {
      await removeIssue(issue!.id)
      toast.success("任务已删除")
      window.location.hash = ""
      window.history.back()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败")
    }
  }

  const statusBadge: Record<IssueStatus, string> = {
    todo: "bg-muted text-foreground",
    in_progress: "bg-primary/10 text-primary",
    done: "bg-success/10 text-success",
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <AppLink
        href="/issues"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回任务列表
      </AppLink>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {issue.displayId}
            </span>
            {project ? (
              <AppLink
                href={`/projects/${project.id}`}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                {project.name}
              </AppLink>
            ) : null}
          </div>
          <h1 className="mt-1 truncate text-lg font-semibold">{issue.title}</h1>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs",
            statusBadge[issue.status]
          )}
        >
          {ISSUE_STATUS_LABELS[issue.status]}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
        {issue.description || "（无描述）"}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">优先级</dt>
          <dd className="font-medium">{ISSUE_PRIORITY_LABELS[issue.priority]}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">标签</dt>
          <dd className="flex flex-wrap gap-1">
            {issue.labels.length === 0 ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              issue.labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {ISSUE_LABEL_LABELS[label]}
                </span>
              ))
            )}
          </dd>
        </div>
      </dl>

      {/* 三角色 */}
      <section className="mt-6" aria-label="三角色">
        <h2 className="text-sm font-semibold">人员</h2>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {ISSUE_ASSIGNMENT_ROLES.map((role: IssueAssignmentRole) => {
            const user = roleUsers.get(role)
            return (
              <div key={role} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">
                  {ISSUE_ASSIGNMENT_ROLE_LABELS[role]}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {user ? (
                    <AppLink
                      href={`/users/${user.id}`}
                      className="hover:underline"
                    >
                      {user.name}
                    </AppLink>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 状态流转 */}
      <section className="mt-6" aria-label="状态流转">
        <h2 className="text-sm font-semibold">状态流转</h2>
        <div className="mt-2 flex gap-2">
          {NEXT_ACTIONS[issue.status]
            .filter((action) => canTransitionStatus(issue.status, action.to))
            .map((action) => (
              <button
                key={action.to}
                type="button"
                onClick={() => handleStatus(action.to)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
              >
                {action.label}
              </button>
            ))}
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto rounded-md border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
          >
            删除
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          状态机：待办 → 进行中 → 已完成；已完成可重新打开。
        </p>
      </section>
    </div>
  )
}
