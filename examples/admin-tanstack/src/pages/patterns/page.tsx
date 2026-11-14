import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

const patternItems = [
  "pattern-scope-switcher-org-unit",
  "pattern-scope-refinement",
  "pattern-filterbar",
  "pattern-kpi-cards",
  "pattern-list-table",
  "pattern-detail-page",
  "pattern-audit-readonly-banner",
  "pattern-lock-state",
  "pattern-change-request",
  "pattern-data-freshness",
]

export function PatternsPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pattern 合同模板</CardTitle>
          <CardDescription>
            每个 Pattern 必须定义 Purpose、Invariants、Slots、Variants、Required
            States、Anti-patterns。
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Pattern 负责承载组合变化，Scene
          负责业务语义与页面落地，二者分离可避免场景爆炸。
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] md:grid-cols-2">
        {patternItems.map((patternId) => (
          <Card key={patternId} size="sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{patternId}</span>
                <Badge variant="secondary">Stable</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              复用该 Pattern 时只允许填充声明的 Slots，不得破坏 Invariants。
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
