import { DashboardShell } from "@/components/dashboard-shell"
import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { RecordDetailSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "@/lib/scene-documents"

export default function RecordDetailPage() {
  const document = getSceneDocument("record-detail")

  return (
    <DashboardShell>
      <PatternScenePageBody
        specContent={document?.content}
        example={<RecordDetailSceneView />}
      />
    </DashboardShell>
  )
}
