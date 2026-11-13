import { Outlet, useRouterState } from "@tanstack/react-router"
import { ThemeSelector, Toaster, cn } from "@innate/ui"
import { AppLink } from "../lib/routing"
import { withBasePath } from "../lib/base-path"

/** 域内顶栏导航：href 为域内相对路径（AppLink 负责补 BASE_PATH）。 */
const NAV_ITEMS = [
  { href: "/projects", label: "项目" },
  { href: "/issues", label: "任务" },
  { href: "/users", label: "用户" },
] as const

/** 路径匹配：精确命中或命中其子路径（同壳 shell-nav 的 pathMatches）。 */
function pathMatches(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`)
}

/**
 * domain 内部布局：域内顶栏（左场景导航 + 右主题切换）+ 路由出口 +
 * 自挂 Toaster（壳层当前没有统一挂载点）。
 * ThemeProvider 已由壳 / standalone 入口挂载，这里不再包一层。
 */
export function DomainLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <nav aria-label="域内导航" className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathMatches(pathname, withBasePath(item.href))
            return (
              <AppLink
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                data-active={active}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                  "data-[active=true]:bg-accent",
                  "data-[active=true]:font-medium",
                  "data-[active=true]:text-foreground"
                )}
              >
                {item.label}
              </AppLink>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
        </div>
      </header>
      <Outlet />
      <Toaster position="top-center" />
    </>
  )
}
