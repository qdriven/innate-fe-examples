"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { cn } from "@innate/ui"

const NAV_ITEMS = [
  { href: "/", label: "总览" },
  { href: "/playground", label: "Playground" },
  { href: "/contracts", label: "契约目录" },
  { href: "/rules", label: "业务规则" },
  { href: "/evolution", label: "变更影响" },
  { href: "/code", label: "代码对照" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [generatedAt, setGeneratedAt] = useState<string>("")
  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then((data: { snapshot: { generatedAt: string } }) =>
        setGeneratedAt(data.snapshot.generatedAt)
      )
      .catch(() => setGeneratedAt(""))
  }, [])
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              SL
            </span>
            Skel × Lean 契约验证台
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t py-6">
        <p className="mx-auto w-full max-w-5xl px-4 text-xs text-muted-foreground">
          数据采集自真实流水线（skelc · skel2lean · lean · go test）
          {generatedAt
            ? ` · 快照时间 ${new Date(generatedAt).toLocaleString("zh-CN")}`
            : ""}
        </p>
      </footer>
    </div>
  )
}
