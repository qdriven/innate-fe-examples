import { Outlet } from "@tanstack/react-router"
import { Toaster } from "sonner"
import { SpecPageShell } from "@innate/admin-composites/spec-page-shell"
import { AppSidebar } from "./app-sidebar"
import { FacilityScopeProvider } from "./facility-scope"
import { SiteHeader } from "./site-header"

/**
 * domain 内部壳：二级 sidebar + header。
 * 宿主 AppShell 只负责切插件；场景导航仍归本 domain。
 * 自挂 Toaster（壳层当前没有统一挂载点，与 order-admin 同法）。
 * shadcn Sidebar 默认 `fixed` 到视口，嵌在壳里时由 [data-admin-layout] 钉到本层。
 */
export function AdminLayout() {
  return (
    <FacilityScopeProvider>
      <div
        data-admin-layout
        className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <SpecPageShell
          className="h-full min-h-0!"
          contentWidth="wide"
          sidebar={<AppSidebar variant="inset" />}
          header={<SiteHeader />}
        >
          <Outlet />
        </SpecPageShell>
        <Toaster position="top-center" />
      </div>
    </FacilityScopeProvider>
  )
}
