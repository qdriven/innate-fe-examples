export const DOMAIN_ID = "project-management"

export const BASE_PATH = "/project-management"

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`
}
