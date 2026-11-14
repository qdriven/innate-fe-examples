import { PatternScenePageBody } from "@innate/admin-composites/pattern-scene-page-body"
import { ApprovalReviewSceneView } from "@innate/scene-catalog/scene-views"
import { getSceneDocument } from "../../lib/scene-documents"

export function ApprovalReviewPage() {
  const document = getSceneDocument("approval-review")

  return (
    <PatternScenePageBody
      specContent={document?.content}
      example={<ApprovalReviewSceneView />}
    />
  )
}
