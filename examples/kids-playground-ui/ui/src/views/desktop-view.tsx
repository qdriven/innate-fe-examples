import { useEffect, useState } from "react"
import { Doodle, Sticker } from "@innate/ink"
import LearningWindow from "../components/learning-window"
import PlaygroundTaskbar from "../components/playground-taskbar"
import { listLearningModules } from "../lib/learning/service"
import type { LearningModule } from "../lib/learning/types"
import {
  playgroundWindowManager,
  usePlaygroundWindows,
} from "../system/windows"

export default function DesktopView() {
  const [modules, setModules] = useState<LearningModule[]>([])
  const windows = usePlaygroundWindows()

  useEffect(() => {
    let active = true
    listLearningModules().then((data) => {
      if (active) setModules(data)
    })
    return () => {
      active = false
    }
  }, [])

  function openModule(module: LearningModule) {
    playgroundWindowManager.open(module.id, module.title, module.emoji)
  }

  return (
    <main className="playground-desk relative h-[calc(100dvh-56px)] w-screen overflow-hidden">
      <Doodle
        name="light-bulb"
        size={78}
        className="absolute right-16 top-8 opacity-70"
      />
      <Sticker
        name="balloon-bunch"
        size={72}
        className="absolute right-40 top-40"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col gap-5 px-5 py-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-hand text-sm text-ink-muted">
              纸上小游戏 · 每天 10 分钟
            </p>
            <h1 className="font-script text-4xl leading-none text-ink">
              手绘儿童学习乐园
            </h1>
          </div>
          <Sticker name="a-plus" size={64} />
        </header>

        {modules.length === 0 ? (
          <p className="font-hand text-lg text-ink-muted">正在铺开画纸…</p>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {modules.map((module, index) => (
              <button
                key={module.id}
                type="button"
                className="hand-tile text-left"
                onClick={() => openModule(module)}
              >
                <div
                  className={`relative flex h-40 flex-col justify-between rounded-3xl p-4 shadow-sm ${
                    index % 4 === 0
                      ? "bg-sticky-yellow"
                      : index % 4 === 1
                        ? "bg-sticky-green"
                        : index % 4 === 2
                          ? "bg-sticky-pink"
                          : "bg-sticky-blue"
                  }`}
                  style={{ rotate: `${index % 2 === 0 ? -1.2 : 1.1}deg` }}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {module.emoji}
                  </span>
                  <div>
                    <h2 className="font-script text-2xl leading-tight text-ink">
                      {module.title}
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">{module.tagline}</p>
                  </div>
                </div>
              </button>
            ))}
          </section>
        )}

        <section className="mt-auto flex items-end gap-3">
          <Sticker name="potted-plant" size={64} />
          <p className="font-hand max-w-xl text-base text-ink-soft">
            点击便利贴打开学习窗口；每个窗口都可以拖动，像把小游戏摆在书桌上。
          </p>
        </section>
      </div>

      {windows
        .filter((item) => !item.minimized)
        .map((item) => {
          const module = modules.find((entry) => entry.id === item.moduleId)
          if (!module) return null
          return (
            <LearningWindow
              key={item.id}
              module={module}
              windowId={item.id}
              x={item.x}
              y={item.y}
              z={item.z}
            />
          )
        })}

      <PlaygroundTaskbar windows={windows} />
    </main>
  )
}
