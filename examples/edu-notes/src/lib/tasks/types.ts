/** 作业看板领域类型（无 UI 依赖）。列定义与流转谓词是唯一事实源。 */

export const TASK_COLUMNS = ["todo", "doing", "review", "done"] as const
export type TaskColumn = (typeof TASK_COLUMNS)[number]

export const TASK_COLUMN_LABELS: Readonly<Record<TaskColumn, string>> = {
  todo: "待做",
  doing: "进行中",
  review: "待检查",
  done: "已完成",
}

export type TaskPriority = "high" | "normal" | "low"

export const TASK_PRIORITY_LABELS: Readonly<Record<TaskPriority, string>> = {
  high: "高",
  normal: "中",
  low: "低",
}

export interface Task {
  readonly id: string
  readonly title: string
  readonly subject: string
  readonly column: TaskColumn
  readonly priority: TaskPriority
  /** 截止日（ISO 日期）。 */
  readonly due: string
}

/** 可否把任务移动到目标列：唯一谓词（done 只进不出，其余可自由移动）。 */
export function canMoveTo(from: TaskColumn, to: TaskColumn): boolean {
  return from === "done" ? false : from !== to
}
