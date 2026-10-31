import { createRoute, redirect } from "@tanstack/react-router"
import type { AnyRoute } from "@tanstack/react-router"
import type { ReactElement } from "react"
import {
  parsePluginManifest,
  resolveNavItems,
  type DomainPluginManifest,
} from "@innate/plugin-protocol"
import { createWebDomain } from "@innate/web-domain"
import pluginManifestJson from "../plugin.json"
import { AdminLayout } from "./components/admin-layout"
import { BASE_PATH, DOMAIN_ID } from "./lib/base-path"
import { ApprovalReviewPage } from "./pages/approval-review/page"
import { CorePage } from "./pages/core/page"
import { SceneDocPage } from "./pages/docs/[sceneId]/page"
import { DomainPacksPage } from "./pages/domain-packs/page"
import { GovernancePage } from "./pages/governance/page"
import { HelpPage } from "./pages/help/page"
import { IntegrationHealthPage } from "./pages/integration-health/page"
import { PatternsPage } from "./pages/patterns/page"
import { PolicySettingsPage } from "./pages/policy-settings/page"
import { RecordDetailPage } from "./pages/record-detail/page"
import { ReportingWizardPage } from "./pages/reporting-wizard/page"
import { ScenesPage } from "./pages/scenes/page"
import { SettingsPage } from "./pages/settings/page"
import { SpecificDashboardPage } from "./pages/specific/dashboard/page"
import { SpecificScenePage } from "./pages/specific/[sceneId]/page"
import { WorkspaceListPage } from "./pages/workspace-list/page"

function pageRoute(
  parent: AnyRoute,
  path: string,
  component: () => ReactElement | null
) {
  return createRoute({
    getParentRoute: () => parent,
    path,
    component,
  })
}

/**
 * 外观（nav / homeTile）以 plugin.json 为唯一事实源：
 * innate.plugin.v1「代码管路由，清单管外观」。壳侧栏只挂这一条入口，
 * 不做子菜单；场景页仍由 domain 内部的 AdminLayout 导航。
 */
const parsedManifest = parsePluginManifest(
  pluginManifestJson,
  "domains/admin-tanstack/plugin.json"
)
if (parsedManifest.kind !== "domain") {
  throw new Error('domains/admin-tanstack/plugin.json: kind 必须是 "domain"')
}
const pluginManifest: DomainPluginManifest = parsedManifest

/** 协议 nav（path 可选）→ 壳 navItems capability（path 必填，缺省落到 domain 根）。 */
const navCapabilities = resolveNavItems(pluginManifest.ui).map((item) => ({
  label: item.label,
  path: item.path ?? BASE_PATH,
  ...(item.icon !== undefined ? { icon: item.icon } : {}),
  ...(item.order !== undefined ? { order: item.order } : {}),
  ...(item.group !== undefined ? { group: item.group } : {}),
}))

/**
 * admin-tanstack domain：原独立 TanStack Start app，现按轨道 A 挂到宿主 outlet。
 * 壳只切插件；场景 sidebar / header 由 AdminLayout 提供。
 */
export const webDomain = createWebDomain(DOMAIN_ID)
  .addRoute("app", (parent: AnyRoute) => {
    const layout = createRoute({
      getParentRoute: () => parent,
      id: "_admin-tanstack",
      component: AdminLayout,
    })

    const index = createRoute({
      getParentRoute: () => layout,
      path: BASE_PATH,
      beforeLoad: () => {
        throw redirect({ href: `${BASE_PATH}/scenes` })
      },
    })

    const dashboardAlias = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/dashboard`,
      beforeLoad: () => {
        throw redirect({ href: `${BASE_PATH}/specific/dashboard` })
      },
    })

    const specificScene = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/specific/$sceneId`,
      component: function SpecificSceneRoute() {
        const { sceneId } = specificScene.useParams() as { sceneId: string }
        return <SpecificScenePage sceneId={sceneId} />
      },
    })

    const sceneDoc = createRoute({
      getParentRoute: () => layout,
      path: `${BASE_PATH}/docs/$sceneId`,
      component: function SceneDocRoute() {
        const { sceneId } = sceneDoc.useParams() as { sceneId: string }
        return <SceneDocPage sceneId={sceneId} />
      },
    })

    return layout.addChildren([
      index,
      pageRoute(layout, `${BASE_PATH}/scenes`, ScenesPage),
      pageRoute(layout, `${BASE_PATH}/core`, CorePage),
      pageRoute(layout, `${BASE_PATH}/patterns`, PatternsPage),
      pageRoute(layout, `${BASE_PATH}/settings`, SettingsPage),
      pageRoute(layout, `${BASE_PATH}/domain-packs`, DomainPacksPage),
      pageRoute(layout, `${BASE_PATH}/governance`, GovernancePage),
      pageRoute(layout, `${BASE_PATH}/help`, HelpPage),
      pageRoute(layout, `${BASE_PATH}/workspace-list`, WorkspaceListPage),
      pageRoute(layout, `${BASE_PATH}/record-detail`, RecordDetailPage),
      pageRoute(layout, `${BASE_PATH}/reporting-wizard`, ReportingWizardPage),
      pageRoute(layout, `${BASE_PATH}/approval-review`, ApprovalReviewPage),
      pageRoute(
        layout,
        `${BASE_PATH}/integration-health`,
        IntegrationHealthPage
      ),
      pageRoute(layout, `${BASE_PATH}/policy-settings`, PolicySettingsPage),
      pageRoute(
        layout,
        `${BASE_PATH}/specific/dashboard`,
        SpecificDashboardPage
      ),
      specificScene,
      sceneDoc,
      dashboardAlias,
    ] as never) as unknown as AnyRoute
  })
  .addCapability("navItems", navCapabilities)
  .addCapability("homeTile", pluginManifest.ui?.homeTile)
  .build()
