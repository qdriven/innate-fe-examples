import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

const coreCapabilities = [
  {
    title: "Global Scope（组织 -> 设施）",
    description: "全局范围固定到设施，页面内允许局部细化，不改变全局上下文。",
    tag: "Scope",
  },
  {
    title: "RBAC 权限控制",
    description: "统一 read/write 权限门禁，确保场景行为一致且可审计。",
    tag: "Security",
  },
  {
    title: "审计只读期",
    description: "禁止写操作，保留变更申请、备注与附件补充入口。",
    tag: "Audit",
  },
  {
    title: "期间锁定期",
    description: "锁定历史期数据，仅允许查看、导出、对比与快照说明。",
    tag: "Audit",
  },
  {
    title: "组织级单位策略",
    description: "显示单位由组织级策略决定，统一换算、精度与舍入规则。",
    tag: "Unit",
  },
  {
    title: "同步健康度",
    description:
      "统一展示 last_sync_at、滞后阈值与失败引导，适配 IoT/ERP 接入。",
    tag: "Data",
  },
]

export function CorePage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] md:grid-cols-2 xl:grid-cols-3">
        {coreCapabilities.map((capability) => (
          <Card key={capability.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {capability.title}
                <Badge variant="outline">{capability.tag}</Badge>
              </CardTitle>
              <CardDescription>{capability.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              作为 Core 合同，所有 Scene 必须引用并遵循该能力规范。
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
