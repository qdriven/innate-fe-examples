import { PlaygroundBanner } from "@/components/playground-banner"
import { ContractsView } from "@/components/contracts-view"
import { getActiveSnapshot } from "@/lib/view"

export const dynamic = "force-dynamic"

export default async function ContractsPage() {
  const { snapshot, playground } = await getActiveSnapshot()
  return (
    <div className="space-y-6">
      {playground ? (
        <PlaygroundBanner
          domain={playground.result.domain}
          createdAt={playground.createdAt}
        />
      ) : null}
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">契约目录</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          限界上下文（DDD bounded context）的全部声明，采集自{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">
            skelc schema snapshot
          </code>{" "}
          的实时输出。带 pub 标记的声明构成对其他上下文开放的公开契约。
        </p>
      </section>
      <ContractsView domains={snapshot.domains} />
    </div>
  )
}
