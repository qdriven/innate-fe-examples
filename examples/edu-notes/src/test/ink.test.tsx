import { describe, expect, it } from "vitest"

describe("@innate/ink 在 edu-notes 里可用（jsdom 冒烟）", () => {
  it("StickyNote 渲染便利贴", async () => {
    const { render } = await import("@testing-library/react")
    const { StickyNote } = await import("@innate/ink")

    render(<StickyNote color="yellow">函数与几何</StickyNote>)
    expect(document.querySelector('[data-slot="sticky-note"]')).toBeTruthy()
  })
})
