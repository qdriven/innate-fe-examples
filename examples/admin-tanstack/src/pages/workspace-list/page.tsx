import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { WorkspaceListSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "../../lib/scene-documents"

export function WorkspaceListPage() {
  const document = getSceneDocument("workspace-list")

  return (
    <PatternScenePageBody
      specContent={document?.content}
      example={<WorkspaceListSceneView />}
    />
  )
}
