import { useEffect, useState } from "react"
import type { PlaygroundWindow } from "../system/windows"
import { playgroundWindowManager } from "../system/windows"

type Props = {
  windows: PlaygroundWindow[]
}

export default function PlaygroundTaskbar({ windows }: Props) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <footer className="fixed inset-x-0 bottom-0 z-[90] flex h-14 items-center gap-2 border-t border-line bg-paper/90 px-3 backdrop-blur">
      <span className="font-script text-lg text-ink">学习乐园</span>
      <div className="mx-1 h-6 w-px bg-line-soft" />
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
        {windows.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`font-hand flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-sm ${
              item.minimized
                ? "border-line-soft text-ink-muted"
                : "border-line bg-sticky-blue text-ink"
            }`}
            onClick={() => playgroundWindowManager.toggleFromTaskbar(item.id)}
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span className="max-w-24 truncate">{item.title}</span>
          </button>
        ))}
      </div>
      <span className="font-hand text-sm text-ink-muted">
        {now.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </footer>
  )
}
