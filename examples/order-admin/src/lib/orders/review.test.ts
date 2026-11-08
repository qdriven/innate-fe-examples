import { describe, expect, it } from "vitest"
import {
  assertReviewTransition,
  InvalidReviewDecisionError,
  isPendingReview,
  isTerminalReviewState,
  REVIEW_STATE_LABELS,
  REVIEW_TRANSITIONS,
} from "./review"

describe("REVIEW_TRANSITIONS（审核状态机）", () => {
  it("pending 可批准或拒绝，两者均为终态", () => {
    expect(REVIEW_TRANSITIONS.pending).toEqual(["approved", "rejected"])
    expect(REVIEW_TRANSITIONS.approved).toEqual([])
    expect(REVIEW_TRANSITIONS.rejected).toEqual([])
  })

  it("合法流转通过断言", () => {
    expect(() => assertReviewTransition("pending", "approved")).not.toThrow()
    expect(() => assertReviewTransition("pending", "rejected")).not.toThrow()
  })

  it("非法流转抛 InvalidReviewDecisionError", () => {
    expect(() => assertReviewTransition("approved", "pending")).toThrow(
      InvalidReviewDecisionError
    )
    expect(() => assertReviewTransition("rejected", "pending")).toThrow(
      InvalidReviewDecisionError
    )
    expect(() => assertReviewTransition("approved", "rejected")).toThrow(
      InvalidReviewDecisionError
    )
    expect(() => assertReviewTransition("pending", "pending")).toThrow(
      InvalidReviewDecisionError
    )
  })
})

describe("labels 与谓词", () => {
  it("覆盖三种审核状态的中文标签", () => {
    expect(REVIEW_STATE_LABELS).toEqual({
      pending: "待审核",
      approved: "已批准",
      rejected: "已拒绝",
    })
  })

  it("isPendingReview 只认 pending；终态判定与出边一致", () => {
    expect(isPendingReview("pending")).toBe(true)
    expect(isPendingReview("approved")).toBe(false)
    expect(isPendingReview("rejected")).toBe(false)
    expect(isTerminalReviewState("pending")).toBe(false)
    expect(isTerminalReviewState("approved")).toBe(true)
    expect(isTerminalReviewState("rejected")).toBe(true)
  })
})
