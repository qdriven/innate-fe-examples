import { toast } from "sonner"
import PageContainer from "@innate/admin-composites/page-container"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
} from "@innate/ui"
import { OrderForm } from "../../../../components/orders/order-form"
import { getOrder, updateOrder } from "../../../../lib/orders/service"
import type { OrderInput } from "../../../../lib/orders/types"
import { useParams, useRouter } from "../../../../lib/routing"
import { useAsync } from "../../../../lib/use-async"

export function OrderEditPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const {
    data: order,
    loading,
    error,
  } = useAsync(() => getOrder(orderId), [orderId])

  const submit = async (input: OrderInput) => {
    try {
      const updated = await updateOrder(orderId, input)
      toast.success(`订单 ${updated.id} 已更新`)
      router.push(`/orders/${orderId}`)
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "保存失败")
    }
  }

  return (
    <PageContainer pageTitle={order ? `编辑订单 ${order.id}` : "编辑订单"}>
      {loading ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : error || !order ? (
        <Alert variant="destructive">
          <AlertTitle>订单加载失败</AlertTitle>
          <AlertDescription>
            {error?.message ?? `订单 ${orderId} 不存在`}
          </AlertDescription>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/orders")}
            >
              返回列表
            </Button>
          </div>
        </Alert>
      ) : (
        <OrderForm order={order} submitLabel="保存修改" onSubmit={submit} />
      )}
    </PageContainer>
  )
}
