import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { IntegrationHealthSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "../../lib/scene-documents"

export function IntegrationHealthPage() {
  const document = getSceneDocument("integration-health")

  return (
    <PatternScenePageBody
      specContent={document?.content}
      example={<IntegrationHealthSceneView />}
    />
  )
}
