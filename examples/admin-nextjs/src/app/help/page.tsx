import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { DashboardShell } from "@/components/dashboard-shell"

export default function HelpPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">帮助中心</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>使用指南</CardTitle>
              <CardDescription>快速上手文档</CardDescription>
            </CardHeader>
            <CardContent>查看规范使用指南、协作流程与常见问题。</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>常见问题</CardTitle>
              <CardDescription>FAQ 与故障排查</CardDescription>
            </CardHeader>
            <CardContent>
              承载使用帮助、工单入口、教程和问题排查指南。
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
