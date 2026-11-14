import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { DashboardSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "../../../lib/scene-documents"

export function SpecificDashboardPage() {
  const document = getSceneDocument("dashboard")

  return (
    <PatternScenePageBody
      specContent={document?.content}
      example={<DashboardSceneView />}
    />
  )
}
