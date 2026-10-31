import { EmptyText, GenericShell } from "../components"

export function SkillsTab({
  basePath,
  data,
  loading,
}: {
  basePath: string
  data: any
  loading?: boolean
}) {
  const isCodex = basePath.includes("codex")
  const left = data?.user || []
  const right = isCodex ? data?.system || [] : data?.plugins || []
  return (
    <GenericShell
      title="技能"
      subtitle={
        isCodex
          ? "扫描自 ~/.codex/skills"
          : "扫描自 ~/.claude/skills 与 plugins/*/skills"
      }
    >
      {loading || !data ? (
        <EmptyText text="加载中..." />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SkillColumn
            title={`用户 (${left.length})`}
            items={left}
            icon="✨"
            prefix={isCodex ? "" : "/"}
          />
          <SkillColumn
            title={`${isCodex ? "系统" : "插件"} (${right.length})`}
            items={right}
            icon={isCodex ? "⚙️" : "🧩"}
            prefix={isCodex ? "" : "/"}
          />
        </div>
      )}
    </GenericShell>
  )
}

function SkillColumn({
  title,
  items,
  icon,
  prefix,
}: {
  title: string
  items: any[]
  icon: string
  prefix: string
}) {
  return (
    <div>
      <div
        className="mb-2 text-[11px] font-bold uppercase tracking-wider"
        style={{ color: "#8a7965" }}
      >
        {title}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.filePath || item.path || item.name}
            className="cc-card"
          >
            <div className="flex items-start gap-3">
              <div className="cc-icon">{icon}</div>
              <div className="min-w-0 flex-1">
                <div className="cc-mono text-[12.5px] font-bold">
                  {item.name ? `${prefix}${item.name}` : "（未命名）"}
                </div>
                <div
                  className="mt-0.5 text-[11px]"
                  style={{ color: "#6b5a46" }}
                >
                  {item.description || "（无描述）"}
                </div>
                {item.source && (
                  <div
                    className="cc-mono mt-0.5 text-[10px]"
                    style={{ color: "#8a7965" }}
                  >
                    {item.source}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="text-[11.5px]" style={{ color: "#8a7965" }}>
            （无）
          </div>
        )}
      </div>
    </div>
  )
}
