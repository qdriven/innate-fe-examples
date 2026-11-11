import { Alert, AlertDescription, AlertTitle, Skeleton } from "@innate/ui"
import { StickyNote, StickyNoteTitle, StickyNoteContent } from "@innate/ink"
import { PERIODS, SUBJECT_COLORS, WEEKDAYS } from "../../lib/schedule/types"
import { lessonAt, fetchLessons } from "../../lib/schedule/service"
import { useAsync } from "../../lib/use-async"

function ScheduleSkeleton() {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: "5rem repeat(5, 1fr)" }}
      aria-hidden
    >
      {WEEKDAYS.map((d) => (
        <Skeleton key={d} className="h-8" />
      ))}
      {PERIODS.map(() =>
        WEEKDAYS.map((d) => <Skeleton key={d} className="h-24" />)
      )}
    </div>
  )
}

export function SchedulePage() {
  const { data, loading, error, reload } = useAsync(fetchLessons, [])

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>课程表加载失败</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          <button className="mt-2 text-sm underline" onClick={reload}>
            重试
          </button>
        </Alert>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="p-6">
        <ScheduleSkeleton />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid gap-2" role="table" aria-label="一周课程表">
        {/* 表头：星期 */}
        <div
          role="row"
          className="grid gap-2"
          style={{ gridTemplateColumns: "5rem repeat(5, 1fr)" }}
        >
          <span role="columnheader" className="text-sm text-muted-foreground" />
          {WEEKDAYS.map((d) => (
            <span
              key={d}
              role="columnheader"
              className="text-center text-sm font-semibold"
            >
              {d}
            </span>
          ))}
        </div>

        {/* 行：节次 */}
        {PERIODS.map((period, pi) => (
          <div
            key={period}
            role="row"
            className="grid gap-2"
            style={{ gridTemplateColumns: "5rem repeat(5, 1fr)" }}
          >
            <span
              role="rowheader"
              className="flex items-center text-sm text-muted-foreground"
            >
              {period}
            </span>
            {WEEKDAYS.map((weekday) => {
              const lesson = lessonAt(data, weekday, pi)
              if (!lesson) {
                return (
                  <div
                    key={weekday}
                    role="cell"
                    className="min-h-24 rounded-lg border border-dashed border-border/60"
                    aria-label={`${weekday}${period}空档`}
                  />
                )
              }
              return (
                <div key={weekday} role="cell" className="min-h-24">
                  <StickyNote
                    color={SUBJECT_COLORS[lesson.subject]}
                    tilt={false}
                    className="min-h-24 w-full"
                  >
                    <StickyNoteTitle>{lesson.subject}</StickyNoteTitle>
                    <StickyNoteContent className="text-xs leading-snug">
                      {lesson.teacher}
                      <br />
                      {lesson.room}
                    </StickyNoteContent>
                  </StickyNote>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
