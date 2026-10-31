"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@innate/ui"

/**
 * 管理端共享壳：SidebarProvider + AppSidebar + SiteHeader + main。
 * 页面平铺在 src/app/<feature>/page.tsx 后，需要壳的页面在自身 page.tsx
 * 内用 <DashboardShell> 包裹（auth/api 等无壳页面不包裹）。
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
