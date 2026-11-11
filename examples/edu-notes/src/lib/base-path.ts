export const DOMAIN_ID = "edu-notes"

export const BASE_PATH = "/edu-notes"

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`
}
