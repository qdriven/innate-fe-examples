import Link from "next/link"

import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

import { PlaygroundBanner } from "@/components/playground-banner"
import { VerifiedBadge } from "@/components/status-badge"
import { getActiveSnapshot } from "@/lib/view"

export const dynamic = "force-dynamic"

export default async function RulesPage() {
  const { snapshot, playground } = await getActiveSnapshot()
  const uncovered = snapshot.propertyTests.filter(
    (test) => !snapshot.theorems.some((t) => t.goTest === test)
  )

  return (
    <div className="space-y-6">
      {playground ? (
        <PlaygroundBanner
          domain={playground.result.domain}
          createdAt={playground.createdAt}
        />
      ) : null}
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">业务规则卡片</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          产品经理讲一条业务规则 → 工程师把它写成 Lean 定理 → kernel
          验证「对所有可能的输入都成立」 → 同一条规则回流为 Go
          性质测试（固定种子随机 + 穷举）。卡片上的「已验证」是数学结论，
          不是抽样测试结论。
        </p>
      </section>

      {snapshot.theorems.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">
              这个契约还没有被证明的业务规则
            </CardTitle>
            <CardDescription>
              Playground 生成的契约目前验证到「Lean 类型通过 kernel
              编译」这一层。 写定理需要人工（或未来由 AI
              辅助）：在生成的类型之上为聚合不变式编写
              定理与证明——参考基线演示的 OrderCore.lean 六条定理。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/playground"
              className="text-sm underline underline-offset-4"
            >
              返回 Playground 查看已生成的类型
            </Link>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {snapshot.theorems.map((theorem) => (
            <Card key={theorem.name}>
              <CardHeader>
                <CardTitle className="text-base">{theorem.ruleZh}</CardTitle>
                <CardAction>
                  <VerifiedBadge verified={theorem.verified} />
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {theorem.statement}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="outline" className="font-mono">
                    {theorem.name}
                  </Badge>
                  {theorem.goTest ? (
                    <Badge variant="secondary" className="font-mono">
                      {theorem.goTest}
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">数值示例</CardTitle>
              <CardAction>
                <VerifiedBadge verified />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                2 件 × 单价 3 → 总额 6，由 kernel 判定；取消该订单后总额仍为 6。
              </p>
              <Badge variant="outline" className="font-mono">
                demoOrder.total = 6
              </Badge>
            </CardContent>
          </Card>
        </section>
      )}

      {uncovered.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">尚未对应定理的性质测试</h2>
          <Card>
            <CardContent className="flex flex-wrap gap-2 pt-1">
              {uncovered.map((test) => (
                <Badge key={test} variant="secondary" className="font-mono">
                  {test}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">
            这些测试守护契约自身的行为（生成的 Validate 必填检查、JSON
            round-trip），不对应业务规则定理。
          </p>
        </section>
      ) : null}
    </div>
  )
}
