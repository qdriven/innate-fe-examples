import { describe, expect, it } from "vitest"
import { isConflicted, WEEKDAYS, PERIODS } from "../lib/schedule/types"
import { lessonAt } from "../lib/schedule/service"
import { canTransition } from "../lib/notes/types"
import { canMoveTo, TASK_COLUMNS } from "../lib/tasks/types"

describe("课程表领域谓词", () => {
  it("isConflicted：同星期同节次冲突", () => {
    const lessons = [
      { weekday: "周一", period: "第1节", subject: "数学", teacher: "a", room: "r" },
    ] as const
    expect(isConflicted(lessons, { weekday: "周一", period: "第1节" })).toBe(
      true
    )
    expect(isConflicted(lessons, { weekday: "周一", period: "第2节" })).toBe(
      false
    )
  })

  it("lessonAt：按星期节次取课，空档返回 undefined", () => {
    const lessons = [
      { weekday: "周二", period: "第3节", subject: "化学", teacher: "b", room: "r" },
    ] as const
    expect(lessonAt(lessons, "周二", 2)?.subject).toBe("化学")
    expect(lessonAt(lessons, "周二", 0)).toBeUndefined()
  })

  it("网格规格：5 天 x 5 节", () => {
    expect(WEEKDAYS).toHaveLength(5)
    expect(PERIODS).toHaveLength(5)
  })
})

describe("笔记本领域谓词", () => {
  it("canTransition：draft → published 允许，archived 不出", () => {
    expect(canTransition("draft", "published")).toBe(true)
    expect(canTransition("published", "archived")).toBe(true)
    expect(canTransition("published", "draft")).toBe(true)
    expect(canTransition("archived", "draft")).toBe(false)
    expect(canTransition("draft", "archived")).toBe(false)
  })
})

describe("作业看板领域谓词", () => {
  it("canMoveTo：done 只进不出，同列不移动", () => {
    expect(canMoveTo("todo", "doing")).toBe(true)
    expect(canMoveTo("doing", "done")).toBe(true)
    expect(canMoveTo("done", "todo")).toBe(false)
    expect(canMoveTo("doing", "doing")).toBe(false)
    expect(TASK_COLUMNS).toHaveLength(4)
  })
})
