/**
 * Read-only SQLite admin API.
 *
 *   SQLITE_DB_PATH=/absolute/or/relative.db bun server/index.ts
 *
 * Every data request may also pass `db` (query string or JSON body) to open
 * a different database file. Connections stay readonly. Saved SQL lives in a
 * sidecar database, not in the target file.
 */
import { Database } from "bun:sqlite"
import { mkdirSync } from "node:fs"
import { homedir } from "node:os"
import { isAbsolute, resolve } from "node:path"
import { validateReadOnlySql } from "./readonly-sql"

const PORT = Number(process.env.PORT || 4030)
const ROW_LIMIT = 500
const savedDbPath = resolve(
  process.env.SQLITE_ADMIN_SAVED_DB ||
    `${homedir()}/.innate/sqlite-admin-saved.db`
)

mkdirSync(resolve(savedDbPath, ".."), { recursive: true })
const savedDb = new Database(savedDbPath)
savedDb.exec(`CREATE TABLE IF NOT EXISTS saved_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sql TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`)

const readonly = new Map<string, Database>()

function resolveDbPath(raw: string | null | undefined): string {
  const value = raw?.trim() || process.env.SQLITE_DB_PATH?.trim() || ""
  if (!value) throw new Error("未指定 SQLite 文件。设置 SQLITE_DB_PATH，或在页面里填写路径")
  return isAbsolute(value) ? value : resolve(value)
}

function openReadonly(raw: string | null | undefined): { path: string; db: Database } {
  const path = resolveDbPath(raw)
  let db = readonly.get(path)
  if (!db) {
    db = new Database(path, { readonly: true, create: false })
    readonly.set(path, db)
  }
  return { path, db }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  })
}

function fail(err: unknown, status = 400): Response {
  const message = err instanceof Error ? err.message : "Request failed"
  return json({ error: message }, status)
}

function quoteIdent(name: string): string {
  return `"${name.replaceAll('"', '""')}"`
}

function listTables(db: Database) {
  const rows = db
    .query(
      `SELECT name, type FROM sqlite_master
       WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%'
       ORDER BY name`
    )
    .all() as { name: string; type: string }[]
  return rows.map(({ name, type }) => {
    const rowCount = (
      db.query(`SELECT COUNT(*) AS n FROM ${quoteIdent(name)}`).get() as { n: number }
    ).n
    return {
      name,
      rowCount,
      kind: type === "view" ? "view" : "table",
    }
  })
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname.replace(/\/$/, "") || "/"
    if (!path.startsWith("/api/sqlite-admin")) return json({ error: "not found" }, 404)
    const route = path.slice("/api/sqlite-admin".length) || "/"

    try {
      if (req.method === "GET" && route === "/status") {
        const dbParam = url.searchParams.get("db")
        if (!dbParam && !process.env.SQLITE_DB_PATH) {
          return json({ path: null, ok: false })
        }
        const opened = openReadonly(dbParam)
        return json({ path: opened.path, ok: true })
      }

      if (req.method === "GET" && route === "/tables") {
        const opened = openReadonly(url.searchParams.get("db"))
        return json({ path: opened.path, tables: listTables(opened.db) })
      }

      const schema = route.match(/^\/tables\/([^/]+)\/schema$/)
      if (req.method === "GET" && schema) {
        const opened = openReadonly(url.searchParams.get("db"))
        const requested = decodeURIComponent(schema[1]!)
        const known = opened.db
          .query(
            `SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name = ?`
          )
          .get(requested) as { name: string } | null
        if (!known) return json({ error: `Unknown table: ${requested}` }, 404)
        const quoted = quoteIdent(known.name)
        const columns = opened.db.query(`PRAGMA table_info(${quoted})`).all()
        const ddl = (
          opened.db.query(`SELECT sql FROM sqlite_master WHERE name = ?`).get(known.name) as {
            sql: string | null
          }
        ).sql
        return json({ table: known.name, columns, ddl })
      }

      if (req.method === "POST" && route === "/query") {
        const body = (await req.json()) as { sql?: string; db?: string }
        const violation = validateReadOnlySql(body.sql ?? "")
        if (violation) return json({ error: violation }, 400)
        const opened = openReadonly(body.db)
        const started = performance.now()
        const rows = opened.db.query(body.sql!.trim()).all() as Record<string, unknown>[]
        const durationMs = Math.round((performance.now() - started) * 100) / 100
        const truncated = rows.length > ROW_LIMIT
        return json({
          path: opened.path,
          columns: rows.length > 0 ? Object.keys(rows[0]!) : [],
          rows: truncated ? rows.slice(0, ROW_LIMIT) : rows,
          rowCount: rows.length,
          truncated,
          rowLimit: ROW_LIMIT,
          durationMs,
        })
      }

      if (req.method === "GET" && route === "/queries") {
        const queries = savedDb
          .query(
            `SELECT id, name, sql, created_at AS createdAt FROM saved_queries ORDER BY id DESC`
          )
          .all()
        return json({ queries })
      }

      if (req.method === "POST" && route === "/queries") {
        const body = (await req.json()) as { name?: string; sql?: string }
        if (!body.name?.trim() || !body.sql?.trim()) {
          return json({ error: "Body must be { name, sql }" }, 400)
        }
        const result = savedDb
          .query(`INSERT INTO saved_queries (name, sql) VALUES (?, ?)`)
          .run(body.name.trim(), body.sql)
        const query = savedDb
          .query(
            `SELECT id, name, sql, created_at AS createdAt FROM saved_queries WHERE id = ?`
          )
          .get(result.lastInsertRowid)
        return json({ query }, 201)
      }

      const saved = route.match(/^\/queries\/(\d+)$/)
      if (req.method === "DELETE" && saved) {
        savedDb.query(`DELETE FROM saved_queries WHERE id = ?`).run(Number(saved[1]))
        return json({ ok: true })
      }

      return json({ error: "not found" }, 404)
    } catch (err) {
      return fail(err)
    }
  },
})

console.log(`[sqlite-admin] http://127.0.0.1:${PORT}/api/sqlite-admin`)
if (process.env.SQLITE_DB_PATH) {
  console.log(`[sqlite-admin] default db ${process.env.SQLITE_DB_PATH}`)
}
