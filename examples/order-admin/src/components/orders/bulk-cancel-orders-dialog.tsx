import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@innate/ui"
import type { Order } from "../../lib/orders/types"

const PREVIEW_LIMIT = 5

/**
 * 批量取消二次确认：列出将被取消的订单（超过 5 笔只预览前 5 笔）。
 */
export function BulkCancelOrdersDialog({
  orders,
  busy = false,
  onClose,
  onConfirm,
}: {
  orders: readonly Order[] | null
  busy?: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  const count = orders?.length ?? 0
  const preview = (orders ?? []).slice(0, PREVIEW_LIMIT)
  return (
    <AlertDialog
      open={orders !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>批量取消 {count} 笔订单？</AlertDialogTitle>
          <AlertDialogDescription>
            取消后不可恢复，这些订单将进入「已取消」终态。
            {preview.length > 0 ? (
              <span className="mt-1 block">
                {preview.map((order) => order.id).join("、")}
                {count > preview.length ? ` 等 ${count} 笔` : ""}
              </span>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>再想想</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={busy}>
            确认批量取消
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
