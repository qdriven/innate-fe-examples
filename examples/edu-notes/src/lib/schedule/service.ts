import { listLessons } from "./mock-data"
import type { Lesson, Weekday } from "./types"

/** 按 星期 x 节次 取课（找不到 = 空档）。 */
export function lessonAt(
  lessons: readonly Lesson[],
  weekday: Weekday,
  periodIndex: number
): Lesson | undefined {
  return lessons.find(
    (l) => l.weekday === weekday && l.period === `第${periodIndex + 1}节`
  )
}

/** 数据入口：mock-first，换 api-first 时只改本文件。 */
export function fetchLessons(): Promise<readonly Lesson[]> {
  return listLessons()
}
