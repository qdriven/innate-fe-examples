import { useState } from "react"
import { EmptyText, GenericShell } from "../components"
import { fetchJson, formatTime } from "../utils"

function PlanCard({ basePath, plan }: { basePath: string; plan: any }) {
  const [expanded, setExpanded] = useState(false)
  const [full, setFull] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const toggle = async () => {
    if (expanded) {
      setExpanded(false)
      return
    }
    if (full) {
      setExpanded(true)
      return
    }
    setLoading(true)
    setError("")
    try {
      const result = await fetchJson(
        `${basePath}/plans/file?slug=${encodeURIComponent(plan.slug)}`
      )
      if (!result.ok) {
        setError(result.error || "加载失败")
        setExpanded(true)
        return
      }
      setFull(result.content || "")
      setExpanded(true)
    } catch (err) {
      setError((err as Error).message || "加载失败")
      setExpanded(true)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="cc-chart-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] font-bold">{plan.title}</div>
          <div
            className="cc-mono mt-1 text-[10.5px]"
            style={{ color: "#8a7965" }}
          >
            {plan.slug}.md · {formatTime(plan.modified)} ·{" "}
            {Math.round(Number(plan.sizeBytes || 0) / 1024)}KB
          </div>
        </div>
        <button
          className="shrink-0 rounded-md border bg-white px-2.5 py-1 text-[11px] hover:bg-[#fdf7e8]"
          style={{ borderColor: "rgba(140,100,60,0.18)", color: "#4a3826" }}
          disabled={loading}
          onClick={toggle}
        >
          {loading ? "加载中..." : expanded ? "收起" : "展开"}
        </button>
      </div>
      {expanded && (
        <div className="mt-3">
          {error && (
            <div className="mb-2 text-[11.5px]" style={{ color: "#b03a20" }}>
              {error}
            </div>
          )}
          {full && (
            <pre
              className="cc-mono max-h-[500px] overflow-auto whitespace-pre-wrap rounded-md p-3 text-[11.5px]"
              style={{ background: "#faf7f0", color: "#2a1f13" }}
            >
              {full}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

export function PlansTab({
  basePath,
  data,
  loading,
}: {
  basePath: string
  data: any
  loading?: boolean
}) {
  const items = data?.items || []
  return (
    <GenericShell title="计划" subtitle="来自 ~/.claude/plans/">
      {loading || !data ? (
        <EmptyText text="加载中..." />
      ) : !items.length ? (
        <EmptyText text="暂无计划" />
      ) : (
        <div className="space-y-3">
          {items.map((plan: any) => (
            <PlanCard key={plan.slug} basePath={basePath} plan={plan} />
          ))}
        </div>
      )}
    </GenericShell>
  )
}
