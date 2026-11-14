import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { RecordDetailSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "../../lib/scene-documents"

export function RecordDetailPage() {
  const document = getSceneDocument("record-detail")

  return (
    <PatternScenePageBody
      specContent={document?.content}
      example={<RecordDetailSceneView />}
    />
  )
}
