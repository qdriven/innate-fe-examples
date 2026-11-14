import type { SpecificSceneSample } from "../lib/scene-catalog"
import {
  SpecificSceneSpecPanel,
  getPresentationMode,
} from "@innate/scene-catalog"
import { SceneSpecExampleTabs } from "@innate/admin-composites/scene-spec-example-tabs"
import { SceneIntro } from "@innate/scene-catalog/scene-blocks"
import type { ReactNode } from "react"

/**
 * specific 场景页体：双 Tab（规范 / 例子）。
 * 例子侧由调用方注入基准 Pattern 实现（一规范一实现）。
 */
export function SpecificScenePageBody({
  scene,
  example,
}: {
  scene: SpecificSceneSample
  example: ReactNode
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[var(--spacing-section)]">
      <SceneIntro
        title={scene.title}
        description={scene.description}
        chips={[
          "场景家族",
          scene.section,
          scene.navGroup ?? "通用分组",
          scene.supportLevel,
          getPresentationMode(scene),
        ]}
      />
      <SceneSpecExampleTabs
        spec={<SpecificSceneSpecPanel scene={scene} />}
        example={example}
      />
    </div>
  )
}
