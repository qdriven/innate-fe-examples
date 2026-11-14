import { DashboardShell } from "@/components/dashboard-shell"
import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { WorkspaceListSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "@/lib/scene-documents"

export default function WorkspaceListPage() {
  const document = getSceneDocument("workspace-list")

  return (
    <DashboardShell>
      <PatternScenePageBody
        specContent={document?.content}
        example={<WorkspaceListSceneView />}
      />
    </DashboardShell>
  )
}
