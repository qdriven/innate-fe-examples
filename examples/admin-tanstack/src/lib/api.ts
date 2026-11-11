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

/**
 * 场景数据访问层。
 *
 * 分层：视图 → 本文件 → src/server/scene-api.ts → @innate/scene-mocks。
 * 切换真实后端时，把下方实现改为 `fetch(API_BASE_URL + '/api/...')`。
 * 统一加 ~300ms 模拟延迟：mock 同步返回时视图永远看不到 loading 态，
 * 骨架屏 / 进场动效就没有验证出口。
 */

function withMockLatency<T>(data: Promise<T>, ms = 300): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      data.then(resolve, reject)
    }, ms)
  })
}

export async function fetchDashboardData(): Promise<DashboardSceneData> {
  return withMockLatency(getDashboardSceneData())
}

export async function fetchWorkspaceListData(): Promise<WorkspaceListSceneData> {
  return withMockLatency(getWorkspaceListSceneData())
}

export async function fetchRecordDetailData(): Promise<RecordDetailSceneData> {
  return withMockLatency(getRecordDetailSceneData())
}

export async function fetchIntegrationHealthData(): Promise<IntegrationHealthSceneData> {
  return withMockLatency(getIntegrationHealthSceneData())
}

export async function fetchApprovalReviewData(): Promise<ApprovalReviewSceneData> {
  return withMockLatency(getApprovalReviewSceneData())
}

export async function fetchReportingWizardData(): Promise<ReportingWizardSceneData> {
  return withMockLatency(getReportingWizardSceneData())
}

export async function fetchPolicySettingsData(): Promise<PolicySettingsSceneData> {
  return withMockLatency(getPolicySettingsSceneData())
}
