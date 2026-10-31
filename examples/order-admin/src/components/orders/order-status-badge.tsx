import { Badge } from "@innate/ui"
import { ORDER_STATUS_LABELS, type OrderStatus } from "../../lib/orders/types"

const STATUS_VARIANTS: Readonly<
  Record<OrderStatus, "default" | "secondary" | "outline" | "destructive">
> = {
  draft: "secondary",
  confirmed: "default",
  paid: "default",
  shipped: "outline",
  completed: "outline",
  cancelled: "destructive",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  )
}
