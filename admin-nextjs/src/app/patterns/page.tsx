import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { DashboardShell } from "@/components/dashboard-shell"

export default function PatternsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Patterns 模式库</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard 仪表盘</CardTitle>
              <CardDescription>指标总览与趋势</CardDescription>
            </CardHeader>
            <CardContent>指标总览、趋势对比、结构分析和异常下钻。</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Workspace List 工作台列表</CardTitle>
              <CardDescription>台账与工单</CardDescription>
            </CardHeader>
            <CardContent>适合台账、工单、订单、资产等列表工作台。</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Record Detail 记录详情</CardTitle>
              <CardDescription>单对象摘要</CardDescription>
            </CardHeader>
            <CardContent>
              适合单条记录详情、摘要、风险和审计信息查看。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reporting Wizard 填报向导</CardTitle>
              <CardDescription>多步骤流程</CardDescription>
            </CardHeader>
            <CardContent>适合填报、建模、初始化配置等多步骤流程。</CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
