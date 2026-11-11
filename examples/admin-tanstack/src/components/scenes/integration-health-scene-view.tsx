import { toast } from "sonner"
import { Badge, Button, Card, CardContent } from "@innate/ui"
import {
  MetricCards,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"
import { fetchIntegrationHealthData } from "../../lib/api"
import { useAsync } from "../../lib/use-async"
import { SceneViewSkeleton } from "./scene-view-skeleton"

/** 连接器状态色：语义 token（success / warning / destructive），暗色自适应。 */
function statusBadge(status: string) {
  const tone =
    status === "健康"
      ? "border-success/30 bg-success/10 text-success-foreground"
      : status === "延迟"
        ? "border-warning/30 bg-warning/10 text-warning-foreground"
        : "border-destructive/30 bg-destructive/10 text-destructive"
  return (
    <Badge variant="outline" className={tone}>
      {status}
    </Badge>
  )
}

export function IntegrationHealthSceneView() {
  const { data, loading, error, reload } = useAsync(
    fetchIntegrationHealthData,
    []
  )

  if (loading) {
    return <SceneViewSkeleton />
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm font-medium text-destructive">
            场景数据加载失败
          </p>
          <p className="text-muted-foreground text-xs">
            {error?.message ?? "未知错误"}
          </p>
          <Button variant="outline" size="sm" onClick={reload}>
            重试
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { metrics, connectorsTable } = data

  return (
    <>
      <SceneIntro
        title="Integration Health 集成样板"
        description="适合接入健康监控、同步告警、失败重试和接口运营看板。"
        chips={["Integration", "Sync", "Alert", "Freshness"]}
      />
      <MetricCards items={metrics} />
      <TableCard
        title={connectorsTable.title}
        description={connectorsTable.description}
        headers={connectorsTable.headers}
        rows={[]}
      >
        <div className="flex flex-col">
          {connectorsTable.rows.map((row) => {
            const [connector, source, lastSync, status, action] = row
            return (
              <div
                key={connector}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 transition-colors duration-fast hover:bg-muted/50"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">
                    {connector}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {source}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-muted-foreground hidden text-xs tabular-nums sm:inline">
                    {lastSync}
                  </span>
                  {statusBadge(status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.success(`${action}：${connector}`, {
                        description: "演示环境：操作已记录（mock）",
                      })
                    }
                  >
                    {action}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </TableCard>
    </>
  )
}
