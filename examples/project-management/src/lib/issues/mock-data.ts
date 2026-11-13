import type { Issue, IssueInput, IssueStatus } from "./types"
import { findProjectById } from "../projects/mock-data"

/**
 * mock-first 的内存 issue 仓：service 是唯一入口，页面不直接读这里。
 * displayId = `<PROJECT_KEY>-<项目内自增序号>`（如 PM-3）。
 * 切真实后端时删除本文件，service 改为 fetch。
 */

interface SeedIssue
  extends Omit<Issue, "id" | "displayId" | "createdAt" | "updatedAt"> {
  readonly seq: number
}

const SEED_ISSUES: readonly SeedIssue[] = [
  {
    seq: 1,
    projectId: "p-1",
    title: "导航栏在窄屏下换行错乱",
    description: "视口 < 768px 时顶部导航折行，菜单项互相重叠。",
    status: "todo",
    priority: "high",
    labels: ["bug"],
    ownerId: "u-1",
    assigneeId: "u-3",
    assignerId: "u-1",
  },
  {
    seq: 2,
    projectId: "p-1",
    title: "导出报表支持 CSV 格式",
    description: "当前只能导出 Excel，客户希望有轻量的 CSV 选项。",
    status: "in_progress",
    priority: "medium",
    labels: ["feature"],
    ownerId: "u-1",
    assigneeId: "u-2",
    assignerId: "u-1",
  },
  {
    seq: 3,
    projectId: "p-1",
    title: "快捷键帮助浮层文案核对",
    description: "浮层里的快捷键与实际实现不一致，需要逐一核对。",
    status: "done",
    priority: "low",
    labels: ["docs"],
    ownerId: "u-4",
    assigneeId: "u-4",
    assignerId: "u-1",
  },
  {
    seq: 1,
    projectId: "p-2",
    title: "调研本地优先（local-first）同步方案",
    description: "对比 CRDT 与 OT 在协同编辑场景的落地成本。",
    status: "in_progress",
    priority: "urgent",
    labels: ["question", "improvement"],
    ownerId: "u-2",
    assigneeId: "u-2",
    assignerId: "u-2",
  },
  {
    seq: 2,
    projectId: "p-2",
    title: "原型演示页视觉打磨",
    description: "按新的纸感主题过一遍原型页，替换占位插画。",
    status: "todo",
    priority: "medium",
    labels: ["design"],
    ownerId: "u-2",
    assigneeId: "u-4",
    assignerId: "u-2",
  },
]

let issues: Issue[] = SEED_ISSUES.map((s) => {
  const { seq, ...rest } = s
  return {
    id: `i-${s.projectId}-${seq}`,
    displayId: `${findProjectById(s.projectId)?.key ?? "???"}-${seq}`,
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-11-01T15:30:00.000Z",
    ...rest,
  }
})

/** 项目内自增序号：插入时按现有 displayId 最大序号 + 1。 */
function nextSeq(projectId: string): number {
  const prefix = `${findProjectById(projectId)?.key ?? "???"}-`
  let max = 0
  for (const issue of issues) {
    if (issue.projectId !== projectId) continue
    const seq = Number(issue.displayId.slice(prefix.length))
    if (Number.isFinite(seq)) max = Math.max(max, seq)
  }
  return max + 1
}

export function findAllIssues(): readonly Issue[] {
  return issues
}

export function findIssueById(id: string): Issue | undefined {
  return issues.find((i) => i.id === id)
}

export function insertIssue(input: IssueInput & { status: IssueStatus }): Issue {
  const seq = nextSeq(input.projectId)
  const project = findProjectById(input.projectId)
  const now = new Date().toISOString()
  const issue: Issue = {
    id: `i-${input.projectId}-${seq}`,
    displayId: `${project?.key ?? "???"}-${seq}`,
    createdAt: now,
    updatedAt: now,
    ...input,
  }
  issues = [issue, ...issues]
  return issue
}

export function updateIssue(
  id: string,
  patch: Partial<Omit<IssueInput, "projectId">> & { status?: Issue["status"] },
): Issue {
  const current = findIssueById(id)
  if (!current) throw new Error(`Issue ${id} 不存在`)
  const next: Issue = { ...current, ...patch, updatedAt: new Date().toISOString() }
  issues = issues.map((i) => (i.id === id ? next : i))
  return next
}

export function deleteIssue(id: string): void {
  issues = issues.filter((i) => i.id !== id)
}
