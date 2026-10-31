/** Routes under `app/dashboard/` — shared shell (sidebar + header). */
export const DASHBOARD_PREFIX = "/dashboard" as const

export function dashboardPath(segment = ""): string {
  if (!segment || segment === "/") {
    return DASHBOARD_PREFIX
  }

  const normalized = segment.startsWith("/") ? segment : `/${segment}`
  return `${DASHBOARD_PREFIX}${normalized}`
}
