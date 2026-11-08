import { InfoListCard } from "@innate/scene-catalog/scene-blocks"
import { EyeIcon, PencilIcon } from "lucide-react"
import {
  Badge,
  buttonVariants,
  cn,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innate/ui"
import { AppLink } from "../../lib/routing"
import { REVIEW_STATE_LABELS } from "../../lib/orders/review"
import {
  ORDER_CATEGORY_LABELS,
  orderTotal,
  type Order,
} from "../../lib/orders/types"
import { OrderStatusBadge } from "./order-status-badge"

/** 行内快速查看抽屉的受控 props（开关状态由页面持有，同 CancelOrderDialog 模式）。 */
export interface OrderPeekSheetProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * 订单行内快速查看抽屉（Sheet side=right）：摘要头（订单号 / 种类 Badge /
 * 状态 Badge / 客户 / 金额）+ 元数据 + lines 简表 + 底部「查看详情 / 编辑」
 * AppLink（自动带 BASE_PATH）。order 为 null 时不渲染任何内容。
 */
export function OrderPeekSheet({
  order,
  open,
  onOpenChange,
}: OrderPeekSheetProps) {
  if (order === null) {
    return null
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-border pr-10">
          <SheetTitle>{order.id}</SheetTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {ORDER_CATEGORY_LABELS[order.category]}
            </Badge>
            <OrderStatusBadge status={order.status} />
          </div>
          <SheetDescription className="flex items-center justify-between gap-3">
            <span>{order.customer}</span>
            <span className="font-medium text-foreground">
              ¥{orderTotal(order).toFixed(2)}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4">
          <InfoListCard
            title="订单信息"
            items={[
              { label: "创建时间", value: order.createdAt.slice(0, 10) },
              { label: "更新时间", value: order.updatedAt.slice(0, 10) },
              {
                label: "审核状态",
                value: REVIEW_STATE_LABELS[order.reviewState],
              },
              { label: "备注", value: order.note || "—" },
            ]}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">订单明细</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>品名</TableHead>
                  <TableHead className="text-right">数量</TableHead>
                  <TableHead className="text-right">小计</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <span className="block font-medium">{line.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {line.sku}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {line.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ¥{(line.quantity * line.unitPrice).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <SheetFooter className="border-t border-border">
          <AppLink
            href={`/orders/${order.id}`}
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            <EyeIcon data-icon />
            查看详情
          </AppLink>
          <AppLink
            href={`/orders/${order.id}/edit`}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            <PencilIcon data-icon />
            编辑
          </AppLink>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
