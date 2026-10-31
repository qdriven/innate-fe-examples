// 视图适配层（仅服务端使用）：把 Playground 状态投影成与基线 demo-snapshot
// 相同的 DemoSnapshot 形状，让五个页面的渲染组件无需感知数据来源。

import baselineJson from "@/data/demo-snapshot.json"
import { loadPlayground, type PlaygroundState } from "@/lib/server/store"
import type { DemoSnapshot } from "@/lib/snapshot"

export const baseline = baselineJson as DemoSnapshot

export function toSnapshotView(state: PlaygroundState): DemoSnapshot {
  const { result, skel, description, createdAt } = state
  const leanSource = result.lean.files[0]
  const goSource = result.go?.files.find((f) => f.path.endsWith("data.go"))
  return {
    generatedAt: createdAt,
    demoPath: "(playground)",
    domains: result.snapshot
      ? [
          {
            name: result.snapshot.domain,
            description:
              result.snapshot.description || description.slice(0, 80),
            formatVersion: 1,
            declarations: result.snapshot.declarations,
          },
        ]
      : [],
    pipeline: result.steps.map((step) => ({
      id: step.id,
      title: step.title,
      status: step.status,
      detail: step.detail,
      command: step.command,
    })),
    theorems: [],
    propertyTests: [],
    diff: {
      summary: { breaking: 0, dangerous: 0, compatible: 0 },
      changes: [],
    },
    badProof: { rejected: false, firstError: "", falseGoal: "" },
    momentB: { mutated: "", proofError: "", executed: false },
    sources: [
      {
        key: "pg-skel",
        label: "你的 Skel 契约",
        path: "playground.skel",
        language: "skel",
        content: skel,
        truncated: false,
        totalLines: skel.split("\n").length,
      },
      ...(leanSource
        ? [
            {
              key: "pg-lean",
              label: "生成的 Lean 类型",
              path: leanSource.path,
              language: "lean",
              content: leanSource.content,
              truncated: false,
              totalLines: leanSource.content.split("\n").length,
            },
          ]
        : []),
      ...(goSource
        ? [
            {
              key: "pg-go",
              label: "生成的 Go 类型",
              path: goSource.path,
              language: "go",
              content: goSource.content,
              truncated: false,
              totalLines: goSource.content.split("\n").length,
            },
          ]
        : []),
    ],
  }
}

export function getActiveSnapshot(): {
  snapshot: DemoSnapshot
  playground: PlaygroundState | null
} {
  const playground = loadPlayground()
  if (playground && playground.result.ok) {
    return { snapshot: toSnapshotView(playground), playground }
  }
  return { snapshot: baseline, playground }
}
