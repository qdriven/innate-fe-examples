import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { ReportingWizardSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "../../lib/scene-documents"

export function ReportingWizardPage() {
  const document = getSceneDocument("reporting-wizard")

  return (
    <PatternScenePageBody
      specContent={document?.content}
      example={<ReportingWizardSceneView />}
    />
  )
}
