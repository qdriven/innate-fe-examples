import type { Lesson } from "./types"

/** 一周的固定课表（mock-first：组件不直接 import，经 service 取）。 */
const LESSONS: readonly Lesson[] = [
  { weekday: "周一", period: "第1节", subject: "语文", teacher: "王老师", room: "A301" },
  { weekday: "周一", period: "第2节", subject: "数学", teacher: "李老师", room: "A301" },
  { weekday: "周一", period: "第3节", subject: "英语", teacher: "Chen", room: "A301" },
  { weekday: "周一", period: "第4节", subject: "物理", teacher: "赵老师", room: "实验楼2" },
  { weekday: "周一", period: "第5节", subject: "体育", teacher: "孙教练", room: "操场" },
  { weekday: "周二", period: "第1节", subject: "数学", teacher: "李老师", room: "A301" },
  { weekday: "周二", period: "第2节", subject: "语文", teacher: "王老师", room: "A301" },
  { weekday: "周二", period: "第3节", subject: "化学", teacher: "钱老师", room: "实验楼3" },
  { weekday: "周二", period: "第4节", subject: "历史", teacher: "周老师", room: "A301" },
  { weekday: "周二", period: "第5节", subject: "音乐", teacher: "吴老师", room: "艺术楼1" },
  { weekday: "周三", period: "第1节", subject: "英语", teacher: "Chen", room: "A301" },
  { weekday: "周三", period: "第2节", subject: "物理", teacher: "赵老师", room: "实验楼2" },
  { weekday: "周三", period: "第3节", subject: "数学", teacher: "李老师", room: "A301" },
  { weekday: "周三", period: "第4节", subject: "生物", teacher: "郑老师", room: "实验楼4" },
  { weekday: "周三", period: "第5节", subject: "班会", teacher: "班主任", room: "A301" },
  { weekday: "周四", period: "第1节", subject: "语文", teacher: "王老师", room: "A301" },
  { weekday: "周四", period: "第2节", subject: "英语", teacher: "Chen", room: "A301" },
  { weekday: "周四", period: "第3节", subject: "地理", teacher: "冯老师", room: "A301" },
  { weekday: "周四", period: "第4节", subject: "数学", teacher: "李老师", room: "A301" },
  { weekday: "周四", period: "第5节", subject: "美术", teacher: "何老师", room: "艺术楼2" },
  { weekday: "周五", period: "第1节", subject: "物理", teacher: "赵老师", room: "实验楼2" },
  { weekday: "周五", period: "第2节", subject: "化学", teacher: "钱老师", room: "实验楼3" },
  { weekday: "周五", period: "第3节", subject: "语文", teacher: "王老师", room: "A301" },
  { weekday: "周五", period: "第4节", subject: "英语", teacher: "Chen", room: "A301" },
  { weekday: "周五", period: "第5节", subject: "数学", teacher: "李老师", room: "A301" },
]

/** 模拟网络延迟，让三态真实可见。 */
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function listLessons(): Promise<readonly Lesson[]> {
  return delay(LESSONS)
}
