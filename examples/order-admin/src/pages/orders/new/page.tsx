import { toast } from "sonner"
import PageContainer from "@innate/admin-composites/page-container"
import { OrderForm } from "../../../components/orders/order-form"
import { createOrder } from "../../../lib/orders/service"
import type { OrderInput } from "../../../lib/orders/types"
import { useRouter } from "../../../lib/routing"

export function OrderCreatePage() {
  const router = useRouter()

  const submit = async (input: OrderInput) => {
    try {
      const order = await createOrder(input)
      toast.success(`订单 ${order.id} 已创建`)
      router.push(`/orders/${order.id}`)
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "创建失败")
    }
  }

  return (
    <PageContainer
      pageTitle="新建订单"
      pageDescription="创建后进入草稿状态，可继续确认与支付。"
    >
      <OrderForm submitLabel="创建订单" onSubmit={submit} />
    </PageContainer>
  )
}
