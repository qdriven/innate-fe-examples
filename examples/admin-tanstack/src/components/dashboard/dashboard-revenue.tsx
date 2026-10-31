import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { TrendingUpIcon } from "lucide-react"
import {
  type ChartConfig,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@innate/ui"
const chartData = [
  { month: "1月", value: 4200 },
  { month: "2月", value: 5800 },
  { month: "3月", value: 5200 },
  { month: "4月", value: 6800 },
  { month: "5月", value: 5900 },
  { month: "6月", value: 7200 },
  { month: "7月", value: 6500 },
  { month: "8月", value: 8100 },
  { month: "9月", value: 7600 },
  { month: "10月", value: 9200 },
  { month: "11月", value: 8800 },
  { month: "12月", value: 15231 },
]

const chartConfig = {
  value: {
    label: "收入",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function DashboardRevenue() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>总收入</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">$15,231.89</span>
          <Badge
            variant="outline"
            className="border-[var(--chart-3)]/30 bg-[var(--chart-1)]/10 font-medium text-[var(--chart-4)]"
          >
            <TrendingUpIcon data-icon="inline-start" />
            +20.1%
          </Badge>
        </div>
        <CardDescription>较上月</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <ChartContainer config={chartConfig} className="h-[90px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 4"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 10 }}
              interval={1}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--chart-4)"
              strokeWidth={1.5}
              dot={{ r: 2.5, fill: "var(--chart-4)", strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
