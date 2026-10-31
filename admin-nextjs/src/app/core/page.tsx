import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { DashboardShell } from "@/components/dashboard-shell"

export default function CorePage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Core 平台能力</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>RBAC 权限</CardTitle>
              <CardDescription>基于角色的访问控制</CardDescription>
            </CardHeader>
            <CardContent>
              统一横切能力：角色、权限、组织、用户管理。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>审计态</CardTitle>
              <CardDescription>全链路审计追踪</CardDescription>
            </CardHeader>
            <CardContent>操作日志、变更记录、合规审计与追溯能力。</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>单位策略</CardTitle>
              <CardDescription>多租户隔离</CardDescription>
            </CardHeader>
            <CardContent>
              组织、项目、园区、设施等多级单位上下文隔离。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>同步健康</CardTitle>
              <CardDescription>集成监控</CardDescription>
            </CardHeader>
            <CardContent>IoT、ERP、第三方系统同步健康与异常处理。</CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
