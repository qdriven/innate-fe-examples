import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { DashboardShell } from "@/components/dashboard-shell"

export default function GovernancePage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">治理与发布</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>版本管理</CardTitle>
              <CardDescription>规范版本控制</CardDescription>
            </CardHeader>
            <CardContent>
              用版本、校验与验收清单保证规范可持续演进。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>发布流程</CardTitle>
              <CardDescription>标准化发布检查</CardDescription>
            </CardHeader>
            <CardContent>
              灰度发布、版本校验、回滚策略和上线审批闭环。
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
