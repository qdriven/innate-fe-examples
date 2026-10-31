import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { DashboardShell } from "@/components/dashboard-shell"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">系统设置</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>组织管理</CardTitle>
              <CardDescription>组织级默认策略</CardDescription>
            </CardHeader>
            <CardContent>维护组织级默认策略、文档规范与发布参数。</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>通知配置</CardTitle>
              <CardDescription>消息订阅</CardDescription>
            </CardHeader>
            <CardContent>
              系统提醒、业务消息、订阅更新和预警触达配置。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>安全策略</CardTitle>
              <CardDescription>权限与审计</CardDescription>
            </CardHeader>
            <CardContent>
              角色、权限、组织、元数据、审计和生命周期规则。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>集成管理</CardTitle>
              <CardDescription>连接器与同步</CardDescription>
            </CardHeader>
            <CardContent>
              连接器、集成健康、数据质量、调度、发布和商业化能力。
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
