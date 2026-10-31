import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
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
  { week: "W1", value: 240 },
  { week: "W2", value: 300 },
  { week: "W3", value: 200 },
  { week: "W4", value: 278 },
  { week: "W5", value: 189 },
  { week: "W6", value: 239 },
  { week: "W7", value: 278 },
  { week: "W8", value: 189 },
]

const chartConfig = {
  value: {
    label: "订阅数",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function DashboardSubscriptions() {
  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>订阅量</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">
            +{total.toLocaleString()}
          </span>
          <Badge
            variant="outline"
            className="border-[var(--chart-3)]/30 bg-[var(--chart-1)]/10 font-medium text-[var(--chart-4)]"
          >
            <TrendingUpIcon data-icon="inline-start" />
            +180.1%
          </Badge>
        </div>
        <CardDescription>较上月</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <ChartContainer config={chartConfig} className="h-[90px] w-full">
          <BarChart data={chartData} margin={{ top: 16, right: 4, left: 4 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 4"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 11 }}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === chartData.length - 3
                      ? "var(--chart-4)"
                      : "var(--chart-2)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
