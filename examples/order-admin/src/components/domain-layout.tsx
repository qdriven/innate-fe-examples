import { Outlet } from "@tanstack/react-router"
import { Toaster } from "@innate/ui"

/** domain 内部布局：路由出口 + 自挂 Toaster（壳层当前没有统一挂载点）。 */
export function DomainLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="top-center" />
    </>
  )
}
