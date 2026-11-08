import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { z } from "zod"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innate/ui"
import {
  ORDER_CATEGORIES,
  ORDER_CATEGORY_LABELS,
  type Order,
  type OrderInput,
} from "../../lib/orders/types"

/**
 * 种类 Select 的「值 → 标签」映射：Base UI 的 SelectValue 不给 items 时
 * 会直接渲染原始 value（界面上露出 "standard"），与 STATUS_FILTER_ITEMS 同因。
 */
const CATEGORY_ITEMS: Record<string, string> = Object.fromEntries(
  ORDER_CATEGORIES.map((value) => [value, ORDER_CATEGORY_LABELS[value]])
)

const orderFormSchema = z.object({
  customer: z.string().min(1, "请填写客户名"),
  category: z.enum(ORDER_CATEGORIES, "请选择订单种类"),
  note: z.string(),
  lines: z
    .array(
      z.object({
        sku: z.string().min(1, "必填"),
        name: z.string().min(1, "必填"),
        quantity: z.coerce
          .number({ message: "请输入数量" })
          .int("正整数")
          .positive("必须大于 0"),
        unitPrice: z.coerce
          .number({ message: "请输入单价" })
          .min(0, "不能为负"),
      })
    )
    .min(1, "至少一行明细"),
})

/** z.input / z.output 因 z.coerce 分叉：input 允许 string，output 是 number。 */
type OrderFormInput = z.input<typeof orderFormSchema>
type OrderFormOutput = z.output<typeof orderFormSchema>

function toFormValues(order?: Order): OrderFormInput {
  return {
    customer: order?.customer ?? "",
    category: order?.category ?? "standard",
    note: order?.note ?? "",
    lines:
      order && order.lines.length > 0
        ? order.lines.map((line) => ({
            sku: line.sku,
            name: line.name,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          }))
        : [{ sku: "", name: "", quantity: 1, unitPrice: 0 }],
  }
}

export function OrderForm({
  order,
  submitLabel = "保存",
  onSubmit,
}: {
  order?: Order
  submitLabel?: string
  onSubmit: (input: OrderInput) => Promise<void>
}) {
  const form = useForm<OrderFormInput, unknown, OrderFormOutput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: toFormValues(order),
  })
  const lines = useFieldArray({ control: form.control, name: "lines" })
  const linesError =
    form.formState.errors.lines?.root?.message ??
    form.formState.errors.lines?.message

  const submit = form.handleSubmit(async (values) => {
    await onSubmit({
      customer: values.customer,
      category: values.category,
      note: values.note,
      lines: values.lines.map((line) => ({
        sku: line.sku,
        name: line.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-6" noValidate>
        <Card size="sm">
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>客户</FormLabel>
                  <FormControl>
                    <Input placeholder="客户 / 采购方" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>订单种类</FormLabel>
                  <Select
                    items={CATEGORY_ITEMS}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_CATEGORIES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {ORDER_CATEGORY_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>备注</FormLabel>
                  <FormControl>
                    <Input placeholder="选填" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>订单明细</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                lines.append({ sku: "", name: "", quantity: 1, unitPrice: 0 })
              }
            >
              <PlusIcon data-icon />
              添加明细
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {lines.fields.map((line, index) => (
              <div
                key={line.id}
                className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_6rem_7rem_2.25rem] md:items-start"
              >
                <FormField
                  control={form.control}
                  name={`lines.${index}.sku`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`lines.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">品名</FormLabel>
                      <FormControl>
                        <Input placeholder="品名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`lines.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">数量</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="数量"
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`lines.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">单价</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="单价"
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => lines.remove(index)}
                  disabled={lines.fields.length <= 1}
                >
                  <Trash2Icon data-icon />
                  <span className="sr-only">删除明细</span>
                </Button>
              </div>
            ))}
            {linesError ? (
              <p className="text-destructive text-sm">{linesError}</p>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
