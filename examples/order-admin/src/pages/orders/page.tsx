import { useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"
import PageContainer from "@innate/admin-composites/page-container"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
} from "@innate/ui"
import { CancelOrderDialog } from "../../components/orders/cancel-order-dialog"
import { BulkCancelOrdersDialog } from "../../components/orders/bulk-cancel-orders-dialog"
import { OrderPeekSheet } from "../../components/orders/order-peek-sheet"
import { OrdersTable } from "../../components/orders/orders-table"
import {
  bulkCancelOrders,
  listOrders,
  transitionOrderStatus,
} from "../../lib/orders/service"
import type { Order } from "../../lib/orders/types"
import { useAsync } from "../../lib/use-async"

function OrdersTableSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-full max-w-72" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-5 w-40" />
    </div>
  )
}

export function OrdersPage() {
  const { data, loading, error, reload } = useAsync(() => listOrders(), [])
  const [cancelling, setCancelling] = useState<Order | null>(null)
  const [bulkTargets, setBulkTargets] = useState<readonly Order[] | null>(null)
  // 抽屉查看：持有目标订单与 Sheet 开关（同 CancelOrderDialog 的持有模式）
  const [peeking, setPeeking] = useState<Order | null>(null)
  const [peekOpen, setPeekOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const handlePeek = (order: Order) => {
    setPeeking(order)
    setPeekOpen(true)
  }

  const handleCancel = async () => {
    if (!cancelling) return
    setBusy(true)
    try {
      await transitionOrderStatus(cancelling.id, "cancelled")
      toast.success(`订单 ${cancelling.id} 已取消`)
      setCancelling(null)
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "取消失败")
    } finally {
      setBusy(false)
    }
  }

  const handleBulkCancel = async () => {
    if (!bulkTargets) return
    setBusy(true)
    try {
      const result = await bulkCancelOrders(
        bulkTargets.map((order) => order.id)
      )
      if (result.skipped.length > 0) {
        toast.warning(
          `已取消 ${result.cancelled.length} 笔，${result.skipped.length} 笔被跳过：${result.skipped
            .map((skip) => `${skip.id}（${skip.reason}）`)
            .join("、")}`
        )
      } else {
        toast.success(`已取消 ${result.cancelled.length} 笔订单`)
      }
      setBulkTargets(null)
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "批量取消失败")
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageContainer
      pageTitle="订单管理"
      pageDescription="黄金样例：列表、筛选、状态流转。"
    >
      {loading ? (
        <OrdersTableSkeleton />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>订单加载失败</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={reload}>
              <RefreshCwIcon data-icon />
              重试
            </Button>
          </div>
        </Alert>
      ) : (
        <OrdersTable
          orders={data ?? []}
          onCancel={setCancelling}
          onBulkCancel={setBulkTargets}
          onPeek={handlePeek}
        />
      )}
      <OrderPeekSheet
        order={peeking}
        open={peekOpen}
        onOpenChange={(open) => {
          setPeekOpen(open)
          // 关闭后清空订单，避免退出动画期间内容闪走
          if (!open) setPeeking(null)
        }}
      />
      <CancelOrderDialog
        order={cancelling}
        busy={busy}
        onClose={() => setCancelling(null)}
        onConfirm={() => void handleCancel()}
      />
      <BulkCancelOrdersDialog
        orders={bulkTargets}
        busy={busy}
        onClose={() => setBulkTargets(null)}
        onConfirm={() => void handleBulkCancel()}
      />
    </PageContainer>
  )
}
