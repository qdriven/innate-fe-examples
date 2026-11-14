import { DashboardShell } from "@/components/dashboard-shell"
import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { PolicySettingsSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "@/lib/scene-documents"

export default function PolicySettingsPage() {
  const document = getSceneDocument("policy-settings")

  return (
    <DashboardShell>
      <PatternScenePageBody
        specContent={document?.content}
        example={<PolicySettingsSceneView />}
      />
    </DashboardShell>
  )
}
