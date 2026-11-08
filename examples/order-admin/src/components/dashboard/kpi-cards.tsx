import { MetricCards } from "@innate/scene-catalog/scene-blocks"
import type { OrderStats } from "../../lib/orders/service"
import { formatCNY, formatPercent } from "./format"

/**
 * dashboard Hero：四个 KPI 收敛为一组（场景规范——
 * 多个 KPI 卡片勿各自争抢首屏，唯一主图见 TrendChart）。
 */
export function KpiCards({ stats }: { stats: OrderStats }) {
  return (
    <MetricCards
      items={[
        {
          label: "订单总数",
          value: String(stats.total),
          hint: "全部订单（含已取消）",
        },
        {
          label: "待审核",
          value: String(stats.pendingReview),
          hint: "审核队列中等待决策",
        },
        {
          label: "成交额",
          value: formatCNY(stats.revenue),
          hint: "已支付 / 已发货 / 已完成合计",
        },
        {
          label: "取消率",
          value: formatPercent(stats.cancelRate),
          hint: "已取消订单占全部订单比例",
        },
      ]}
    />
  )
}
