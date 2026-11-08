import { RefreshCwIcon } from "lucide-react"
import type { ReactNode } from "react"
import PageContainer from "@innate/admin-composites/page-container"
import { SceneIntro } from "@innate/scene-catalog/scene-blocks"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Skeleton,
} from "@innate/ui"
import { KpiCards } from "../../components/dashboard/kpi-cards"
import { RecentOrders } from "../../components/dashboard/recent-orders"
import { StatusDistribution } from "../../components/dashboard/status-distribution"
import { TrendChart } from "../../components/dashboard/trend-chart"
import {
  getOrderStats,
  listOrders,
  type OrderStats,
} from "../../lib/orders/service"
import type { Order } from "../../lib/orders/types"
import { useAsync } from "../../lib/use-async"

interface DashboardData {
  readonly stats: OrderStats
  readonly orders: readonly Order[]
}

/** 三态之 loading：骨架占位，结构对齐正式内容（不闪烁跳动）。 */
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-[var(--spacing-section)]">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] md:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  )
}

/** 三态之 empty：尚无订单时给明确出口，不渲染空图空表。 */
function DashboardEmpty() {
  return (
    <Card className="flex flex-col items-center gap-2 p-10 text-center">
      <CardTitle>暂无订单数据</CardTitle>
      <CardDescription>
        创建订单后，这里会展示履约状态、金额趋势与最近订单。
      </CardDescription>
    </Card>
  )
}

/**
 * 订单总览（dashboard 场景）：对照 packages/scene-specs/dashboard-scene-spec.md ——
 * Header（PageContainer）→ Hero（MetricCards 一组 KPI）→ Main（唯一主图
 * PrimaryPanel + 状态分布 SecondaryPanels）→ Detail（最近 5 笔）。
 * 只读消费 service.getOrderStats / listOrders，不碰 web-domain（路由归 P2）。
 */
export function DashboardPage() {
  const { data, loading, error, reload } = useAsync<DashboardData>(async () => {
    const [stats, orders] = await Promise.all([getOrderStats(), listOrders()])
    return { stats, orders }
  }, [])

  const recent = data
    ? [...data.orders]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5)
    : []

  // 三态：loading 骨架 → error 告警+重试 → empty 出口 → 正常总览
  let body: ReactNode
  if (loading) {
    body = <DashboardSkeleton />
  } else if (error) {
    body = (
      <Alert variant="destructive">
        <AlertTitle>总览加载失败</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCwIcon data-icon />
            重试
          </Button>
        </div>
      </Alert>
    )
  } else if (!data) {
    body = null
  } else if (data.stats.total === 0) {
    body = <DashboardEmpty />
  } else {
    body = (
      <div className="flex flex-col gap-[var(--spacing-section)]">
        <SceneIntro
          title="订单履约与审核总览"
          description="首屏判断当前状态，按周趋势定位波动，下钻最近订单明细。"
          chips={["场景：dashboard", "监控型页面", "mock-first 数据"]}
        />
        <KpiCards stats={data.stats} />
        <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-3">
          <div className="min-w-0 xl:col-span-2">
            <TrendChart points={data.stats.weeklyAmount} />
          </div>
          <StatusDistribution byStatus={data.stats.byStatus} />
        </div>
        <RecentOrders orders={recent} />
      </div>
    )
  }

  return (
    <PageContainer
      pageTitle="订单总览"
      pageDescription="监控订单履约、审核与成交趋势的总览页。"
    >
      {body}
    </PageContainer>
  )
}
