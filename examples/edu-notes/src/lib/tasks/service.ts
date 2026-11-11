import { listTasks } from "./mock-data"
import { canMoveTo } from "./types"
import type { Task, TaskColumn } from "./types"

export function fetchTasks(): Promise<readonly Task[]> {
  return listTasks()
}

/** 移动任务：谓词不通过抛错（与 UI 共用 canMoveTo）。 */
export async function moveTask(
  id: string,
  to: TaskColumn,
  all: readonly Task[]
): Promise<void> {
  const task = all.find((t) => t.id === id)
  if (!task) throw new Error(`作业 ${id} 不存在`)
  if (!canMoveTo(task.column, to)) {
    throw new Error(`「已完成」的作业不能移回其他列`)
  }
  await new Promise((r) => setTimeout(r, 120))
}

export type { Task }
