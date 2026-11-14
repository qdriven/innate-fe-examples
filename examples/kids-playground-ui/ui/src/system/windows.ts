import { useSyncExternalStore } from "react"
import type { LearningModuleId } from "../lib/learning/types"

export type PlaygroundWindow = {
  id: string
  moduleId: LearningModuleId
  title: string
  emoji: string
  x: number
  y: number
  z: number
  minimized: boolean
}

let windows: PlaygroundWindow[] = []
const listeners = new Set<() => void>()

function emit() {
  windows = [...windows]
  for (const listener of listeners) listener()
}

function focus(windowId: string) {
  const active = windows.find((item) => item.id === windowId)
  if (!active) return
  const rest = windows
    .filter((item) => item.id !== windowId)
    .sort((left, right) => left.z - right.z)
  rest.forEach((item, index) => {
    item.z = index + 10
  })
  active.z = rest.length + 10
  emit()
}

function open(moduleId: LearningModuleId, title: string, emoji: string) {
  const existing = windows.find((item) => item.moduleId === moduleId)
  if (existing) {
    existing.minimized = false
    focus(existing.id)
    return
  }
  const cascade = (windows.length % 5) * 26
  const width = 620
  const height = 430
  const id = `${moduleId}-${Date.now()}`
  windows.push({
    id,
    moduleId,
    title,
    emoji,
    x: Math.min(110 + cascade, Math.max(8, window.innerWidth - width - 12)),
    y: Math.min(44 + cascade, Math.max(8, window.innerHeight - height - 58)),
    z: windows.length + 10,
    minimized: false,
  })
  focus(id)
}

function minimize(windowId: string) {
  const target = windows.find((item) => item.id === windowId)
  if (!target) return
  target.minimized = true
  emit()
}

function toggleFromTaskbar(windowId: string) {
  const target = windows.find((item) => item.id === windowId)
  if (!target) return
  if (target.minimized) {
    target.minimized = false
    focus(windowId)
  } else {
    target.minimized = true
    emit()
  }
}

function close(windowId: string) {
  windows = windows.filter((item) => item.id !== windowId)
  emit()
}

function snapshot() {
  return windows
}

export function usePlaygroundWindows() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    snapshot,
    snapshot
  )
}

export const playgroundWindowManager = {
  open,
  close,
  minimize,
  focus,
  toggleFromTaskbar,
}
