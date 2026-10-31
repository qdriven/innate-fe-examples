import Link from "next/link"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@innate/ui"

import { CodeBlock } from "@/components/code-block"
import { PlaygroundBanner } from "@/components/playground-banner"
import { StatusBadge } from "@/components/status-badge"
import { getActiveSnapshot } from "@/lib/view"

export const dynamic = "force-dynamic"

const FLOW = [
  { title: ".skel 契约", note: "战略设计：限界上下文" },
  { title: "多端类型", note: "Go / TS / Lean 同一模型" },
  { title: "Lean 定理", note: "聚合不变式被证明" },
  { title: "Go 性质测试", note: "定理回流到实现" },
]

export default async function OverviewPage() {
  const { snapshot, playground } = await getActiveSnapshot()
  const totalDeclarations = snapshot.domains.reduce(
    (n, d) => n + d.declarations.length,
    0
  )
  const metrics = [
    {
      label: "限界上下文",
      value: snapshot.domains.length,
      hint: snapshot.domains.map((d) => d.name).join(" · "),
    },
    {
      label: "契约声明",
      value: totalDeclarations,
      hint: "data / enum / service / event / …",
    },
    {
      label: "已验证定理",
      value: snapshot.theorems.filter((t) => t.verified).length,
      hint: "Lean kernel 检查",
    },
    {
      label: "性质测试",
      value: snapshot.propertyTests.length,
      hint: "固定种子随机 + 穷举",
    },
  ]

  return (
    <div className="space-y-8">
      {playground ? (
        <PlaygroundBanner
          domain={playground.result.domain}
          createdAt={playground.createdAt}
        />
      ) : null}

      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Skel 守边界，Lean 守核心
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          这份看板的数据全部来自真实流水线：契约由 skelc 校验并生成 Go /
          TypeScript / Lean 三端代码；核心域不变式写成 Lean 定理、由 kernel
          机器验证；每条定理回流为 Go 性质测试。想用自己的业务描述试一遍？
          <Link href="/playground" className="underline underline-offset-4">
            去 Playground
          </Link>
          。
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader>
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{m.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {m.hint}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">验证链路</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {FLOW.map((f, i) => (
            <div key={f.title} className="flex items-center gap-2">
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <p className="font-medium">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.note}</p>
              </div>
              {i < FLOW.length - 1 ? (
                <span className="text-muted-foreground">→</span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">流水线</h2>
        <div className="space-y-3">
          {snapshot.pipeline.map((step) => (
            <Card key={step.id}>
              <CardHeader>
                <CardTitle className="text-base">{step.title}</CardTitle>
                <CardAction>
                  <StatusBadge status={step.status} />
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{step.detail}</p>
                <p className="font-mono text-xs text-muted-foreground/80">
                  $ {step.command}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {snapshot.badProof.firstError ? (
        <>
          <Separator />
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">假定理对照（证明的意义）</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  「已取消的订单还能被支付」——被 kernel 拒绝
                </CardTitle>
                <CardDescription>
                  业务规则写错不是测试挂掉，而是编译不过：目标被化简为 False。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={snapshot.badProof.firstError}
                  label="Bad/CancelledCanPay.lean"
                  className="border-dashed"
                />
                {snapshot.badProof.falseGoal ? (
                  <p className="mt-2 font-mono text-xs text-violet-600 dark:text-violet-400">
                    {snapshot.badProof.falseGoal}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </section>
        </>
      ) : null}
    </div>
  )
}
