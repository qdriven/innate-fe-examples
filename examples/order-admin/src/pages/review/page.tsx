import { useCallback, useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"
import PageContainer from "@innate/admin-composites/page-container"
import { SceneIntro } from "@innate/scene-catalog/scene-blocks"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Skeleton,
} from "@innate/ui"
import { ReviewDecisionPanel } from "../../components/review/review-decision-panel"
import { ReviewQueue } from "../../components/review/review-queue"
import {
  decideReview,
  listReviewQueue,
  updateOrder,
} from "../../lib/orders/service"
import type { Order } from "../../lib/orders/types"
import { useAsync } from "../../lib/use-async"

function ReviewSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  )
}

const EMPTY_QUEUE: readonly Order[] = []

/**
 * 审核中心（/order-admin/review）：
 * SceneIntro → 左待审队列 → 右上下文 + 决策栏。
 * 所有决策走 service.decideReview 落库（禁止纯 toast 批准）。
 */
export function ReviewPage() {
  const { data, loading, error, reload } = useAsync(() => listReviewQueue(), [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [comment, setComment] = useState("")
  const [busy, setBusy] = useState(false)

  const queue = data ?? EMPTY_QUEUE

  // 选中项在渲染期派生：选中订单仍在队列则用它，否则顺延到首条（出队后自动落下一条），
  // 队列为空则为 null——不引入 effect，避免级联渲染。
  const selected: Order | null =
    queue.find((order) => order.id === selectedId) ?? queue[0] ?? null
  const activeId: string | null = selected ? selected.id : null

  const resetDrafts = useCallback(() => {
    setReason("")
    setComment("")
  }, [])

  const handleApprove = async () => {
    if (!selected) return
    setBusy(true)
    try {
      await decideReview(selected.id, "approved")
      toast.success(`订单 ${selected.id} 已批准`)
      resetDrafts()
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "批准失败")
    } finally {
      setBusy(false)
    }
  }

  const handleReject = async () => {
    if (!selected) return
    if (!reason.trim()) {
      toast.error("退回必须填写原因")
      return
    }
    setBusy(true)
    try {
      await decideReview(selected.id, "rejected", reason.trim())
      toast.success(`订单 ${selected.id} 已退回`)
      resetDrafts()
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "退回失败")
    } finally {
      setBusy(false)
    }
  }

  const handleComment = async () => {
    if (!selected) return
    if (!comment.trim()) {
      toast.error("备注内容不能为空")
      return
    }
    setBusy(true)
    try {
      // 备注追加到订单说明（仍在队列中，不改变审核状态）
      await updateOrder(selected.id, {
        customer: selected.customer,
        category: selected.category,
        categoryMeta: selected.categoryMeta,
        note: selected.note
          ? `${selected.note}\n${comment.trim()}`
          : comment.trim(),
        lines: selected.lines.map((line) => ({
          sku: line.sku,
          name: line.name,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        })),
      })
      toast.success(`订单 ${selected.id} 已追加备注`)
      resetDrafts()
      reload()
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "备注失败")
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageContainer
      pageTitle="订单审核"
      pageDescription="阅读待审订单的上下文，做出批准 / 退回决策。"
    >
      <div className="flex flex-col gap-[var(--spacing-section)]">
        <SceneIntro
          title="审核流程"
          description="待审队列 → 上下文阅读 → 决策（退回需填原因，批准为终态）。"
          chips={["待审队列", "上下文", "退回", "备注", "批准"]}
        />
        {loading ? (
          <ReviewSkeleton />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>待审队列加载失败</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={reload}>
                <RefreshCwIcon data-icon />
                重试
              </Button>
            </div>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.1fr_0.9fr]">
            <ReviewQueue
              orders={queue}
              selectedId={activeId}
              onSelect={(order) => {
                setSelectedId(order.id)
                resetDrafts()
              }}
            />
            <ReviewDecisionPanel
              order={selected}
              busy={busy}
              reason={reason}
              onReasonChange={setReason}
              comment={comment}
              onCommentChange={setComment}
              onReject={() => void handleReject()}
              onComment={() => void handleComment()}
              onApprove={() => void handleApprove()}
            />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
