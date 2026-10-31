import {
  EmptyText,
  GenericShell,
  InfoBox,
  JsonDetails,
  StatCard,
} from "../components"

export function AccountTab({
  basePath,
  data,
  loading,
  title,
}: {
  basePath: string
  data: any
  loading?: boolean
  title: string
}) {
  const isCodex = basePath.includes("codex")
  if (isCodex) {
    return (
      <GenericShell title="账户" subtitle="来自 codex 登录状态">
        {loading || !data ? (
          <EmptyText text="加载中..." />
        ) : !data.available ? (
          <EmptyText text={data.error || "不可用"} bad />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              <StatCard
                label="登录状态"
                value={data.loggedIn ? "已登录" : "未登录"}
                tone={data.loggedIn ? "good" : "bad"}
              />
              <StatCard label="认证方式" value={data.authMethod} />
              <StatCard
                label="命令"
                value={data.command || "codex login status"}
              />
            </div>
            <div className="cc-chart-card">
              <div className="cc-chart-title mb-3">详情</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoBox label="摘要" value={data.raw} />
                <InfoBox
                  label="提示"
                  value={
                    data.authMethod
                      ? "CLI 已完成认证，可以开始会话。"
                      : "CLI 尚未完成认证，请先在终端完成登录。"
                  }
                />
              </div>
            </div>
            <div className="cc-chart-card">
              <div className="cc-chart-title mb-2">原始响应</div>
              <pre
                className="cc-mono overflow-x-auto whitespace-pre-wrap rounded-md p-3 text-[11.5px]"
                style={{ background: "#1f1a12", color: "#e8d8a8" }}
              >
                {data.raw}
              </pre>
            </div>
          </>
        )}
      </GenericShell>
    )
  }
  return (
    <GenericShell title="账户" subtitle={`来自 ${title} 认证状态`}>
      {loading || !data ? (
        <EmptyText text="加载中..." />
      ) : !data.available ? (
        <EmptyText text={data.error || "不可用"} bad />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              label="登录状态"
              value={data.loggedIn ? "已登录" : "未登录"}
              tone={data.loggedIn ? "good" : "bad"}
            />
            <StatCard label="认证方式" value={data.authMethod} />
            <StatCard label="供应方" value={data.apiProvider} />
            <StatCard label="订阅" value={data.subscriptionType} />
          </div>
          <div className="cc-chart-card">
            <div className="cc-chart-title mb-3">账户详情</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {["email", "orgName", "orgId"].map((key) => (
                <InfoBox key={key} label={key} value={data[key]} />
              ))}
            </div>
          </div>
          <JsonDetails data={data} />
        </>
      )}
    </GenericShell>
  )
}
