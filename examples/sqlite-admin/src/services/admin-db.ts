const API_BASE = "/api/sqlite-admin"

export interface SqliteTable {
  name: string
  rowCount: number
  kind: "table" | "view"
}

export interface SqliteColumn {
  cid: number
  name: string
  type: string
  pk: number
}

export interface SqliteQueryResult {
  path: string
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  truncated: boolean
  rowLimit: number
  durationMs: number
}

export interface SavedQuery {
  id: number
  name: string
  sql: string
  createdAt: string
}

function withDb(path: string, dbPath: string): string {
  if (!dbPath) return path
  const join = path.includes("?") ? "&" : "?"
  return `${path}${join}db=${encodeURIComponent(dbPath)}`
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    ...init,
  })
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data as T
}

export function fetchTables(dbPath: string) {
  return request<{ path: string; tables: SqliteTable[] }>(withDb("/tables", dbPath))
}

export function fetchSchema(dbPath: string, name: string) {
  return request<{ table: string; columns: SqliteColumn[]; ddl: string | null }>(
    withDb(`/tables/${encodeURIComponent(name)}/schema`, dbPath)
  )
}

export function runQuery(dbPath: string, sql: string) {
  return request<SqliteQueryResult>("/query", {
    method: "POST",
    body: JSON.stringify({ sql, db: dbPath }),
  })
}

export function fetchSavedQueries() {
  return request<{ queries: SavedQuery[] }>("/queries")
}

export function createSavedQuery(name: string, sql: string) {
  return request<{ query: SavedQuery }>("/queries", {
    method: "POST",
    body: JSON.stringify({ name, sql }),
  })
}

export function deleteSavedQuery(id: number) {
  return request<{ ok: boolean }>(`/queries/${id}`, { method: "DELETE" })
}
