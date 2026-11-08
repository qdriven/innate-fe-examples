import { useCallback, useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  type Column,
  type ColumnDef,
  type FilterFn,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PanelRightIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  XCircleIcon,
} from "lucide-react"
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@innate/ui"
import { AppLink, useRouter } from "../../lib/routing"
import {
  isCancellableStatus,
  ORDER_CATEGORIES,
  ORDER_CATEGORY_LABELS,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  orderTotal,
  type Order,
  type OrderCategory,
  type OrderStatus,
} from "../../lib/orders/types"
import { OrderStatusBadge } from "./order-status-badge"

/**
 * 状态筛选项的「值 → 标签」映射。
 *
 * Base UI 的 SelectValue 不给 `items` 映射时渲染的是**原始 value**（界面上会
 * 直接露出 "all" / "draft"），所以标签必须显式提供。
 */
const STATUS_FILTER_ITEMS: Record<string, ReactNode> = {
  all: "全部状态",
  ...Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, ORDER_STATUS_LABELS[status]])
  ),
}

/** 种类筛选项的「值 → 标签」映射（同 STATUS_FILTER_ITEMS，避免露原始 value）。 */
const CATEGORY_FILTER_ITEMS: Record<string, ReactNode> = {
  all: "全部种类",
  ...Object.fromEntries(
    ORDER_CATEGORIES.map((category) => [
      category,
      ORDER_CATEGORY_LABELS[category],
    ])
  ),
}

const searchFilter: FilterFn<Order> = (row, _columnId, filterValue) => {
  const query = String(filterValue ?? "")
    .trim()
    .toLowerCase()
  if (!query) return true
  const order = row.original
  return (
    order.id.toLowerCase().includes(query) ||
    order.customer.toLowerCase().includes(query)
  )
}

function SortableHeader({
  column,
  title,
}: {
  column: Column<Order, unknown>
  title: string
}) {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2.5 h-8 gap-1"
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUpIcon data-icon />
      ) : sorted === "desc" ? (
        <ArrowDownIcon data-icon />
      ) : (
        <ArrowUpDownIcon className="opacity-50" data-icon />
      )}
    </Button>
  )
}

