import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

const domainPacks = [
  {
    name: "Carbon Management Pack",
    status: "Active",
    description:
      "覆盖产品碳足迹、组织碳盘查、ESG/CBAM、碳资产、减排方案与 SBTi 目标管理。",
  },
  {
    name: "ERP Operations Pack",
    status: "Planned",
    description: "覆盖采购、库存、订单、结算、对账与审批流程等企业运营场景。",
  },
  {
    name: "Generic SaaS Pack",
    status: "Planned",
    description: "覆盖组织管理、权限体系、集成管理、运营分析等通用 SaaS 能力。",
  },
]

export function DomainPacksPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Domain Pack 扩展策略</CardTitle>
          <CardDescription>
            行业差异通过 Pack 扩展实体词表、口径定义和流程，不直接改写 Core 与
            Pattern。
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] lg:grid-cols-3">
        {domainPacks.map((pack) => (
          <Card key={pack.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {pack.name}
                <Badge
                  variant={pack.status === "Active" ? "secondary" : "outline"}
                >
                  {pack.status}
                </Badge>
              </CardTitle>
              <CardDescription>{pack.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Pack 变更只允许新增场景和口径映射，不得破坏平台级不变量。
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
