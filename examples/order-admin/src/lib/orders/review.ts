import type { ReviewState } from "./types"

/**
 * 审核状态机：与履约 status 正交的独立维度。
 * pending → approved / rejected，两者均为终态（不可回退、不可重开）。
 * 字段（Order.reviewState 等）定义在 types.ts，这里只放流转规则与谓词。
 */

/** 可做的审核决策（pending 仅有的两条出边）。 */
export type ReviewDecision = Extract<ReviewState, "approved" | "rejected">

export const REVIEW_TRANSITIONS: Readonly<
  Record<ReviewState, readonly ReviewState[]>
> = {
  pending: ["approved", "rejected"],
  approved: [],
  rejected: [],
}

export const REVIEW_STATE_LABELS: Readonly<Record<ReviewState, string>> = {
  pending: "待审核",
  approved: "已批准",
  rejected: "已拒绝",
}

/** 是否仍在待审队列（decideReview 的合法前置）。 */
export function isPendingReview(state: ReviewState): boolean {
  return state === "pending"
}

/** approved / rejected 为终态。 */
export function isTerminalReviewState(state: ReviewState): boolean {
  return REVIEW_TRANSITIONS[state].length === 0
}

/** 非法审核流转或缺少必填原因时抛出。 */
export class InvalidReviewDecisionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidReviewDecisionError"
  }
}

/** 断言审核流转合法；非法抛 InvalidReviewDecisionError（service.decideReview 复用）。 */
export function assertReviewTransition(
  from: ReviewState,
  to: ReviewState
): void {
  if (!REVIEW_TRANSITIONS[from].includes(to)) {
    throw new InvalidReviewDecisionError(
      `审核状态不能从「${REVIEW_STATE_LABELS[from]}」流转到「${REVIEW_STATE_LABELS[to]}」`
    )
  }
}
