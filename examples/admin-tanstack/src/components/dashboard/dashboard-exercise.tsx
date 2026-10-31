import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"
import { DownloadIcon } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  cn,
} from "@innate/ui"
const chartData = [
  { date: "1月", primary: 38, secondary: 30 },
  { date: "2月", primary: 42, secondary: 38 },
  { date: "3月", primary: 28, secondary: 45 },
  { date: "4月", primary: 50, secondary: 32 },
  { date: "5月", primary: 60, secondary: 28 },
  { date: "6月", primary: 55, secondary: 42 },
  { date: "7月", primary: 65, secondary: 36 },
  { date: "8月", primary: 48, secondary: 48 },
  { date: "9月", primary: 70, secondary: 35 },
  { date: "10月", primary: 58, secondary: 50 },
  { date: "11月", primary: 72, secondary: 40 },
  { date: "12月", primary: 62, secondary: 55 },
]

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
        <p className="mb-1 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-muted-foreground">
            {p.name}：{p.value} 分钟
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface DashboardExerciseProps {
  className?: string
}

export function DashboardExercise({ className }: DashboardExerciseProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div>
          <CardTitle>运动时长</CardTitle>
          <CardDescription>您的运动时长超过了平均水平。</CardDescription>
        </div>
        <CardAction>
          <Button variant="outline" size="sm" className="gap-1.5">
            <DownloadIcon data-icon />
            导出
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={180}>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) => (value === "primary" ? "今年" : "去年")}
            />
            <Line
              type="monotone"
              dataKey="primary"
              name="primary"
              stroke="var(--chart-4)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="secondary"
              name="secondary"
              stroke="var(--chart-1)"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 2"
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
