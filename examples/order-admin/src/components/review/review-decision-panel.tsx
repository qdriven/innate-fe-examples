import { InfoListCard } from "@innate/scene-catalog/scene-blocks"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
} from "@innate/ui"
import { REVIEW_STATE_LABELS } from "../../lib/orders/review"
import {
  ORDER_CATEGORY_LABELS,
  ORDER_STATUS_LABELS,
  orderTotal,
  type Order,
} from "../../lib/orders/types"

/**
 * 审核上下文 + 决策栏（审核页右辅区）。
 *
 * 决策栏方向照 approval-review-scene-spec：退回 → 备注 → 批准，
 * 次要在左、主操作在右（按钮右对齐）。退回必须填写原因，
 * 决策由页面走 service.decideReview 落库——禁止无后端状态的纯 toast 批准。
 */
export function ReviewDecisionPanel({
  order,
  busy,
  reason,
  onReasonChange,
  comment,
  onCommentChange,
  onReject,
  onComment,
  onApprove,
}: {
  /** 当前选中的待审订单；null 表示未选中（空态）。 */
  order: Order | null
  busy: boolean
  /** 退回原因（rejected 必填）。 */
  reason: string
  onReasonChange: (value: string) => void
  /** 追加备注文本。 */
  comment: string
  onCommentChange: (value: string) => void
  onReject: () => void
  onComment: () => void
  onApprove: () => void
}) {
  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>审核上下文</CardTitle>
          <CardDescription>从左侧队列选择一笔待审订单。</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          暂无选中的订单。
        </CardContent>
      </Card>
    )
  }

  const total = orderTotal(order)

  return (
    <div className="flex flex-col gap-[var(--spacing-section)]">
      <InfoListCard
        title="审核上下文"
        description="决策前先读完提交内容与风险。"
        items={[
          { label: "订单号", value: order.id },
          { label: "客户", value: order.customer },
          { label: "种类", value: ORDER_CATEGORY_LABELS[order.category] },
          { label: "履约状态", value: ORDER_STATUS_LABELS[order.status] },
          { label: "金额", value: `¥${total.toFixed(2)}` },
          {
            label: "明细摘要",
            value: `${order.lines.length} 行 / 合计 ¥${total.toFixed(2)}`,
          },
          {
            label: "提交时间",
            value: order.updatedAt.slice(0, 16).replace("T", " "),
          },
          { label: "审批 SLA", value: "24 小时" },
          {
            label: "当前结论",
            value: REVIEW_STATE_LABELS[order.reviewState],
          },
          ...(order.reviewReason
            ? [{ label: "拒绝原因", value: order.reviewReason }]
            : []),
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>决策栏</CardTitle>
          <CardDescription>
            退回必须填写原因；备注追加到订单说明；批准为终态决策。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="review-reason">退回原因（退回必填）</Label>
            <Textarea
              id="review-reason"
              placeholder="例：预算不足，请调整后重新提交"
              value={reason}
              disabled={busy}
              onChange={(event) => onReasonChange(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="review-comment">备注</Label>
            <Textarea
              id="review-comment"
              placeholder="给提交人的补充说明"
              value={comment}
              disabled={busy}
              onChange={(event) => onCommentChange(event.target.value)}
            />
          </div>
          {/* 次要在左、主操作在右：退回 → 备注 → 批准 */}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" disabled={busy} onClick={onReject}>
              退回补充
            </Button>
            <Button variant="outline" disabled={busy} onClick={onComment}>
              追加备注
            </Button>
            <Button disabled={busy} onClick={onApprove}>
              批准
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
