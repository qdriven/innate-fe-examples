import {
  ChartAreaIcon,
  FileBoxIcon,
  LayoutTemplateIcon,
  Rows3Icon,
  TableIcon,
} from "lucide-react"

import type { ShowcaseRoute } from "@/lib/showcase-catalog"

export const blockRoutes: ShowcaseRoute[] = [
  {
    slug: "scene-blocks",
    name: "Scene Blocks",
    description:
      "SceneIntro, MetricCards, InfoListCard, and TableCard — the L2 building blocks for ToB catalog pages.",
    layer: "blocks",
    icon: Rows3Icon,
  },
  {
    slug: "page-container",
    name: "PageContainer",
    description:
      "Next.js dashboard page shell with title, description, loading skeleton, and access gate.",
    layer: "blocks",
    icon: LayoutTemplateIcon,
  },
  {
    slug: "section-cards",
    name: "SectionCards",
    description:
      "KPI trend card row with badges and footers — common dashboard header metrics.",
    layer: "blocks",
    icon: FileBoxIcon,
  },
  {
    slug: "data-table",
    name: "DataTable",
    description:
      "Full-featured table with drag-to-reorder rows, column visibility, pagination, and a row detail drawer.",
    layer: "blocks",
    icon: TableIcon,
  },
  {
    slug: "chart-area-interactive",
    name: "ChartAreaInteractive",
    description:
      "Interactive area chart card with time-range toggle — total visitors over the past 3 months.",
    layer: "blocks",
    icon: ChartAreaIcon,
  },
]

export function getBlockRouteBySlug(slug: string) {
  return blockRoutes.find((route) => route.slug === slug)
}

export type BlockRoute = ShowcaseRoute & { layer: "blocks" }
