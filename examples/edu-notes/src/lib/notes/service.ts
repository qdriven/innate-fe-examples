import { findNote, listNotes } from "./mock-data"
import { canTransition } from "./types"
import type { Note, NoteState } from "./types"

export function fetchNotes(): Promise<readonly Note[]> {
  return listNotes()
}

export function fetchNote(id: string): Promise<Note | undefined> {
  return listNotes().then(() => findNote(id))
}

/** 状态流转：谓词不通过直接抛错（与 UI 共用 canTransition，不另写判断）。 */
export async function transitionNote(id: string, to: NoteState): Promise<void> {
  const note = findNote(id)
  if (!note) throw new Error(`笔记 ${id} 不存在`)
  if (!canTransition(note.state, to)) {
    throw new Error(`笔记不能从「${note.state}」流转到「${to}」`)
  }
  // mock：不落盘，仅模拟延迟
  await new Promise((r) => setTimeout(r, 120))
}
