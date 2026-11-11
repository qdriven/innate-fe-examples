/** 笔记本领域类型（无 UI 依赖）。 */

export const NOTE_STATES = ["draft", "published", "archived"] as const
export type NoteState = (typeof NOTE_STATES)[number]

export const NOTE_STATE_LABELS: Readonly<Record<NoteState, string>> = {
  draft: "草稿",
  published: "已发布",
  archived: "归档",
}

export interface Note {
  readonly id: string
  readonly title: string
  readonly subject: string
  /** 纯文本摘要（列表展示）；正文在详情页按需取。 */
  readonly excerpt: string
  readonly content: string
  readonly state: NoteState
  readonly updatedAt: string
  readonly tags: readonly string[]
}

/** 可否从当前状态流转到目标状态：唯一谓词，UI 与 service 共用。 */
const TRANSITIONS: Readonly<Record<NoteState, readonly NoteState[]>> = {
  draft: ["published"],
  published: ["archived", "draft"],
  archived: [],
}

export function canTransition(from: NoteState, to: NoteState): boolean {
  return TRANSITIONS[from].includes(to)
}
