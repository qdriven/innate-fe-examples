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
import { Stamp } from "@innate/ink"
import {
  TASK_COLUMN_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_COLUMNS,
  canMoveTo,
} from "../../lib/tasks/types"
import type { Task, TaskColumn } from "../../lib/tasks/types"
import { fetchTasks, moveTask } from "../../lib/tasks/service"
import { useAsync } from "../../lib/use-async"

function BoardSkeleton() {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      aria-hidden
    >
      {TASK_COLUMNS.map((c) => (
        <div key={c} className="space-y-2">
          <Skeleton className="h-8" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ))}
    </div>
  )
}

function TaskCard({
  task,
  onMove,
}: {
  task: Task
  onMove: (task: Task, to: TaskColumn) => void
}) {
  const targets = TASK_COLUMNS.filter((c) => canMoveTo(task.column, c))
  return (
    <div
      data-slot="edu-task-card"
      className="rounded-lg border bg-card p-3 shadow-xs"
    >
      <p className="text-sm font-medium leading-snug">{task.title}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Badge variant="secondary">{task.subject}</Badge>
        <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
          {TASK_PRIORITY_LABELS[task.priority]}
        </Badge>
        <span className="ml-auto tabular-nums">{task.due}</span>
      </div>
      {targets.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {targets.map((c) => (
            <Button
              key={c}
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => onMove(task, c)}
            >
              → {TASK_COLUMN_LABELS[c]}
            </Button>
          ))}
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <Stamp text="DONE" ink="green" label="已完成" size={44} />
        </div>
      )}
    </div>
  )
}

export function TasksPage() {
  const { data, loading, error, reload } = useAsync(fetchTasks, [])
  const [busy, setBusy] = useState(false)

  const handleMove = async (task: Task, to: TaskColumn) => {
    if (!data) return
    if (!canMoveTo(task.column, to)) return
    setBusy(true)
    try {
      await moveTask(task.id, to, data)
      toast.success(`「${task.title}」移到 ${TASK_COLUMN_LABELS[to]}`)
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "移动失败")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      {error ? (
        <Alert>
          <AlertTitle>作业加载失败</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          <button className="mt-2 text-sm underline" onClick={reload}>
            重试
          </button>
        </Alert>
      ) : loading || !data ? (
        <BoardSkeleton />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          role="list"
          aria-label="作业看板"
        >
          {TASK_COLUMNS.map((column) => {
            const items = data.filter((t) => t.column === column)
            return (
              <section
                key={column}
                role="listitem"
                aria-label={TASK_COLUMN_LABELS[column]}
                className="rounded-xl border bg-muted/40 p-3"
              >
                <header className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">
                    {TASK_COLUMN_LABELS[column]}
                  </h2>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {items.length}
                  </span>
                </header>
                <div className="space-y-2">
                  {items.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={(t, c) => void handleMove(t, c)}
                    />
                  ))}
                  {items.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      暂无
                    </p>
                  ) : null}
                </div>
              </section>
            )
          })}
        </div>
      )}
      {busy ? <span className="sr-only">处理中</span> : null}
    </div>
  )
}
