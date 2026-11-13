import { useState } from "react"
import { cn } from "@innate/ui"
import { AppLink } from "../../lib/routing"
import {
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUS_LABELS,
  type IssueStatus,
} from "../../lib/issues/types"
import { listIssues } from "../../lib/issues/service"
import { useAsync } from "../../lib/use-async"
import { findProjectById } from "../../lib/projects/mock-data"
import { findUserById } from "../../lib/users/mock-data"

const STATUS_STYLES: Readonly<Record<IssueStatus, string>> = {
  todo: "bg-muted text-foreground",
  in_progress: "bg-primary/10 text-primary",
  done: "bg-emerald-500/10 text-emerald-600",
}

/** 任务列表：按项目筛选 + 状态徽标 + 三角色负责人摘要。 */
export function IssuesPage() {
  const { data, loading, error, reload } = useAsync(listIssues, [])
  const [projectFilter, setProjectFilter] = useState("")

  if (loading)
    return <p className="p-6 text-sm text-muted-foreground">加载中…</p>
  if (error)
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">{error.message}</p>
        <button type="button" onClick={reload} className="mt-2 text-sm underline">
          重试
        </button>
      </div>
    )

  const all = data ?? []
  const projects = new Map(
    all.map((issue) => [
      issue.projectId,
      findProjectById(issue.projectId)?.name ?? issue.projectId,
    ])
  )
  const issues = projectFilter
    ? all.filter((issue) => issue.projectId === projectFilter)
    : all

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">任务</h1>
          <p className="text-sm text-muted-foreground">
            共 {issues.length} 条
            {projectFilter
              ? `（项目：${projects.get(projectFilter) ?? projectFilter}）`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="按项目筛选"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            <option value="">全部项目</option>
            {[...projects.entries()].map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <AppLink
            href="/issues/new"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            新建任务
          </AppLink>
        </div>
      </div>

      {issues.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          没有符合条件的任务。
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {issues.map((issue) => {
            const assignee = findUserById(issue.assigneeId)
            const owner = findUserById(issue.ownerId)
            return (
              <li key={issue.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                  {issue.displayId}
                </span>
                <AppLink
                  href={`/issues/${issue.id}`}
                  className="min-w-0 flex-1 truncate text-sm hover:underline"
                >
                  {issue.title}
                </AppLink>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs",
                    STATUS_STYLES[issue.status]
                  )}
                >
                  {ISSUE_STATUS_LABELS[issue.status]}
                </span>
                <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">
                  {ISSUE_PRIORITY_LABELS[issue.priority]}
                </span>
                <span className="w-28 shrink-0 truncate text-right text-xs text-muted-foreground">
                  经办 {assignee ? assignee.name : "—"} · 负责{" "}
                  {owner ? owner.name : "—"}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
