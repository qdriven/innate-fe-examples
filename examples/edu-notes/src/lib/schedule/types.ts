/** 课程表领域类型（无 UI 依赖）。星期与节次是唯一事实源，UI 与 service 共用。 */

export const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五"] as const
export type Weekday = (typeof WEEKDAYS)[number]

export const PERIODS = ["第1节", "第2节", "第3节", "第4节", "第5节"] as const
export type Period = (typeof PERIODS)[number]

export type Subject =
  | "语文"
  | "数学"
  | "英语"
  | "物理"
  | "化学"
  | "生物"
  | "历史"
  | "地理"
  | "体育"
  | "音乐"
  | "美术"
  | "班会"

/** 一节课：格子里的全部信息。 */
export interface Lesson {
  readonly weekday: Weekday
  readonly period: Period
  readonly subject: Subject
  readonly teacher: string
  readonly room: string
}

/** 课程冲突：同一星期 + 节次被排了两门课。UI 与 service 共用这条谓词。 */
export function isConflicted(
  lessons: readonly Lesson[],
  candidate: Pick<Lesson, "weekday" | "period">
): boolean {
  return lessons.some(
    (l) => l.weekday === candidate.weekday && l.period === candidate.period
  )
}

/** 科目 → 便利贴色（纯展示映射，ink StickyNote 的 color）。 */
export const SUBJECT_COLORS: Readonly<
  Record<Subject, "yellow" | "green" | "orange" | "pink" | "blue">
> = {
  语文: "yellow",
  数学: "blue",
  英语: "green",
  物理: "orange",
  化学: "green",
  生物: "green",
  历史: "orange",
  地理: "blue",
  体育: "pink",
  音乐: "pink",
  美术: "pink",
  班会: "yellow",
}
