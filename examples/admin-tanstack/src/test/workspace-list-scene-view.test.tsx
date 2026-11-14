import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WorkspaceListSceneView } from "../components/scenes/workspace-list-scene-view"

// WorkspaceListSceneView composes @innate/ui primitives and scene-blocks
// without any router context, so it renders standalone.
describe("WorkspaceListSceneView", () => {
  it("renders the scene intro, filter bar and metric cards", () => {
    render(<WorkspaceListSceneView />)

    expect(screen.getByText("Workspace 列表样板")).toBeTruthy()
    expect(screen.getByText("筛选与操作区")).toBeTruthy()
    expect(screen.getByText("待处理记录")).toBeTruthy()
    expect(screen.getByText("128")).toBeTruthy()
  })

  it("renders the record table with headers and rows", () => {
    render(<WorkspaceListSceneView />)

    expect(screen.getByText("记录列表")).toBeTruthy()
    expect(screen.getByText("负责人")).toBeTruthy()
    expect(screen.getByText("组织单元 A 设备巡检台账")).toBeTruthy()
    expect(screen.getByText("王晨")).toBeTruthy()
  })
})
