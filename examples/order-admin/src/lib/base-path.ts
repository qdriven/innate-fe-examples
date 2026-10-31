export const DOMAIN_ID = "order-admin"

export const BASE_PATH = "/order-admin"

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`
}
