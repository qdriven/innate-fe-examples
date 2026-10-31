import { CodeView } from "@/components/code-view"
import { PlaygroundBanner } from "@/components/playground-banner"
import { getActiveSnapshot } from "@/lib/view"

export const dynamic = "force-dynamic"

export default async function CodePage() {
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
        <h1 className="text-2xl font-semibold tracking-tight">代码对照</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          同一份 .skel 契约在多个视角下的真实代码：契约源、生成的 Lean
          类型（skel2lean）、 手写的 Lean 定理、生成的 Go
          类型与回流的性质测试。文件内容来自流水线产物的直接读取。
        </p>
      </section>
      <CodeView sources={snapshot.sources} />
    </div>
  )
}
