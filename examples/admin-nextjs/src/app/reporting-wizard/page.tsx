import { DashboardShell } from "@/components/dashboard-shell"
import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { ReportingWizardSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "@/lib/scene-documents"

export default function ReportingWizardPage() {
  const document = getSceneDocument("reporting-wizard")

  return (
    <DashboardShell>
      <PatternScenePageBody
        specContent={document?.content}
        example={<ReportingWizardSceneView />}
      />
    </DashboardShell>
  )
}
