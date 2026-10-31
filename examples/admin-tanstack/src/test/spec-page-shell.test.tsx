import { SpecPageShell } from "@innate/admin-composites/spec-page-shell"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

function renderShell(contentWidth?: "default" | "wide") {
  return render(
    <SpecPageShell
      contentWidth={contentWidth}
      header={<div>测试页头</div>}
      sidebar={<nav>测试侧边栏</nav>}
    >
      <p>页面内容</p>
    </SpecPageShell>
  )
}

describe("SpecPageShell", () => {
  it("renders sidebar, header and children", () => {
    renderShell()

    expect(screen.getByText("测试侧边栏")).toBeTruthy()
    expect(screen.getByText("测试页头")).toBeTruthy()
    expect(screen.getByText("页面内容")).toBeTruthy()
  })

  it("applies the default content width tokens", () => {
    renderShell()

    const content = screen.getByText("页面内容").parentElement
    expect(content).not.toBeNull()
    expect(content?.className).toContain("mx-auto")
    expect(content?.style.maxWidth).toBe("var(--content-max-width)")
  })

  it("applies the wide content width tokens", () => {
    renderShell("wide")

    const content = screen.getByText("页面内容").parentElement
    expect(content?.style.maxWidth).toBe("var(--content-max-width-wide)")
  })
})
