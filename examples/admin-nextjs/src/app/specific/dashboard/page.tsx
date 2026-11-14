import { DashboardShell } from "@/components/dashboard-shell"
import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { DashboardSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "@/lib/scene-documents"

export default function SpecificDashboardPage() {
  const document = getSceneDocument("dashboard")

  return (
    <DashboardShell>
      <PatternScenePageBody
        specContent={document?.content}
        example={<DashboardSceneView />}
      />
    </DashboardShell>
  )
}
