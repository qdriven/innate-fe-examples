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

export function CancelOrderDialog({
  order,
  busy = false,
  onClose,
  onConfirm,
}: {
  order: Order | null
  busy?: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={order !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>取消订单 {order?.id}？</AlertDialogTitle>
          <AlertDialogDescription>
            取消后不可恢复，订单将进入「已取消」终态。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>再想想</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={busy}>
            确认取消
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
