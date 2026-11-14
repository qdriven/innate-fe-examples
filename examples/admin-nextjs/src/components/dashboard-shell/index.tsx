"use client"

import { Toaster } from "sonner"
import { SpecPageShell } from "@innate/admin-composites/spec-page-shell"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSiteHeader } from "@/components/site-header"

/**
 * 管理端共享壳：SpecPageShell（与 admin-tanstack 同一实现）+ 本 app 的
 * sidebar/header 适配。需要壳的页面在 page.tsx 内用 <DashboardShell> 包裹。
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SpecPageShell
        className="h-full min-h-0!"
        contentWidth="wide"
        sidebar={<AppSidebar variant="inset" />}
        header={<AppSiteHeader />}
      >
        {children}
      </SpecPageShell>
      <Toaster position="top-center" />
    </>
  )
}
