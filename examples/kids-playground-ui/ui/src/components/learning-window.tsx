import { useEffect, useRef, useState } from "react"
import { Paper } from "@innate/ink"
import type { LearningModule } from "../lib/learning/types"
import { playgroundWindowManager } from "../system/windows"

type Props = {
  module: LearningModule
  windowId: string
  x: number
  y: number
  z: number
}

const lessonSteps: Record<LearningModule["id"], string[]> = {
  letters: ["Aa 像小山", "Bb 有两个肚子", "Cc 张开小钳子"],
  numbers: ["1 只小羊", "再来 1 只", "现在有 2 只！"],
  drawing: ["先画一个大圆", "添上笑眯眯的眼睛", "画出彩色光线"],
  stories: ["小猫捡到钥匙", "它走过纸桥", "打开了故事小屋"],
}

export default function LearningWindow({
  module,
  windowId,
  x,
  y,
  z,
}: Props) {
  const drag = useRef<{ startX: number; startY: number } | null>(null)
  const [position, setPosition] = useState({ x, y })
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    function move(event: PointerEvent) {
      if (!drag.current) return
      setPosition({
        x: Math.max(
          8,
          Math.min(event.clientX - drag.current.startX, window.innerWidth - 220)
        ),
        y: Math.max(
          8,
          Math.min(event.clientY - drag.current.startY, window.innerHeight - 120)
        ),
      })
    }

    function stop() {
      drag.current = null
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", stop)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", stop)
    }
  }, [])

  const step = lessonSteps[module.id]

  return (
    <Paper
      className="absolute flex w-[620px] max-w-[calc(100vw-24px)] flex-col gap-4 rounded-[22px] p-5"
      style={{ left: position.x, top: position.y, zIndex: z }}
      rules="ruled-hand"
      tape="top"
      tilt={false}
      seed={module.id}
      onPointerDown={() => playgroundWindowManager.focus(windowId)}
    >
      <header
        className="flex cursor-grab items-center gap-3"
        onPointerDown={(event) => {
          drag.current = {
            startX: event.clientX - position.x,
            startY: event.clientY - position.y,
          }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
      >
        <span aria-hidden="true" className="text-2xl">
          {module.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-script text-2xl leading-none text-ink">
            {module.title}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{module.tagline}</p>
        </div>
        <button
          type="button"
          className="font-hand rounded-full border border-line px-3 py-1 text-sm text-ink transition hover:bg-ink/10"
          onClick={() => playgroundWindowManager.minimize(windowId)}
        >
          收起
        </button>
        <button
          type="button"
          className="font-hand rounded-full bg-red px-3 py-1 text-sm text-paper transition hover:brightness-105"
          onClick={() => playgroundWindowManager.close(windowId)}
        >
          关闭
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border-2 border-dashed border-line-soft p-3">
          <p className="font-hand text-lg text-ink">{step[activeStep]}</p>
          <p className="mt-2 text-sm text-ink-muted">{module.activity}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="font-hand rounded-full border border-line px-3 py-1 text-sm disabled:opacity-40"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((value) => value - 1)}
            >
              上一页
            </button>
            <button
              type="button"
              className="font-hand rounded-full bg-grass px-3 py-1 text-sm text-paper disabled:opacity-40"
              disabled={activeStep === step.length - 1}
              onClick={() => setActiveStep((value) => value + 1)}
            >
              下一页
            </button>
          </div>
        </div>
        <aside className="flex w-32 flex-col justify-between rounded-2xl bg-sticky-yellow p-3">
          <p className="font-script text-lg">{module.age}</p>
          <p className="font-hand text-sm">{module.minutes} 分钟</p>
        </aside>
      </section>
    </Paper>
  )
}
