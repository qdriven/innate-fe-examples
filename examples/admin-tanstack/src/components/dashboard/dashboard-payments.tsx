import * as React from "react"
import { SearchIcon } from "lucide-react"
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@innate/ui"
type PaymentStatus = "success" | "processing" | "failed"

interface Payment {
  id: string
  customer: string
  email: string
  amount: string
  status: PaymentStatus
}

const payments: Array<Payment> = [
  {
    id: "1",
    customer: "Kenneth Thompson",
    email: "ken99@yahoo.com",
    amount: "$316.00",
    status: "success",
  },
  {
    id: "2",
    customer: "Abraham Lincoln",
    email: "abe45@gmail.com",
    amount: "$242.00",
    status: "success",
  },
  {
    id: "3",
    customer: "Monserrat Rodriguez",
    email: "monserrat44@gmail.com",
    amount: "$837.00",
    status: "processing",
  },
  {
    id: "4",
    customer: "Silas Johnson",
    email: "silas22@gmail.com",
    amount: "$874.00",
    status: "success",
  },
  {
    id: "5",
    customer: "Carmella DeVito",
    email: "carmello@hotmail.com",
    amount: "$721.00",
    status: "failed",
  },
  {
    id: "6",
    customer: "Maria Garcia",
    email: "maria@gmail.com",
    amount: "$529.00",
    status: "success",
  },
  {
    id: "7",
    customer: "James Wilson",
    email: "james34@outlook.com",
    amount: "$438.00",
    status: "processing",
  },
  {
    id: "8",
    customer: "Sarah Jones",
    email: "sarah.j@yahoo.com",
    amount: "$692.00",
    status: "success",
  },
]

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  success: {
    label: "成功",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  processing: {
    label: "处理中",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400",
  },
  failed: {
    label: "失败",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400",
  },
}

interface DashboardPaymentsProps {
  className?: string
}

export function DashboardPayments({ className }: DashboardPaymentsProps) {
  const [search, setSearch] = React.useState("")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const filtered = payments.filter(
    (p) =>
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  )

  const allSelected =
    filtered.length > 0 && filtered.every((p) => selected.has(p.id))

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        filtered.forEach((p) => next.delete(p.id))
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        filtered.forEach((p) => next.add(p.id))
        return next
      })
    }
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>最近支付</CardTitle>
        <CardDescription>查看来自客户的最新支付记录。</CardDescription>
        <CardAction>
          <div className="relative w-44 shrink-0">
            <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="筛选支付..."
              className="pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="全选"
                />
              </TableHead>
              <TableHead>客户</TableHead>
              <TableHead className="hidden sm:table-cell">邮箱</TableHead>
              <TableHead>金额</TableHead>
              <TableHead>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((payment) => {
              const cfg = statusConfig[payment.status]
              return (
                <TableRow key={payment.id}>
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selected.has(payment.id)}
                      onCheckedChange={(checked) => {
                        setSelected((prev) => {
                          const next = new Set(prev)
                          if (checked) next.add(payment.id)
                          else next.delete(payment.id)
                          return next
                        })
                      }}
                      aria-label={`选择 ${payment.customer}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {payment.customer}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {payment.email}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {payment.amount}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cfg.className}>
                      {cfg.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
