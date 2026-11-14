import { useRouterState } from "@tanstack/react-router"
import { SiteHeader } from "@innate/admin-composites/site-header"
import { SceneInfoDialog } from "./scene-info-sheet"
import { getPageMeta } from "../lib/spec-navigation"

/** tanstack 顶栏：共享 SiteHeader + 场景说明弹框。 */
export function AppSiteHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const pageMeta = getPageMeta(pathname)

  return (
    <SiteHeader
      title={pageMeta.title}
      docHref={pageMeta.sceneId ? undefined : pageMeta.docHref}
      renderDocAction={
        pageMeta.sceneId
          ? () => <SceneInfoDialog pageMeta={pageMeta} />
          : undefined
      }
    />
  )
}

export { AppSiteHeader as SiteHeader }
