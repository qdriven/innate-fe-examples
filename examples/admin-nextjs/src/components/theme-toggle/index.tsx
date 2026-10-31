"use client"

import { useTheme } from "@/components/theme-provider"
import { useSyncExternalStore } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { colorMode, setColorMode } = useTheme()
  // SSR 快照为 false、客户端为 true，等价于经典的 mounted 防水合模式
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    return (
      <div className="h-9 w-16 rounded-full bg-gray-3 p-1 dark:bg-[#020D1A]" />
    )
  }

  return (
    <button
      onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
      className="group cursor-pointer rounded-full bg-gray-3 p-1.5 text-dark outline-0 hover:outline-primary focus:outline-primary focus-visible:outline dark:bg-[#020D1A] dark:text-current"
    >
      <span className="sr-only">
        Switch to {colorMode === "light" ? "dark" : "light"} mode
      </span>
      <span aria-hidden className="relative flex gap-2.5">
        <span className="absolute size-9.5 rounded-full border border-gray-200 bg-white transition-all dark:translate-x-12 dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3" />
        <span className="relative grid size-9.5 place-items-center rounded-full">
          <SunIcon className="size-4" />
        </span>
        <span className="relative grid size-9.5 place-items-center rounded-full dark:text-white">
          <MoonIcon className="size-4" />
        </span>
      </span>
    </button>
  )
}
