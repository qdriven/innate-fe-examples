import { Link, useRouterState } from "@tanstack/react-router"
import { NavSecondary } from "@innate/admin-composites/nav-secondary"
import { secondaryNavItems } from "../lib/spec-navigation"

/** tanstack 路由适配：共享 NavSecondary + TanStack Link。 */
export function AppNavSecondary({ className }: { className?: string }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <NavSecondary
      className={className}
      items={secondaryNavItems}
      pathname={pathname}
      renderLink={(item) => <Link to={item.to as never} />}
    />
  )
}

/** 兼容旧导出名 */
export { AppNavSecondary as NavSecondary }
