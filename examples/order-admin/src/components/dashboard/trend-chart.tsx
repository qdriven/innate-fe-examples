import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@innate/ui"
import type { OrderWeeklyAmountPoint } from "../../lib/orders/service"
import { formatWeekLabel } from "./format"

const chartConfig = {
  amount: {
    label: "成交金额",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

/**
 * PrimaryPanel（首屏唯一 dominant）：按周成交金额趋势。
 * recharts + @innate/ui ChartContainer 自建，参考 admin-tanstack
 * dashboard-revenue.tsx；尺寸交给 ResponsiveContainer，不写死像素。
 */
export function TrendChart({
  points,
}: {
  points: readonly OrderWeeklyAmountPoint[]
}) {
  const data = points.map((point) => ({
    week: formatWeekLabel(point.weekStart),
    amount: point.amount,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>按周成交金额趋势</CardTitle>
        <CardDescription>
          已支付 / 已发货 / 已完成订单的金额合计，按下单周聚合
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 4"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: number) => value.toLocaleString("zh-CN")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillAmount)"
              dot={{ r: 2.5, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
