export const DOMAIN_ID = "admin-tanstack"
export const BASE_PATH = "/admin-tanstack"

/** 把 domain 内部路径挂到 `/admin-tanstack` 前缀下。 */
export function withBasePath(path: string): string {
  if (!path || path === "/") return BASE_PATH
  return path.startsWith("/") ? `${BASE_PATH}${path}` : `${BASE_PATH}/${path}`
}
