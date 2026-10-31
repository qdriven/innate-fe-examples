import type {
  ApprovalReviewSceneData,
  DashboardSceneData,
  IntegrationHealthSceneData,
  PolicySettingsSceneData,
  RecordDetailSceneData,
  ReportingWizardSceneData,
  WorkspaceListSceneData,
} from "@innate/scene-mocks"
import {
  getApprovalReviewSceneData,
  getDashboardSceneData,
  getIntegrationHealthSceneData,
  getPolicySettingsSceneData,
  getRecordDetailSceneData,
  getReportingWizardSceneData,
  getWorkspaceListSceneData,
} from "../server/scene-api"

/**
 * 场景数据访问层。
 *
 * 分层：视图 → 本文件 → src/server/scene-api.ts → @innate/scene-mocks。
 * 切换真实后端时，把下方实现改为 `fetch(API_BASE_URL + '/api/...')`。
 */

export async function fetchDashboardData(): Promise<DashboardSceneData> {
  return getDashboardSceneData()
}

export async function fetchWorkspaceListData(): Promise<WorkspaceListSceneData> {
  return getWorkspaceListSceneData()
}

export async function fetchRecordDetailData(): Promise<RecordDetailSceneData> {
  return getRecordDetailSceneData()
}

export async function fetchIntegrationHealthData(): Promise<IntegrationHealthSceneData> {
  return getIntegrationHealthSceneData()
}

export async function fetchApprovalReviewData(): Promise<ApprovalReviewSceneData> {
  return getApprovalReviewSceneData()
}

export async function fetchReportingWizardData(): Promise<ReportingWizardSceneData> {
  return getReportingWizardSceneData()
}

export async function fetchPolicySettingsData(): Promise<PolicySettingsSceneData> {
  return getPolicySettingsSceneData()
}
