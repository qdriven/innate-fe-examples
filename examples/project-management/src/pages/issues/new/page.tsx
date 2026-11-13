import { useState } from "react"
import { toast } from "sonner"
import { AppLink, useRouter } from "../../../lib/routing"
import {
  ISSUE_LABELS,
  ISSUE_LABEL_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_ASSIGNMENT_ROLE_LABELS,
  type IssueLabel,
  type IssuePriority,
  type IssueAssignmentRole,
} from "../../../lib/issues/types"
import { createIssue } from "../../../lib/issues/service"
import { listProjects } from "../../../lib/projects/service"
import { listUsers } from "../../../lib/users/service"
import { useAsync } from "../../../lib/use-async"

type Draft = {
  projectId: string
  title: string
  description: string
  priority: IssuePriority
  labels: IssueLabel[]
  ownerId: string
  assigneeId: string
  assignerId: string
}

const EMPTY: Draft = {
  projectId: "",
  title: "",
  description: "",
  priority: "medium",
  labels: [],
  ownerId: "",
  assigneeId: "",
  assignerId: "",
}

/**
 * 新建任务：项目归属 + 三角色（负责人/经办人/指派人）选人。
 * 支持从项目详情跳转时带 ?projectId= 预选。
 */
export function IssueCreatePage() {
  const { push } = useRouter()
  const { data: projects } = useAsync(listProjects, [])
  const { data: users } = useAsync(listUsers, [])
  const [draft, setDraft] = useState<Draft>(() => ({
    ...EMPTY,
    projectId: new URLSearchParams(window.location.search).get("projectId") ?? "",
  }))
  const [submitting, setSubmitting] = useState(false)

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function toggleLabel(label: IssueLabel) {
    setDraft((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }))
  }

  const roleFields: Array<{
    key: "ownerId" | "assigneeId" | "assignerId"
    role: IssueAssignmentRole
  }> = [
    { key: "ownerId", role: "owner" },
    { key: "assigneeId", role: "assignee" },
    { key: "assignerId", role: "assigner" },
  ]

  const canSubmit =
    draft.projectId !== "" &&
    draft.title.trim() !== "" &&
    draft.ownerId !== "" &&
    draft.assigneeId !== "" &&
    draft.assignerId !== ""

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      const issue = await createIssue({
        projectId: draft.projectId,
        title: draft.title.trim(),
        description: draft.description.trim(),
        status: "todo",
        priority: draft.priority,
        labels: draft.labels,
        ownerId: draft.ownerId,
        assigneeId: draft.assigneeId,
        assignerId: draft.assignerId,
      })
      toast.success(`任务 ${issue.displayId} 已创建`)
      push(`/issues/${issue.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建失败")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <AppLink
        href="/issues"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回任务列表
      </AppLink>
      <h1 className="mt-3 text-lg font-semibold">新建任务</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="issue-project" className="text-sm font-medium">
            所属项目
          </label>
          <select
            id="issue-project"
            value={draft.projectId}
            onChange={(e) => set("projectId", e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">选择项目…</option>
            {(projects ?? []).map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="issue-title" className="text-sm font-medium">
            标题
          </label>
          <input
            id="issue-title"
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="一句话描述这个任务"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="issue-description" className="text-sm font-medium">
            描述
          </label>
          <textarea
            id="issue-description"
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="issue-priority" className="text-sm font-medium">
              优先级
            </label>
            <select
              id="issue-priority"
              value={draft.priority}
              onChange={(e) => set("priority", e.target.value as IssuePriority)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {ISSUE_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {ISSUE_PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-sm font-medium">标签</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {ISSUE_LABELS.map((label) => {
                const active = draft.labels.includes(label)
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleLabel(label)}
                    className={
                      active
                        ? "rounded-full bg-primary px-2.5 py-0.5 text-xs text-primary-foreground"
                        : "rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent"
                    }
                  >
                    {ISSUE_LABEL_LABELS[label]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">三角色指派</legend>
          <div className="mt-1 grid grid-cols-3 gap-3">
            {roleFields.map(({ key, role }) => (
              <div key={key}>
                <label
                  htmlFor={`issue-${key}`}
                  className="text-xs text-muted-foreground"
                >
                  {ISSUE_ASSIGNMENT_ROLE_LABELS[role]}
                </label>
                <select
                  id={`issue-${key}`}
                  value={draft[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
                >
                  <option value="">选择…</option>
                  {(users ?? []).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "创建中…" : "创建"}
          </button>
          <AppLink
            href="/issues"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            取消
          </AppLink>
        </div>
      </form>
    </div>
  )
}
