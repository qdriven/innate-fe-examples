import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

import { CodeBlock } from "@/components/code-block"
import { ImpactBadge, StatusBadge } from "@/components/status-badge"
import { PlaygroundBanner } from "@/components/playground-banner"
import { PM_ACTION, PM_IMPACT } from "@/lib/snapshot"
import { getActiveSnapshot } from "@/lib/view"

export const dynamic = "force-dynamic"

export default async function EvolutionPage() {
  const { snapshot, playground } = await getActiveSnapshot()
  const hasMoments =
    snapshot.diff.changes.length > 0 || snapshot.momentB.proofError

  return (
    <div className="space-y-6">
      {playground ? (
        <PlaygroundBanner
          domain={playground.result.domain}
          createdAt={playground.createdAt}
        />
      ) : null}
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          变更影响（演进守护）
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          统一语言的每次演化都有机器看守：改一个方法名，skelc 的 schema diff
          立刻判定它是否破坏其他上下文的使用方；改一个字段类型，重新生成的 Lean
          类型会让旧证明当场编译失败。这里是给产品经理看的影响翻译。
        </p>
      </section>

      {!hasMoments ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">
              Playground 契约暂无演进记录
            </CardTitle>
            <CardDescription>
              这里的两个「高光时刻」（重命名方法 → BREAKING 判定、字段改型 →
              证明失效） 属于基线 commerce 演示。对 Playground
              契约同样适用：修改 Playground
              里的契约后重新运行流水线，即可看到同类检查在你的契约上生效。
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">时刻 A：重命名取消方法</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {PM_ACTION["service.method.removed"]}
                </CardTitle>
                <CardAction>
                  <StatusBadge
                    status={
                      snapshot.diff.summary.breaking > 0 ? "passed" : "unknown"
                    }
                  />
                </CardAction>
                <CardDescription>{PM_IMPACT.BREAKING}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded-md border px-2.5 py-1 tabular-nums">
                    BREAKING{" "}
                    <b className="text-red-600 dark:text-red-400">
                      {snapshot.diff.summary.breaking}
                    </b>
                  </span>
                  <span className="rounded-md border px-2.5 py-1 tabular-nums">
                    DANGEROUS <b>{snapshot.diff.summary.dangerous}</b>
                  </span>
                  <span className="rounded-md border px-2.5 py-1 tabular-nums">
                    COMPATIBLE{" "}
                    <b className="text-emerald-600 dark:text-emerald-400">
                      {snapshot.diff.summary.compatible}
                    </b>
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-4 font-medium">变更</th>
                        <th className="py-2 pr-4 font-medium">级别</th>
                        <th className="py-2 font-medium">业务后果</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshot.diff.changes.map((change, i) => (
                        <tr
                          key={`${change.code}-${i}`}
                          className="border-b last:border-0"
                        >
                          <td className="py-2 pr-4">
                            <span className="font-mono text-xs">
                              {change.code}
                            </span>
                          </td>
                          <td className="py-2 pr-4">
                            <ImpactBadge impact={change.impact} />
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {PM_IMPACT[change.impact]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">
                  判定来源：<code className="font-mono">skelc schema diff</code>
                  （Git 基线对照的稳定规则矩阵）。
                  决策建议：这类变更由产品拍板——值不值得让所有客户端强制升级。
                </p>
              </CardContent>
            </Card>
          </section>

          {snapshot.momentB.proofError ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">
                时刻 B：字段改型，证明当场失效
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    把 {snapshot.momentB.mutated}，会怎样？
                  </CardTitle>
                  <CardAction>
                    <StatusBadge
                      status={
                        snapshot.momentB.proofError ? "passed" : "unknown"
                      }
                    />
                  </CardAction>
                  <CardDescription>
                    契约演化同时拉动「三端代码重新生成」和「数学证明重新检查」——这正是单一语义模型的价值。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>
                      修改 .skel 里的字段类型，用 skel2lean 重新生成 Lean 类型
                    </li>
                    <li>新类型编译通过（契约本身合法）</li>
                    <li>
                      但 <code className="font-mono">Order.total</code>{" "}
                      的旧证明编译失败：
                    </li>
                  </ol>
                  <CodeBlock
                    code={snapshot.momentB.proofError}
                    label="Proofs/OrderCore.lean（重新检查）"
                    className="border-dashed"
                  />
                </CardContent>
              </Card>
            </section>
          ) : null}

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">影响级别图例</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["BREAKING", "DANGEROUS", "COMPATIBLE"] as const).map(
                (impact) => (
                  <Card key={impact}>
                    <CardContent className="space-y-2 pt-1">
                      <ImpactBadge impact={impact} />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {PM_IMPACT[impact]}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
