import type { Task } from "./types"

const TASKS: readonly Task[] = [
  { id: "t-01", title: "数学练习 p.42 习题 1-8", subject: "数学", column: "todo", priority: "high", due: "2026-11-13" },
  { id: "t-02", title: "英语 unit 6 词表默写", subject: "英语", column: "todo", priority: "normal", due: "2026-11-14" },
  { id: "t-03", title: "物理实验报告：牛顿第三定律", subject: "物理", column: "doing", priority: "high", due: "2026-11-12" },
  { id: "t-04", title: "语文文言文背诵《岳阳楼记》", subject: "语文", column: "doing", priority: "normal", due: "2026-11-15" },
  { id: "t-05", title: "化学方程式配平练习", subject: "化学", column: "review", priority: "low", due: "2026-11-11" },
  { id: "t-06", title: "地理默写：中国省份简称", subject: "地理", column: "review", priority: "normal", due: "2026-11-11" },
  { id: "t-07", title: "历史单元测验订正", subject: "历史", column: "done", priority: "normal", due: "2026-11-08" },
  { id: "t-08", title: "数学错题本整理（函数章）", subject: "数学", column: "done", priority: "low", due: "2026-11-07" },
]

function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function listTasks(): Promise<readonly Task[]> {
  return delay(TASKS)
}
