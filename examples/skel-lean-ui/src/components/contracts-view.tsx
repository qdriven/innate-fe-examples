"use client"

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@innate/ui"

import type { DomainSnapshot } from "@/lib/snapshot"

const KIND_LABEL: Record<string, string> = {
  data: "数据",
  enum: "枚举",
  config: "配置",
  event: "领域事件",
  actor: "调用者",
  resource: "权限资源",
  service: "服务",
  web: "Web 入口",
  task: "后台任务",
}

export function ContractsView({ domains }: { domains: DomainSnapshot[] }) {
  return (
    <Tabs defaultValue={domains[0]?.name ?? "domain"}>
      <TabsList>
        {domains.map((domain) => (
          <TabsTrigger key={domain.name} value={domain.name}>
            {domain.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {domains.map((domain) => (
        <TabsContent
          key={domain.name}
          value={domain.name}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-base">
                {domain.name}
              </CardTitle>
              <CardDescription>
                {domain.description || "（无域描述）"} ·{" "}
                {domain.declarations.length} 个声明 · schema format v
                {domain.formatVersion}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">名称</th>
                      <th className="py-2 pr-4 font-medium">类别</th>
                      <th className="py-2 pr-4 font-medium">公开</th>
                      <th className="py-2 font-medium">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domain.declarations.map((decl) => (
                      <tr
                        key={decl.skelName}
                        className="border-b last:border-0"
                      >
                        <td className="py-2 pr-4">
                          <span className="font-mono text-[13px]">
                            {decl.name}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          <Badge variant="secondary">
                            {KIND_LABEL[decl.kind] ?? decl.kind}
                          </Badge>
                        </td>
                        <td className="py-2 pr-4">
                          {decl.pub ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                            >
                              pub
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              内部
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {decl.description || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
