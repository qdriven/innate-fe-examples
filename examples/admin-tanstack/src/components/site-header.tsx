import { useRouterState } from "@tanstack/react-router"
import { FileTextIcon } from "lucide-react"
import { Button, Separator, SidebarTrigger, ThemeSelector } from "@innate/ui"
import { SceneInfoDialog } from "./scene-info-sheet"
import { getPageMeta } from "../lib/spec-navigation"

export function SiteHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const pageMeta = getPageMeta(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <div className="min-w-0 flex-1">
          <h1
            className="truncate text-base font-medium"
            title={pageMeta.title}
          >
            {pageMeta.title}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSelector />
          {pageMeta.sceneId ? (
            <SceneInfoDialog pageMeta={pageMeta} />
          ) : pageMeta.docHref ? (
            <Button
              size="sm"
              variant="outline"
              render={
                <a
                  href={pageMeta.docHref}
                  target="_blank"
                  rel="noreferrer noopener"
                />
              }
            >
              <FileTextIcon data-icon />
              对应文档
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
