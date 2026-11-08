import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innate/ui"
import { OrderStatusBadge } from "../orders/order-status-badge"
import { AppLink } from "../../lib/routing"
import {
  ORDER_CATEGORY_LABELS,
  orderTotal,
  type Order,
} from "../../lib/orders/types"
import { formatCNY } from "./format"

/**
 * DashboardDetail：最近 5 笔订单（按下单时间倒序，由页面切好）。
 * 订单号是进详情页的行内链接；TableCard 只收纯文本行，故这里自建表格。
 */
export function RecentOrders({ orders }: { orders: readonly Order[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近订单</CardTitle>
        <CardDescription>
          按下单时间倒序的最近几笔，点击订单号查看详情
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单号</TableHead>
              <TableHead>客户</TableHead>
              <TableHead>种类</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">金额</TableHead>
              <TableHead>下单时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <AppLink
                    href={`/order-admin/orders/${order.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {order.id}
                  </AppLink>
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{ORDER_CATEGORY_LABELS[order.category]}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCNY(orderTotal(order))}
                </TableCell>
                <TableCell>{order.createdAt.slice(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
