import { useState } from "react"
import { fetchJson, formatSize, formatTime } from "../utils"

function MemoryFileCard({
  basePath,
  file,
  onRefresh,
}: {
  basePath: string
  file: any
  onRefresh: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const preview = String(file?.content || "")
    .split("\n")
    .slice(0, 2)
    .join(" · ")
    .slice(0, 180)
  const startEdit = () => {
    setDraft(String(file?.content || ""))
    setError("")
    setEditing(true)
    setExpanded(true)
  }
  const save = async () => {
    setSaving(true)
    setError("")
    try {
      const result = await fetchJson(`${basePath}/memory/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, content: draft }),
      })
      if (!result.ok) {
        setError(result.error || "保存失败")
        return
      }
      setEditing(false)
      onRefresh()
    } catch (err) {
      setError((err as Error).message || "保存失败")
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="cc-chart-card">
      <div className="flex items-center gap-2">
        <span className="text-[14px]">📄</span>
        <span className="cc-mono text-[13px] font-bold">{file.name}</span>
        <span className="text-[10.5px]" style={{ color: "#8a7965" }}>
          {formatSize(file.size)} · {formatTime(file.modified)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {!editing ? (
            <>
              <button
                className="rounded-md px-2 py-0.5 text-[11px] hover:bg-black/5"
                style={{ color: "#5c4332" }}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "收起" : "展开"}
              </button>
              <button
                className="rounded-md px-2 py-0.5 text-[11px] hover:bg-black/5"
                style={{ color: "#5c4332" }}
                onClick={startEdit}
              >
                编辑
              </button>
            </>
          ) : (
            <>
              {error && (
                <span className="text-[10.5px]" style={{ color: "#b03a20" }}>
                  {error}
                </span>
              )}
              <button
                className="rounded-md px-2 py-0.5 text-[11px] hover:bg-black/5"
                style={{ color: "#8a7965" }}
                disabled={saving}
                onClick={() => setEditing(false)}
              >
                取消
              </button>
              <button
                className="cc-btn-primary rounded-md px-2.5 py-0.5 text-[11px] font-semibold"
                disabled={saving}
                onClick={save}
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          className="cc-mono mt-2 w-full rounded-md p-3 text-[11.5px] outline-none"
          style={{
            minHeight: 320,
            resize: "vertical",
            border: "1px solid rgba(140,100,60,0.18)",
            background: "#faf7f0",
            color: "#2a1f13",
          }}
          value={draft}
          disabled={saving}
          onChange={(event) => setDraft(event.target.value)}
        />
      ) : expanded ? (
        <pre
          className="cc-mono mt-2 max-h-[400px] overflow-auto whitespace-pre-wrap rounded-md p-3 text-[11.5px]"
          style={{ background: "#faf7f0", color: "#2a1f13" }}
        >
          {file.content}
          {file.truncated ? "\n\n...（已截断）" : ""}
        </pre>
      ) : (
        <div
          className="mt-2 max-h-10 overflow-hidden text-[11.5px]"
          style={{ color: "#6b5a46" }}
        >
          {preview || "（空）"}
        </div>
      )}
    </div>
  )
}

export function MemoryTab({
  basePath,
  title,
  subtitle,
  data,
  loading,
  onRefresh,
}: {
  basePath: string
  title: string
  subtitle?: string
  data: any
  loading?: boolean
  onRefresh: () => void
}) {
  const [creating, setCreating] = useState(false)
  const fileName = basePath.includes("codex") ? "AGENTS.md" : "CLAUDE.md"
  const createFile = async () => {
    setCreating(true)
    try {
      const seed = `# ${fileName}\n\n在这里写 ${title} 的全局约束和个人偏好。它会在每次启动时加载。\n`
      const result = await fetchJson(`${basePath}/memory/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName, content: seed }),
      })
      if (!result.ok) window.alert(result.error || "新建失败")
      onRefresh()
    } finally {
      setCreating(false)
    }
  }
  const files = data?.files || []
  return (
    <div className="h-full space-y-4 overflow-y-auto px-6 py-5 cc-thin-scroll">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[17px] font-bold">{fileName}</div>
          <div className="text-[11.5px]" style={{ color: "#6b5a46" }}>
            {subtitle} · <span className="cc-mono">{data?.dir || ""}</span>
          </div>
        </div>
        <button
          className="rounded-md border bg-white px-2.5 py-1 text-[11px] hover:bg-[#fdf7e8]"
          style={{ borderColor: "rgba(140,100,60,0.18)", color: "#4a3826" }}
          onClick={onRefresh}
        >
          刷新
        </button>
      </div>
      {loading || !data ? (
        <div className="text-[12px]" style={{ color: "#8a7965" }}>
          加载中...
        </div>
      ) : !files.length ? (
        <div
          className="rounded-xl py-12 text-center"
          style={{
            border: "1px dashed rgba(140,100,60,0.25)",
            background: "rgba(255,255,255,0.4)",
          }}
        >
          <div className="mb-1 text-[14px] font-bold">{fileName} 尚未创建</div>
          <div
            className="mx-auto max-w-md text-[11.5px]"
            style={{ color: "#6b5a46" }}
          >
            {title} 会在每次启动时读取它。可写入个人偏好、项目约定或硬性规则。
          </div>
          <button
            className="cc-btn-primary mt-4 rounded-lg px-4 py-2 text-[12.5px] font-semibold disabled:opacity-50"
            disabled={creating}
            onClick={createFile}
          >
            {creating ? "正在新建..." : `新建 ${fileName}`}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file: any) => (
            <MemoryFileCard
              key={file.path || file.name}
              basePath={basePath}
              file={file}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}
