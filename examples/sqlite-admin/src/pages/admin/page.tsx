import { useCallback, useEffect, useState } from "react"
import { Button, Input, Textarea } from "@innate/ui"
import { Database, Play } from "lucide-react"
import { toast } from "sonner"
import {
  createSavedQuery,
  deleteSavedQuery,
  fetchSavedQueries,
  fetchSchema,
  fetchTables,
  runQuery,
  type SavedQuery,
  type SqliteColumn,
  type SqliteQueryResult,
  type SqliteTable,
} from "../../services/admin-db"

const DB_STORAGE_KEY = "sqlite-admin.db-path"

function preview(value: unknown): string {
  if (value === null || value === undefined) return "NULL"
  const text = typeof value === "object" ? JSON.stringify(value) : String(value)
  return text.length > 160 ? `${text.slice(0, 160)}…` : text
}

export function SqliteAdminPage() {
  const [dbPath, setDbPath] = useState("")
  const [draftPath, setDraftPath] = useState("")
  const [tables, setTables] = useState<SqliteTable[]>([])
  const [columns, setColumns] = useState<SqliteColumn[]>([])
  const [sqlText, setSqlText] = useState("SELECT name FROM sqlite_master WHERE type = 'table'")
  const [result, setResult] = useState<SqliteQueryResult | null>(null)
  const [running, setRunning] = useState(false)
  const [saved, setSaved] = useState<SavedQuery[]>([])
  const [saveName, setSaveName] = useState("")

  const loadTables = useCallback(async (path: string) => {
    const { tables: list } = await fetchTables(path)
    setTables(list)
    setDbPath(path)
    localStorage.setItem(DB_STORAGE_KEY, path)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(DB_STORAGE_KEY) ?? ""
    setDraftPath(stored)
    if (!stored) return
    loadTables(stored).catch((err: unknown) => {
      toast.error(err instanceof Error ? err.message : "无法打开数据库")
    })
    fetchSavedQueries()
      .then(({ queries }) => setSaved(queries))
      .catch(() => setSaved([]))
  }, [loadTables])

  const connect = async () => {
    try {
      await loadTables(draftPath.trim())
      toast.success("已连接")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "无法打开数据库")
    }
  }

  const execute = async (text?: string) => {
    const query = (text ?? sqlText).trim()
    if (!dbPath) {
      toast.error("先填写 SQLite 文件路径")
      return
    }
    setRunning(true)
    try {
      setResult(await runQuery(dbPath, query))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "查询失败")
    } finally {
      setRunning(false)
    }
  }

  const pickTable = async (name: string) => {
    const previewSql = `SELECT * FROM "${name.replaceAll('"', '""')}" LIMIT 100`
    setSqlText(previewSql)
    try {
      const schema = await fetchSchema(dbPath, name)
      setColumns(schema.columns)
    } catch {
      setColumns([])
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-64 flex-1">
          <label className="text-muted-foreground mb-1 flex items-center gap-1 text-xs">
            <Database className="size-3.5" />
            SQLite 文件
          </label>
          <Input
            value={draftPath}
            placeholder="/absolute/path/to/app.db"
            onChange={(event) => setDraftPath(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void connect()
            }}
          />
        </div>
        <Button type="button" variant="outline" onClick={() => void connect()}>
          连接
        </Button>
        <span className="text-muted-foreground pb-1 text-xs">
          {dbPath ? `当前 ${dbPath}` : "未连接。先启动 bun server/index.ts"}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 gap-3">
        <aside className="flex w-56 shrink-0 flex-col overflow-hidden rounded-md border">
          <div className="text-muted-foreground border-b px-2 py-1.5 text-xs">
            表（{tables.length}）
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-1">
            {tables.map((table) => (
              <button
                key={table.name}
                type="button"
                className="hover:bg-accent flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs"
                onClick={() => void pickTable(table.name)}
                onDoubleClick={() => {
                  const previewSql = `SELECT * FROM "${table.name.replaceAll('"', '""')}" LIMIT 100`
                  setSqlText(previewSql)
                  void execute(previewSql)
                }}
              >
                <span className="truncate font-mono">{table.name}</span>
                <span className="text-muted-foreground tabular-nums">{table.rowCount}</span>
              </button>
            ))}
          </div>
          {columns.length > 0 && (
            <div className="max-h-40 overflow-auto border-t p-2 text-[11px]">
              {columns.map((col) => (
                <div key={col.name} className="flex justify-between gap-2">
                  <span className="truncate font-mono">{col.name}</span>
                  <span className="text-muted-foreground">
                    {col.type}
                    {col.pk ? " pk" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              value={saveName}
              placeholder="保存名称"
              className="max-w-48"
              onChange={(event) => setSaveName(event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void createSavedQuery(saveName.trim() || "query", sqlText)
                  .then(async () => {
                    setSaveName("")
                    const { queries } = await fetchSavedQueries()
                    setSaved(queries)
                  })
                  .catch((err: unknown) => {
                    toast.error(err instanceof Error ? err.message : "保存失败")
                  })
              }}
            >
              保存 SQL
            </Button>
            <Button type="button" disabled={running} onClick={() => void execute()}>
              <Play className="size-3" />
              {running ? "执行中" : "运行"}
            </Button>
          </div>
          <Textarea
            value={sqlText}
            className="min-h-36 font-mono text-xs"
            onChange={(event) => setSqlText(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault()
                void execute()
              }
            }}
          />
          <div className="min-h-0 flex-1 overflow-auto rounded-md border">
            <div className="text-muted-foreground border-b px-2 py-1 text-xs">
              {result
                ? `${result.rowCount} 行 · ${result.durationMs.toFixed(1)} ms${result.truncated ? " · 已截断" : ""}`
                : "结果"}
            </div>
            {result && result.rows.length > 0 ? (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr>
                    {result.columns.map((column) => (
                      <th key={column} className="border-b px-2 py-1 font-medium whitespace-nowrap">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={index}>
                      {result.columns.map((column) => (
                        <td key={column} className="border-b px-2 py-1 whitespace-nowrap">
                          {preview(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted-foreground p-3 text-xs">执行一条 SELECT，或双击左侧表名。</p>
            )}
          </div>
          {saved.length > 0 && (
            <div className="flex max-h-24 flex-wrap gap-1 overflow-auto">
              {saved.map((item) => (
                <span key={item.id} className="inline-flex items-center gap-1">
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={() => setSqlText(item.sql)}
                  >
                    {item.name}
                  </Button>
                  <button
                    type="button"
                    className="text-muted-foreground text-xs"
                    onClick={() => {
                      void deleteSavedQuery(item.id).then(() =>
                        setSaved((list) => list.filter((row) => row.id !== item.id))
                      )
                    }}
                  >
                    删除
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
