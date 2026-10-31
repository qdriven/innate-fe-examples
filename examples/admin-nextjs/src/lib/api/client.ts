import type {
  WorkspaceListSceneData,
  RecordDetailSceneData,
  IntegrationHealthSceneData,
  ApprovalReviewSceneData,
  ReportingWizardSceneData,
  PolicySettingsSceneData,
  DashboardSceneData,
} from "@innate/scene-mocks"

// RSC 里 fetch 同源 Route Handler 需要绝对 URL。
// 接真实后端时，设置 NEXT_PUBLIC_API_BASE_URL 指向外部 mock server / 真实后端即可，
// 本文件是唯一需要改动（或仅通过环境变量配置）的入口。
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4002"

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(API_BASE_URL + path, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(
      `API request failed: ${res.status} ${res.statusText} (${path})`
    )
  }
  return res.json() as Promise<T>
}

/** 基准 demo 场景 slug（对应 src/app/api/scenes/[scene]/route.ts） */
export type SceneSlug =
  | "workspace-list"
  | "record-detail"
  | "integration-health"
  | "approval-review"
  | "reporting-wizard"
  | "policy-settings"

export function fetchWorkspaceListData(): Promise<WorkspaceListSceneData> {
  return apiFetch<WorkspaceListSceneData>("/api/scenes/workspace-list")
}

export function fetchRecordDetailData(): Promise<RecordDetailSceneData> {
  return apiFetch<RecordDetailSceneData>("/api/scenes/record-detail")
}

export function fetchIntegrationHealthData(): Promise<IntegrationHealthSceneData> {
  return apiFetch<IntegrationHealthSceneData>("/api/scenes/integration-health")
}

export function fetchApprovalReviewData(): Promise<ApprovalReviewSceneData> {
  return apiFetch<ApprovalReviewSceneData>("/api/scenes/approval-review")
}

export function fetchReportingWizardData(): Promise<ReportingWizardSceneData> {
  return apiFetch<ReportingWizardSceneData>("/api/scenes/reporting-wizard")
}

export function fetchPolicySettingsData(): Promise<PolicySettingsSceneData> {
  return apiFetch<PolicySettingsSceneData>("/api/scenes/policy-settings")
}

export function fetchDashboardData(): Promise<DashboardSceneData> {
  return apiFetch<DashboardSceneData>("/api/dashboard")
}
