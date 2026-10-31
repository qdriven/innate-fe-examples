export const DOMAIN_ID = "awesome"
export const BASE_PATH = "/awesome"

/** 把 domain 内部路径挂到 `/awesome` 前缀下。 */
export function withBasePath(path: string): string {
  if (!path || path === "/") return BASE_PATH
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path
  return path.startsWith("/") ? `${BASE_PATH}${path}` : `${BASE_PATH}/${path}`
}
