"use client"

import { usePathname, useRouter } from "next/navigation"
import { FileTextIcon, LogOutIcon, UserIcon } from "lucide-react"
import { Button, Separator, SidebarTrigger, ThemeSelector } from "@innate/ui"
import { getPageMeta } from "@/lib/spec-navigation"
import { useSession, signOut } from "@/lib/auth/auth-client"
import { toast } from "sonner"

export function SiteHeader() {
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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <div className="min-w-0">
          <h1 className="truncate text-base font-medium">{pageMeta.title}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
          {pageMeta.docHref ? (
            <a
              href={pageMeta.docHref}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
            >
              <FileTextIcon className="size-4" />
              对应文档
            </a>
          ) : null}
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <UserIcon className="size-4" />
                {session.user.name || session.user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOutIcon className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
