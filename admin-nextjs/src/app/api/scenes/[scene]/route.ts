import {
  getWorkspaceListMock,
  getRecordDetailMock,
  getIntegrationHealthMock,
  getApprovalReviewMock,
  getReportingWizardMock,
  getPolicySettingsMock,
} from "@innate/scene-mocks"

export const runtime = "nodejs"

const sceneGetters: Record<string, () => unknown> = {
  "workspace-list": () => getWorkspaceListMock(),
  "record-detail": () => getRecordDetailMock("nextjs"),
  "integration-health": () => getIntegrationHealthMock(),
  "approval-review": () => getApprovalReviewMock(),
  "reporting-wizard": () => getReportingWizardMock(),
  "policy-settings": () => getPolicySettingsMock(),
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ scene: string }> }
) {
  const { scene } = await params
  const getter = sceneGetters[scene]
  if (!getter) {
    return Response.json({ error: `Unknown scene: ${scene}` }, { status: 404 })
  }
  return Response.json(getter())
}
