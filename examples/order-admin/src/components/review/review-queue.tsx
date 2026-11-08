import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innate/ui"
import {
  ORDER_CATEGORY_LABELS,
  orderTotal,
  type Order,
} from "../../lib/orders/types"

/**
 * 待审队列（审核页左主区）：订单号 / 客户 / 金额 / 种类 / 提交时间。
 * 结构对齐 scene-catalog 的 TableCard（Card + 内嵌 Table），但需要整行点选，
 * 故自建而非直接复用 TableCard（其 rows 只接受纯文本）。
 */
export function ReviewQueue({
  orders,
  selectedId,
  onSelect,
}: {
  orders: readonly Order[]
  selectedId: string | null
  onSelect: (order: Order) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>待审队列</CardTitle>
        <CardDescription>
          按提交时间升序，点击订单在右侧阅读上下文并处置。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <Empty className="h-48">
            <EmptyTitle>队列已清空</EmptyTitle>
            <EmptyDescription>当前没有等待审核的订单。</EmptyDescription>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户</TableHead>
                <TableHead className="text-right">金额</TableHead>
                <TableHead>种类</TableHead>
                <TableHead>提交时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const selected = order.id === selectedId
                return (
                  <TableRow
                    key={order.id}
                    aria-selected={selected}
                    className={selected ? "bg-muted/60" : "cursor-pointer"}
                    onClick={() => onSelect(order)}
                  >
                    <TableCell>
                      <button
                        type="button"
                        aria-label={`选择审核订单 ${order.id}`}
                        className="font-medium hover:underline"
                        onClick={(event) => {
                          // 行与按钮都可点选：按钮吃掉冒泡，避免重复触发
                          event.stopPropagation()
                          onSelect(order)
                        }}
                      >
                        {order.id}
                      </button>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-right">
                      ¥{orderTotal(order).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {ORDER_CATEGORY_LABELS[order.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.updatedAt.slice(0, 16).replace("T", " ")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
