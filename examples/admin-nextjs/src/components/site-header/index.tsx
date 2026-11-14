"use client"

import { usePathname } from "next/navigation"
import { SiteHeader } from "@innate/admin-composites/site-header"
import { getPageMeta } from "@/lib/spec-navigation"
import { useSession, signOut } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { LogOutIcon, UserIcon } from "lucide-react"
import { Button } from "@innate/ui"
import { toast } from "sonner"

/** nextjs 顶栏：共享 SiteHeader + 页标题 + 登录态。 */
export function AppSiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const pageMeta = getPageMeta(pathname)
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut()
    toast.success("Signed out")
    router.push("/auth/sign-in")
    router.refresh()
  }

  return (
    <SiteHeader
      title={pageMeta.title}
      docHref={pageMeta.docHref}
      trailing={
        session?.user ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <UserIcon data-icon className="size-4" />
              {session.user.name || session.user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              aria-label="退出登录"
            >
              <LogOutIcon data-icon className="size-4" />
            </Button>
          </div>
        ) : null
      }
    />
  )
}

export { AppSiteHeader as SiteHeader }
