import { EmptyText, GenericShell, JsonDetails, StatCard } from "../components"
import { formatTime } from "../utils"

export function StatsTab({ data, loading }: { data: any; loading?: boolean }) {
  const daily = (data?.dailyActivity || []).slice(-14)
  const maxMessages = Math.max(
    1,
    ...daily.map((item: any) => Number(item.messageCount || 0))
  )
  return (
    <GenericShell title="统计" subtitle="使用缓存与本地活动">
      {loading || !data ? (
        <EmptyText text="加载中..." />
      ) : !data.available ? (
        <EmptyText text="尚未生成统计缓存" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard label="会话总数" value={data.totalSessions} />
            <StatCard
              label="消息"
              value={Number(data.totalMessages || 0).toLocaleString()}
            />
            <StatCard
              label="最长会话"
              value={`${Math.round((data.longestSession?.duration || 0) / 3600000)} 小时`}
            />
            <StatCard
              label="首次会话"
              value={formatTime(data.firstSessionDate)}
            />
          </div>
          {!!daily.length && (
            <div className="cc-chart-card">
              <div className="cc-chart-title">每日活动</div>
              <div className="cc-chart-sub mb-3">
                消息 · 最近 {daily.length} 天
              </div>
              <div className="flex h-40 items-end gap-2">
                {daily.map((item: any) => (
                  <div
                    key={item.date}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div
                      className="w-full rounded-t"
                      title={`${item.date} · ${item.messageCount}`}
                      style={{
                        height: `${(Number(item.messageCount || 0) / maxMessages) * 100}%`,
                        background: "linear-gradient(180deg,#7a5430,#5c4332)",
                      }}
                    />
                    <div
                      className="cc-mono text-[9px]"
                      style={{ color: "#8a7965" }}
                    >
                      {String(item.date || "").slice(5)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <JsonDetails data={data} />
        </>
      )}
    </GenericShell>
  )
}
