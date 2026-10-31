import type { Metadata } from "next"

import { AppShell } from "@/components/app-shell"
import { ThemeProvider } from "@/components/theme-provider"

import "@fontsource-variable/inter"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "Skel × Lean 契约验证台",
  description:
    "Skel 契约与 Lean 4 定理证明的整合演示：契约目录、业务规则卡片、变更影响与四端代码对照。",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
