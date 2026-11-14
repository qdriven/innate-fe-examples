import { describe, expect, it } from "vitest"
import { listLearningModules } from "../lib/learning/service"

describe("listLearningModules", () => {
  it("returns four mock-first playground modules", async () => {
    const modules = await listLearningModules()

    expect(modules).toHaveLength(4)
    expect(modules.map((module) => module.id)).toEqual([
      "letters",
      "numbers",
      "drawing",
      "stories",
    ])
    expect(modules.every((module) => module.minutes > 0)).toBe(true)
  })
})
