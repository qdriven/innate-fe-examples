"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

import { CodeBlock } from "@/components/code-block"
import { StatusBadge } from "@/components/status-badge"
import type { PipelineResult } from "@/lib/pipeline-types"

interface Example {
  key: string
  title: string
  description: string
}

interface GenerateResponse {
  engine: "llm" | "heuristic"
  skel: string
  notes: string[]
  error?: string
}

export function PlaygroundFlow({
  examples,
  llmAvailable,
  llmReason,
}: {
  examples: Example[]
  llmAvailable: boolean
  llmReason: string
}) {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [skel, setSkel] = useState("")
  const [engine, setEngine] = useState<"llm" | "heuristic" | null>(null)
  const [notes, setNotes] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [compiling, setCompiling] = useState(false)
  const [result, setResult] = useState<PipelineResult | null>(null)

  async function generate() {
    setGenerating(true)
    setResult(null)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ description }),
      })
      const data = (await response.json()) as GenerateResponse
      if (!response.ok) {
        setNotes([data.error ?? "生成失败"])
        return
      }
      setSkel(data.skel)
      setEngine(data.engine)
      setNotes(data.notes ?? [])
    } catch (error) {
      setNotes([`请求失败：${String(error)}`])
    } finally {
      setGenerating(false)
    }
  }

  async function compile() {
    setCompiling(true)
    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ skel, description, engine }),
      })
      const data = (await response.json()) as {
        result?: PipelineResult
        error?: string
      }
      if (data.result) setResult(data.result)
      else setNotes([data.error ?? "编译失败"])
    } catch (error) {
      setNotes([`请求失败：${String(error)}`])
    } finally {
      setCompiling(false)
    }
  }

  async function resetBaseline() {
    await fetch("/api/reset", { method: "POST" })
    router.refresh()
  }

  const hasSkel = skel.trim().length > 0
  const compileOk = result?.ok === true

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Playground：从一句话到被验证的契约
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          用自然语言描述一个业务领域 → 生成 .skel 契约（可编辑）→
          真实流水线校验并生成 Lean / Go 代码 →
          验证台各页面即刻展示你的契约。LLM 通道
          {llmAvailable ? "已就绪" : "未启用（退回本地启发式引擎）"}。
          {!llmAvailable && llmReason ? `（${llmReason}）` : ""}
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">第一步：描述你的领域</CardTitle>
          <CardDescription>
            试试示例，或用自己的话描述实体、字段和操作。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <Button
                key={example.key}
                variant="outline"
                size="sm"
                onClick={() => setDescription(example.description)}
              >
                {example.title}
              </Button>
            ))}
          </div>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="例如：库存系统：商品有名称、单价、库存数量；支持创建、查询、更新库存……"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={generate}
              disabled={generating || description.trim().length < 4}
            >
              {generating ? "生成中…" : "生成 Skel 契约"}
            </Button>
            {engine ? (
              <Badge variant={engine === "llm" ? "default" : "secondary"}>
                {engine === "llm"
                  ? "LLM 生成（已过 skelc 校验）"
                  : "本地启发式生成"}
              </Badge>
            ) : null}
          </div>
          {notes.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
              {notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      {hasSkel ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              第二步：检查 / 编辑生成的契约
            </CardTitle>
            <CardAction>
              <Button
                variant="outline"
                size="sm"
                onClick={generate}
                disabled={generating}
              >
                重新生成
              </Button>
            </CardAction>
            <CardDescription>
              编辑器里的内容就是流水线输入：domain
              名、字段类型、方法签名都可以改。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={skel}
              onChange={(event) => setSkel(event.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full rounded-lg border bg-muted/40 px-3 py-2 font-mono text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button onClick={compile} disabled={compiling}>
              {compiling ? "验证中…" : "运行验证流水线"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">第三步：流水线结果</CardTitle>
            <CardAction>
              <StatusBadge status={compileOk ? "passed" : "failed"} />
            </CardAction>
            <CardDescription>
              {compileOk
                ? "契约通过校验、Lean 类型通过 kernel 编译——验证台已切换为展示你的契约。"
                : "流水线未完全通过：根据下面的诊断修改第二步的契约后重试。"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.safetyError ? (
              <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
                {result.safetyError}
              </p>
            ) : null}
            <div className="space-y-2">
              {result.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                  <StatusBadge status={step.status} />
                </div>
              ))}
            </div>
            {result.check.diagnostics.length > 0 ? (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  skelc 诊断：
                </p>
                {result.check.diagnostics.slice(0, 8).map((d, i) => (
                  <p
                    key={i}
                    className="font-mono text-xs text-red-600 dark:text-red-400"
                  >
                    [{d.severity}] {d.message}
                  </p>
                ))}
              </div>
            ) : null}
            {result.lean.files.map((file) => (
              <CodeBlock
                key={file.path}
                code={file.content}
                label={file.path}
              />
            ))}
            {compileOk ? (
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => router.push("/contracts")}>
                  在契约目录查看
                </Button>
                <Button variant="outline" onClick={() => router.push("/code")}>
                  查看四端代码
                </Button>
                <Button variant="ghost" onClick={resetBaseline}>
                  恢复基线演示
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
