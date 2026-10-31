import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DomainPacksPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Domain Packs</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>行业实体词表</CardTitle>
              <CardDescription>按行业扩展业务术语</CardDescription>
            </CardHeader>
            <CardContent>
              行业包按实体词表、口径和流程扩展，不破坏 Core 与 Patterns。
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>扩展流程</CardTitle>
              <CardDescription>行业特有流程模板</CardDescription>
            </CardHeader>
            <CardContent>
              沉淀行业最佳实践，支持快速复用和定制化调整。
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
