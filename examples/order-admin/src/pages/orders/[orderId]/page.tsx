import { useState } from "react"
import type { ReactNode } from "react"
import {
  ArrowLeftIcon,
  PencilIcon,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react"
import { toast } from "sonner"
import PageContainer from "@innate/admin-composites/page-container"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innate/ui"
import { CancelOrderDialog } from "../../../components/orders/cancel-order-dialog"
import { OrderStatusBadge } from "../../../components/orders/order-status-badge"
import { getOrder, transitionOrderStatus } from "../../../lib/orders/service"
import {
  ORDER_ACTION_LABELS,
  ORDER_TRANSITIONS,
  orderTotal,
  type OrderStatus,
} from "../../../lib/orders/types"
import { useParams, useRouter } from "../../../lib/routing"
import { useAsync } from "../../../lib/use-async"

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

function InfoField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs">{label}</p>
      {children}
    </div>
  )
}

export function OrderDetailPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const {
    data: order,
    loading,
    error,
    reload,
  } = useAsync(() => getOrder(orderId), [orderId])
  const [busy, setBusy] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  const transition = async (next: OrderStatus) => {
    if (!order) return
    setBusy(true)
    try {
      await transitionOrderStatus(order.id, next)
      toast.success(`订单 ${order.id}：${ORDER_ACTION_LABELS[next]}`)
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "操作失败")
    } finally {
      setBusy(false)
    }
  }

  const nextStatuses = order ? ORDER_TRANSITIONS[order.status] : []
  const forwardActions = nextStatuses.filter((status) => status !== "cancelled")
  const cancellable = nextStatuses.includes("cancelled")

  return (
    <PageContainer
      pageTitle={order ? `订单 ${order.id}` : "订单详情"}
      pageDescription={order?.customer}
      pageHeaderAction={
        order ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/orders/${order.id}/edit`)}
            >
              <PencilIcon data-icon />
              编辑
            </Button>
            <Button variant="ghost" onClick={() => router.push("/orders")}>
              <ArrowLeftIcon data-icon />
              返回列表
            </Button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <DetailSkeleton />
      ) : error || !order ? (
        <Alert variant="destructive">
          <AlertTitle>订单加载失败</AlertTitle>
          <AlertDescription>
            {error?.message ?? `订单 ${orderId} 不存在`}
          </AlertDescription>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={reload}>
              <RefreshCwIcon data-icon />
              重试
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/orders")}
            >
              返回列表
            </Button>
          </div>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoField label="状态">
                <OrderStatusBadge status={order.status} />
              </InfoField>
              <InfoField label="客户">
                <p className="text-sm font-medium">{order.customer}</p>
              </InfoField>
              <InfoField label="创建时间">
                <p className="text-sm">{order.createdAt.slice(0, 10)}</p>
              </InfoField>
              <InfoField label="更新时间">
                <p className="text-sm">{order.updatedAt.slice(0, 10)}</p>
              </InfoField>
              <div className="space-y-1 sm:col-span-2 lg:col-span-4">
                <p className="text-muted-foreground text-xs">备注</p>
                <p className="text-sm">{order.note || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            {forwardActions.map((status) => (
              <Button
                key={status}
                disabled={busy}
                onClick={() => void transition(status)}
              >
                {ORDER_ACTION_LABELS[status]}
              </Button>
            ))}
            {cancellable ? (
              <Button
                variant="destructive"
                disabled={busy}
                onClick={() => setConfirmingCancel(true)}
              >
                <XCircleIcon data-icon />
                取消订单
              </Button>
            ) : null}
          </div>

          <Card size="sm">
            <CardHeader>
              <CardTitle>订单明细</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>品名</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead className="text-right">单价</TableHead>
                    <TableHead className="text-right">小计</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>{line.sku}</TableCell>
                      <TableCell>{line.name}</TableCell>
                      <TableCell className="text-right">
                        {line.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{line.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ¥{(line.quantity * line.unitPrice).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-3" />
              <p className="flex justify-end gap-4 text-sm">
                <span className="text-muted-foreground">合计</span>
                <span className="font-medium">
                  ¥{orderTotal(order).toFixed(2)}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      <CancelOrderDialog
        order={confirmingCancel && order ? order : null}
        busy={busy}
        onClose={() => setConfirmingCancel(false)}
        onConfirm={() => {
          setConfirmingCancel(false)
          void transition("cancelled")
        }}
      />
    </PageContainer>
  )
}