export function OrdersTable({
  orders,
  onCancel,
  onBulkCancel,
  onPeek,
}: {
  orders: readonly Order[]
  onCancel: (order: Order) => void
  onBulkCancel?: (orders: readonly Order[]) => void
  /** 行菜单「抽屉查看」：由页面持有 OrderPeekSheet 开关状态。 */
  onPeek?: (order: Order) => void
}) {
  // TanStack Table 返回可变闭包，跳过 React Compiler 记忆化（同 admin-composites DataTable）
  "use no memo"

  const router = useRouter()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<OrderStatus | "all">("all")
  const [category, setCategory] = useState<OrderCategory | "all">("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    () => new Set<string>()
  )

  const toggleOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const toggleMany = useCallback((ids: readonly string[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const id of ids) {
        if (checked) next.add(id)
        else next.delete(id)
      }
      return next
    })
  }, [])

  // 状态 / 种类在客户端与 orders 参数 AND 组合（search 走 globalFilter）
  const data = useMemo(
    () =>
      orders.filter((order) => {
        if (status !== "all" && order.status !== status) return false
        if (category !== "all" && order.category !== category) return false
        return true
      }),
    [orders, status, category]
  )

  // 已不可取消的订单不计入批量选择（选择后状态变化也会自动掉出）
  const selectedOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          selectedIds.has(order.id) && isCancellableStatus(order.status)
      ),
    [orders, selectedIds]
  )

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          const selectableIds = table
            .getFilteredRowModel()
            .rows.filter((row) => isCancellableStatus(row.original.status))
            .map((row) => row.original.id)
          const allSelected =
            selectableIds.length > 0 &&
            selectableIds.every((id) => selectedIds.has(id))
          const someSelected = selectableIds.some((id) => selectedIds.has(id))
          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                disabled={selectableIds.length === 0}
                onCheckedChange={(checked) =>
                  toggleMany(selectableIds, Boolean(checked))
                }
                aria-label="全选可取消订单"
              />
            </div>
          )
        },
        cell: ({ row }) => {
          const order = row.original
          const cancellable = isCancellableStatus(order.status)
          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={selectedIds.has(order.id)}
                disabled={!cancellable}
                onCheckedChange={(checked) =>
                  toggleOne(order.id, Boolean(checked))
                }
                aria-label={
                  cancellable
                    ? `选择订单 ${order.id}`
                    : `选择订单 ${order.id}（不可取消）`
                }
                title={cancellable ? undefined : "该订单已不可取消"}
              />
            </div>
          )
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <SortableHeader column={column} title="订单号" />
        ),
        cell: ({ row }) => (
          <AppLink
            href={`/orders/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.id}
          </AppLink>
        ),
      },
      {
        accessorKey: "customer",
        header: ({ column }) => <SortableHeader column={column} title="客户" />,
      },
      {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "category",
        header: "种类",
        cell: ({ row }) => (
          <Badge variant="outline">
            {ORDER_CATEGORY_LABELS[row.original.category]}
          </Badge>
        ),
      },
      {
        id: "total",
        accessorFn: (row) => orderTotal(row),
        header: ({ column }) => <SortableHeader column={column} title="金额" />,
        cell: ({ getValue }) => `¥${Number(getValue()).toFixed(2)}`,
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <SortableHeader column={column} title="更新时间" />
        ),
        cell: ({ getValue }) => String(getValue()).slice(0, 10),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">操作</span>,
        cell: ({ row }) => {
          const order = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-7" />
                }
              >
                <EllipsisVerticalIcon data-icon />
                <span className="sr-only">订单操作</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <EyeIcon data-icon />
                  查看详情
                </DropdownMenuItem>
                {onPeek ? (
                  <DropdownMenuItem onClick={() => onPeek(order)}>
                    <PanelRightIcon data-icon />
                    抽屉查看
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem
                  onClick={() => router.push(`/orders/${order.id}/edit`)}
                >
                  <PencilIcon data-icon />
                  编辑
                </DropdownMenuItem>
                {isCancellableStatus(order.status) ? (
                  <DropdownMenuItem onClick={() => onCancel(order)}>
                    <XCircleIcon data-icon />
                    取消订单
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onCancel, onPeek, router, selectedIds, toggleMany, toggleOne]
  )

  // TanStack Table 返回可变闭包，跳过 React Compiler 记忆化（同 admin-composites DataTable）
  // oxlint-disable-next-line react/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: search },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    globalFilterFn: searchFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const rows = table.getRowModel().rows
  const filteredCount = table.getFilteredRowModel().rows.length
  const { pageIndex } = table.getState().pagination
  const pageCount = table.getPageCount()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-72">
          <SearchIcon
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            data-icon
          />
          <Input
            className="pl-8"
            placeholder="搜索订单号或客户"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select
          items={STATUS_FILTER_ITEMS}
          value={status}
          onValueChange={(value) => setStatus(value as OrderStatus | "all")}
        >
          <SelectTrigger className="w-36" aria-label="按状态筛选">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {ORDER_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {ORDER_STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          items={CATEGORY_FILTER_ITEMS}
          value={category}
          onValueChange={(value) => setCategory(value as OrderCategory | "all")}
        >
          <SelectTrigger className="w-36" aria-label="按种类筛选">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部种类</SelectItem>
            {ORDER_CATEGORIES.map((value) => (
              <SelectItem key={value} value={value}>
                {ORDER_CATEGORY_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-1 justify-end">
          <Button onClick={() => router.push("/orders/new")}>
            <PlusIcon data-icon />
            新建订单
          </Button>
        </div>
      </div>

      {onBulkCancel && selectedOrders.length > 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2">
          <p className="text-sm">
            已选 <span className="font-medium">{selectedOrders.length}</span> 项
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" />}
            >
              批量操作
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onBulkCancel(selectedOrders)}
              >
                <XCircleIcon data-icon />
                批量取消
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-56 align-top">
                  <Empty className="h-full">
                    <EmptyTitle>
                      {orders.length === 0 ? "还没有订单" : "没有匹配的订单"}
                    </EmptyTitle>
                    <EmptyDescription>
                      {orders.length === 0
                        ? "从第一笔订单开始。"
                        : "调整搜索词或状态筛选。"}
                    </EmptyDescription>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>共 {filteredCount} 条</span>
        <div className="flex items-center gap-2">
          <span>
            第 {pageIndex + 1} / {Math.max(pageCount, 1)} 页
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon data-icon />
            <span className="sr-only">上一页</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon data-icon />
            <span className="sr-only">下一页</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
