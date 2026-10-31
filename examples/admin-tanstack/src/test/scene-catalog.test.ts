import { createSceneCatalog, getSceneDocument } from "@innate/scene-catalog"
import { describe, expect, it } from "vitest"

const identity = (path: string) => path
const catalog = createSceneCatalog(identity)

describe("createSceneCatalog", () => {
  it("exposes the 7 benchmark pattern scenes", () => {
    expect(catalog.sceneSamples).toHaveLength(7)
    expect(catalog.sceneSamples.map((scene) => scene.id)).toEqual([
      "dashboard",
      "workspace-list",
      "record-detail",
      "reporting-wizard",
      "approval-review",
      "integration-health",
      "policy-settings",
    ])
  })

  it("resolves routes through the provided route resolver", () => {
    const prefixed = createSceneCatalog((path) => `/dashboard${path}`)

    expect(prefixed.sceneSamples[0]?.route).toBe(
      "/dashboard/specific/dashboard"
    )
    expect(prefixed.getPatternSceneById("dashboard")?.route).toBe(
      "/dashboard/specific/dashboard"
    )
  })

  it("looks up pattern scenes by id", () => {
    expect(catalog.getPatternSceneById("dashboard")?.title).toBe("仪表盘")
    expect(catalog.getPatternSceneById("missing")).toBeUndefined()
  })

  it("keeps specific scene primaryPatternId references resolvable", () => {
    const patternIds = new Set(catalog.sceneSamples.map((scene) => scene.id))
    const dangling = catalog.specificSceneSamples.filter(
      (scene) =>
        scene.primaryPatternId && !patternIds.has(scene.primaryPatternId)
    )

    expect(dangling).toEqual([])
  })
})

describe("getSceneDocument", () => {
  it("resolves a parseable spec document for every pattern scene", () => {
    for (const scene of catalog.sceneSamples) {
      const doc = getSceneDocument(scene.id)

      expect(doc, `spec doc for ${scene.id}`).toBeDefined()
      expect(doc?.title.length).toBeGreaterThan(0)
      expect(doc?.sourcePath).toMatch(/^packages\/scene-specs\//)
      // spec markdown carries a frontmatter block whose id matches the scene
      expect(doc?.content).toContain(`id: ${scene.id}`)
      expect(doc?.content).toContain("## 场景目标")
    }
  })

  it("returns undefined for unknown or missing ids", () => {
    expect(getSceneDocument("missing")).toBeUndefined()
    expect(getSceneDocument()).toBeUndefined()
  })
})
