import { useState } from "react"
import { toast } from "sonner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Skeleton,
  Toaster,
} from "@innate/ui"
import { Highlight, Tape } from "@innate/ink"
import { NOTE_STATE_LABELS, canTransition } from "../../lib/notes/types"
import type { Note, NoteState } from "../../lib/notes/types"
import { fetchNotes, transitionNote } from "../../lib/notes/service"
import { useAsync } from "../../lib/use-async"

/** 状态流转按钮的文案：唯一映射，与 canTransition 配合。 */
const NEXT_ACTION: Partial<
  Record<NoteState, { to: NoteState; label: string }>
> = {
  draft: { to: "published", label: "发布" },
  published: { to: "archived", label: "归档" },
}

function NotesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48 rounded-xl" />
      ))}
    </div>
  )
}

function NoteCard({
  note,
  onTransition,
}: {
  note: Note
  onTransition: (note: Note, to: NoteState) => void
}) {
  const action = NEXT_ACTION[note.state]
  return (
    <article
      data-slot="edu-note-card"
      className="relative rounded-xl border bg-card p-5 shadow-xs"
    >
      {/* 顶部胶带装饰（ink） */}
      <Tape
        kind="washi-stripes"
        className="absolute -top-3 left-1/2 -ml-8 h-6 w-16 -rotate-2"
        aria-hidden
      />
      <h3 className="font-semibold leading-snug">
        <Highlight tone="yellow" weight="regular" cover="under">
          {note.title}
        </Highlight>
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{note.excerpt}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{note.subject}</Badge>
        <Badge variant="outline">{NOTE_STATE_LABELS[note.state]}</Badge>
        <span className="ml-auto">{note.updatedAt}</span>
      </div>
      {action ? (
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={() => onTransition(note, action.to)}
        >
          {action.label}
        </Button>
      ) : null}
    </article>
  )
}

export function NotesPage() {
  const { data, loading, error, reload } = useAsync(fetchNotes, [])
  const [busy, setBusy] = useState(false)

  const handleTransition = async (note: Note, to: NoteState) => {
    if (!canTransition(note.state, to)) return
    setBusy(true)
    try {
      await transitionNote(note.id, to)
      toast.success(`《${note.title}》已${NOTE_STATE_LABELS[to]}`)
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "流转失败")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      {error ? (
        <Alert>
          <AlertTitle>笔记加载失败</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          <button className="mt-2 text-sm underline" onClick={reload}>
            重试
          </button>
        </Alert>
      ) : loading || !data ? (
        <NotesSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onTransition={(n, to) => void handleTransition(n, to)}
            />
          ))}
        </div>
      )}
      {busy ? <span className="sr-only">处理中</span> : null}
    </div>
  )
}
