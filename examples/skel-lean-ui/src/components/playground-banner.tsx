"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@innate/ui"

// 当验证台正在展示 Playground 生成的契约时显示的切换横幅。
export function PlaygroundBanner({
  domain,
  createdAt,
}: {
  domain: string | null
  createdAt: string
}) {
  const router = useRouter()
  const [resetting, setResetting] = useState(false)
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3">
      <p className="text-sm">
        当前展示 <b className="font-mono">{domain ?? "playground"}</b> —— 你在
        Playground 生成的契约（{new Date(createdAt).toLocaleString("zh-CN")}{" "}
        编译通过）。
      </p>
      <div className="flex items-center gap-2">
        <Link
          href="/playground"
          className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
        >
          返回 Playground
        </Link>
        <Button
          size="sm"
          variant="outline"
          disabled={resetting}
          onClick={async () => {
            setResetting(true)
            await fetch("/api/reset", { method: "POST" })
            router.refresh()
            setResetting(false)
          }}
        >
          {resetting ? "恢复中…" : "恢复基线演示"}
        </Button>
      </div>
    </div>
  )
}
