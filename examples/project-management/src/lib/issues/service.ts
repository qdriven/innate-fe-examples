import { findProjectById } from "../projects/mock-data"
import { ProjectNotFoundError } from "../projects/service"
import {
  deleteIssue,
  findAllIssues,
  findIssueById,
  insertIssue,
  updateIssue,
} from "./mock-data"
import {
  ISSUE_STATUS_LABELS,
  type Issue,
  type IssueInput,
  type IssuePatch,
  type IssueStatus,
} from "./types"

/**
 * typed service：issue 页面唯一的数据入口（mock-first，与真实后端同签名）。
 * 切真实后端时把实现换成 fetch，页面零改动。
 */

const LATENCY_MS = 80

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, LATENCY_MS)
  })
}

export class IssueNotFoundError extends Error {
  constructor(id: string) {
    super(`Issue ${id} 不存在`)
    this.name = "IssueNotFoundError"
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(id: string, from: IssueStatus, to: IssueStatus) {
    super(
      `Issue ${id} 不能从「${ISSUE_STATUS_LABELS[from]}」流转到「${ISSUE_STATUS_LABELS[to]}」`
    )
    this.name = "InvalidStatusTransitionError"
  }
}

/** 看板式状态机：todo ⇄ in_progress → done；done 只能回 in_progress 重开。 */
export const ISSUE_TRANSITIONS: Readonly<
  Record<IssueStatus, readonly IssueStatus[]>
> =
  {
    todo: ["in_progress"],
    in_progress: ["todo", "done"],
    done: ["in_progress"],
  }

export function canTransitionStatus(
  from: IssueStatus,
  to: IssueStatus,
): boolean {
  return ISSUE_TRANSITIONS[from].includes(to)
}

export async function listIssues(projectId?: string): Promise<Issue[]> {
  await delay()
  const all = [...findAllIssues()]
  return projectId ? all.filter((i) => i.projectId === projectId) : all
}

export async function getIssue(id: string): Promise<Issue> {
  await delay()
  const issue = findIssueById(id)
  if (!issue) throw new IssueNotFoundError(id)
  return issue
}

export async function createIssue(
  input: IssueInput & { status: IssueStatus },
): Promise<Issue> {
  await delay()
  if (!findProjectById(input.projectId)) {
    throw new ProjectNotFoundError(input.projectId)
  }
  return insertIssue(input)
}

/** 全字段更新（编辑表单）：项目归属创建后不可改。 */
export async function replaceIssue(
  id: string,
  input: Omit<IssueInput, "projectId">,
): Promise<Issue> {
  await delay()
  const issue = findIssueById(id)
  if (!issue) throw new IssueNotFoundError(id)
  return updateIssue(id, input)
}

/** 部分更新（看板拖拽 / 状态按钮）：校验状态机。 */
export async function patchIssue(id: string, patch: IssuePatch): Promise<Issue> {
  await delay()
  const issue = findIssueById(id)
  if (!issue) throw new IssueNotFoundError(id)
  if (patch.status && patch.status !== issue.status) {
    if (!canTransitionStatus(issue.status, patch.status)) {
      throw new InvalidStatusTransitionError(id, issue.status, patch.status)
    }
  }
  return updateIssue(id, patch)
}

export async function removeIssue(id: string): Promise<void> {
  await delay()
  if (!findIssueById(id)) throw new IssueNotFoundError(id)
  deleteIssue(id)
}
