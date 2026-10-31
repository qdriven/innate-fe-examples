import {
  getApprovalReviewMock,
  getDashboardMock,
  getIntegrationHealthMock,
  getPolicySettingsMock,
  getRecordDetailMock,
  getReportingWizardMock,
  getWorkspaceListMock,
} from "@innate/scene-mocks"

/**
 * 7 个基准 demo 场景的数据函数（domain 轨道，无 TanStack Start server fn）。
 *
 * 分层：视图 → src/lib/api.ts → 本文件 → @innate/scene-mocks。
 */

export async function getDashboardSceneData() {
  return getDashboardMock()
}

export async function getWorkspaceListSceneData() {
  return getWorkspaceListMock()
}

export async function getRecordDetailSceneData() {
  return getRecordDetailMock("tanstack")
}

export async function getIntegrationHealthSceneData() {
  return getIntegrationHealthMock()
}

export async function getApprovalReviewSceneData() {
  return getApprovalReviewMock()
}

export async function getReportingWizardSceneData() {
  return getReportingWizardMock()
}

export async function getPolicySettingsSceneData() {
  return getPolicySettingsMock()
}
