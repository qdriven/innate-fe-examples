import { TableCard } from "@innate/scene-catalog/scene-blocks"
import type { OrderStatusCount } from "../../lib/orders/service"
import { ORDER_STATUS_LABELS } from "../../lib/orders/types"

/** SecondaryPanels：履约状态分布（只读计数，合计 = 订单总数）。 */
export function StatusDistribution({
  byStatus,
}: {
  byStatus: readonly OrderStatusCount[]
}) {
  return (
    <TableCard
      title="履约状态分布"
      description="各状态订单数，合计等于订单总数"
      headers={["状态", "订单数"]}
      rows={byStatus.map(({ status, count }) => [
        ORDER_STATUS_LABELS[status],
        String(count),
      ])}
    />
  )
}
