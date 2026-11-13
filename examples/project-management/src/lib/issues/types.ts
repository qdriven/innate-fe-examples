/** Issue 领域类型（无 UI 依赖）。枚举与关系判定是唯一事实源，UI 与 service 共用。 */

export const ISSUE_STATUSES = ["todo", "in_progress", "done"] as const
export type IssueStatus = (typeof ISSUE_STATUSES)[number]

export const ISSUE_STATUS_LABELS: Readonly<Record<IssueStatus, string>> = {
  todo: "待办",
  in_progress: "进行中",
  done: "已完成",
}

/** issue → user 的三种关系角色。 */
export const ISSUE_ASSIGNMENT_ROLES = [
  "owner",
  "assignee",
  "assigner",
] as const
export type IssueAssignmentRole = (typeof ISSUE_ASSIGNMENT_ROLES)[number]

export const ISSUE_ASSIGNMENT_ROLE_LABELS: Readonly<
  Record<IssueAssignmentRole, string>
> = {
  owner: "负责人",
  assignee: "经办人",
  assigner: "指派人",
}

export const ISSUE_PRIORITIES = ["low", "medium", "high", "urgent"] as const
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number]

export const ISSUE_PRIORITY_LABELS: Readonly<Record<IssuePriority, string>> = {
  low: "低",
  medium: "中",
  high: "高",
  urgent: "紧急",
}

/** 标签是固定枚举（存储用，可多选）。 */
export const ISSUE_LABELS = [
  "bug",
  "feature",
  "improvement",
  "docs",
  "design",
  "question",
] as const
export type IssueLabel = (typeof ISSUE_LABELS)[number]

export const ISSUE_LABEL_LABELS: Readonly<Record<IssueLabel, string>> = {
  bug: "缺陷",
  feature: "新功能",
  improvement: "改进",
  docs: "文档",
  design: "设计",
  question: "疑问",
}

export interface Issue {
  readonly id: string
  /** 所属项目（issue → project 关系）。 */
  readonly projectId: string
  /** 展示编号：`<PROJECT_KEY>-<序号>`，如 PM-3。 */
  readonly displayId: string
  readonly title: string
  readonly description: string
  readonly status: IssueStatus
  readonly priority: IssuePriority
  readonly labels: readonly IssueLabel[]
  /** 三种人（issue → user 关系）：owner 负责人 / assignee 经办人 / assigner 指派人。 */
  readonly ownerId: string | null
  readonly assigneeId: string | null
  readonly assignerId: string | null
  readonly createdAt: string
  readonly updatedAt: string
}

/** issue 表单输入：id / displayId / 时间戳由 service 生成。 */
export type IssueInput = Pick<
  Issue,
  | "projectId"
  | "title"
  | "description"
  | "priority"
  | "labels"
  | "ownerId"
  | "assigneeId"
  | "assignerId"
>

/** issue 更新输入：全字段可选（undefined = 不改）。 */
export type IssuePatch = Partial<Omit<IssueInput, "projectId">> & {
  readonly status?: IssueStatus
}
