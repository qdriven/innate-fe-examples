import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { PolicySettingsSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "../../lib/scene-documents"

export function PolicySettingsPage() {
  const document = getSceneDocument("policy-settings")

  return (
    <PatternScenePageBody
      specContent={document?.content}
      example={<PolicySettingsSceneView />}
    />
  )
}
