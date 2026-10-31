import {
  CheckSquareIcon,
  ClipboardListIcon,
  FileSearchIcon,
  LayoutDashboardIcon,
  PlugIcon,
  SettingsIcon,
  TableIcon,
} from "lucide-react"

import type { ShowcaseRoute } from "@/lib/showcase-catalog"

export const sceneRoutes: ShowcaseRoute[] = [
  {
    slug: "workspace-list",
    name: "Workspace List",
    description:
      "Filter bar, batch actions, KPI row, and data table — list-centric ToB workspace.",
    layer: "scenes",
    icon: TableIcon,
  },
  {
    slug: "record-detail",
    name: "Record Detail",
    description:
      "Summary cards, risk panel, and audit timeline for single-record reading flows.",
    layer: "scenes",
    icon: FileSearchIcon,
  },
  {
    slug: "reporting-wizard",
    name: "Reporting Wizard",
    description:
      "Step badges, form step body, and pre-submit validation checklist.",
    layer: "scenes",
    icon: ClipboardListIcon,
  },
  {
    slug: "approval-review",
    name: "Approval Review",
    description:
      "Diff table, review context, and decision action bar for approval flows.",
    layer: "scenes",
    icon: CheckSquareIcon,
  },
  {
    slug: "integration-health",
    name: "Integration Health",
    description:
      "Connector KPIs and status table for sync monitoring and ops dashboards.",
    layer: "scenes",
    icon: PlugIcon,
  },
  {
    slug: "policy-settings",
    name: "Policy Settings",
    description:
      "Org-level policy toggles and effective configuration summary.",
    layer: "scenes",
    icon: SettingsIcon,
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    description:
      "SectionCards KPI row plus chart and recent transactions — admin home pattern.",
    layer: "scenes",
    icon: LayoutDashboardIcon,
  },
]

export function getSceneRouteBySlug(slug: string) {
  return sceneRoutes.find((route) => route.slug === slug)
}

export type SceneRoute = ShowcaseRoute & { layer: "scenes" }
