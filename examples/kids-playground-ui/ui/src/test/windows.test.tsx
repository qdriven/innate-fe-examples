// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import {
  playgroundWindowManager,
  usePlaygroundWindows,
} from "../system/windows"

describe("playgroundWindowManager", () => {
  beforeEach(() => {
    const { result } = renderHook(() => usePlaygroundWindows())
    result.current.forEach((item) => playgroundWindowManager.close(item.id))
  })

  it("opens one singleton window per learning module", () => {
    const { result } = renderHook(() => usePlaygroundWindows())

    act(() => {
      playgroundWindowManager.open("letters", "字母花园", "🌱")
      playgroundWindowManager.open("letters", "字母花园", "🌱")
    })

    expect(result.current).toHaveLength(1)
    expect(result.current[0].moduleId).toBe("letters")
    expect(result.current[0].minimized).toBe(false)
  })

  it("minimizes and restores a window from the taskbar", () => {
    const { result } = renderHook(() => usePlaygroundWindows())

    act(() => {
      playgroundWindowManager.open("numbers", "数字牧场", "🐑")
    })
    const windowId = result.current[0].id

    act(() => {
      playgroundWindowManager.minimize(windowId)
    })
    expect(result.current[0].minimized).toBe(true)

    act(() => {
      playgroundWindowManager.toggleFromTaskbar(windowId)
    })
    expect(result.current[0].minimized).toBe(false)
  })
})
