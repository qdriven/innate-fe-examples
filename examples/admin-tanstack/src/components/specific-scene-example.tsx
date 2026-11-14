import type { SpecificSceneSample } from "../lib/scene-catalog"
import {
  ApprovalReviewSceneView,
  DashboardSceneView,
  IntegrationHealthSceneView,
  PolicySettingsSceneView,
  RecordDetailSceneView,
  ReportingWizardSceneView,
  WorkspaceListSceneView,
} from "@innate/scene-catalog/scene-views"
import { SceneIntro } from "@innate/scene-catalog/scene-blocks"
import { Card, CardContent } from "@innate/ui"

/**
 * 按 primaryPatternId 复用基准 Pattern 实现（一规范一实现）。
 * 无 pattern 的场景给参考态骨架。
 */
export function SpecificSceneExample({
  scene,
}: {
  scene: SpecificSceneSample
}) {
  if (!scene.primaryPatternId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-sm font-medium">参考态骨架</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {scene.title} 尚未绑定基准 Pattern。规范侧已沉淀结构与状态合同，
            例子侧待补充专用 Demo。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-[var(--spacing-section)]">
      <SceneIntro
        title={`${scene.title} · 基准实现示例`}
        description={`复用「${scene.primaryPatternId}」Pattern 的权威实现，叠加本场景业务语义。`}
        chips={[scene.primaryPatternId, scene.supportLevel]}
      />
      <PatternView patternId={scene.primaryPatternId} />
    </div>
  )
}

function PatternView({ patternId }: { patternId: string }) {
  switch (patternId) {
    case "dashboard":
      return <DashboardSceneView />
    case "workspace-list":
      return <WorkspaceListSceneView />
    case "record-detail":
      return <RecordDetailSceneView />
    case "reporting-wizard":
      return <ReportingWizardSceneView />
    case "approval-review":
      return <ApprovalReviewSceneView />
    case "integration-health":
      return <IntegrationHealthSceneView />
    case "policy-settings":
      return <PolicySettingsSceneView />
    default:
      return null
  }
}
