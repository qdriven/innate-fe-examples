import { Outlet, useRouterState } from "@tanstack/react-router"
import {
  Calendar,
  CheckSquare,
  FolderGit2,
  Hammer,
  Lightbulb,
} from "lucide-react"
import { DomainPageLayout } from "@innate/ui"
import { BASE_PATH, withBasePath } from "../lib/base-path"

const NAV = [
  { id: "home", label: "Overview", href: BASE_PATH, icon: Hammer },
  { id: "projects", label: "Projects", href: withBasePath("/projects"), icon: FolderGit2 },
  { id: "issues", label: "Issues", href: withBasePath("/issues"), icon: CheckSquare },
  { id: "weekly", label: "Weekly", href: withBasePath("/weekly"), icon: Calendar },
  { id: "insights", label: "Insights", href: withBasePath("/insights"), icon: Lightbulb },
] as const

function activeId(pathname: string): string | undefined {
  const ranked = [...NAV].sort((a, b) => b.href.length - a.href.length)
  return ranked.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    ?.id
}

export function DomainLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <DomainPageLayout
      title="Making"
      items={NAV}
      activeId={activeId(pathname)}
    >
      <Outlet />
    </DomainPageLayout>
  )
}
