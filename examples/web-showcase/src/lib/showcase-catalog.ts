import type { LucideIcon } from "lucide-react"
import {
  BlocksIcon,
  LayoutDashboardIcon,
  LayoutPanelTopIcon,
  LayersIcon,
} from "lucide-react"

export type ShowcaseLayer = "primitives" | "blocks" | "scenes" | "pages"

export interface ShowcaseRoute {
  slug: string
  name: string
  description: string
  layer: ShowcaseLayer
  icon: LucideIcon
  /** Sub-group label inside the sidebar layer (e.g. primitive category). */
  group?: string
  /**
   * Sidebar sort order within the same submenu group — lower numbers appear first.
   * Omit to keep declaration order in the routes array.
   */
  order?: number
}

export function showcaseHref(route: ShowcaseRoute) {
  switch (route.layer) {
    case "primitives":
      return `/components/${route.slug}`
    case "blocks":
      return `/blocks/${route.slug}`
    case "scenes":
      return `/scenes/${route.slug}`
    case "pages":
      return `/pages/${route.slug}`
  }
}

export const SHOWCASE_LAYERS: Array<{
  id: ShowcaseLayer
  label: string
  icon: LucideIcon
}> = [
  { id: "primitives", label: "Primitives", icon: LayersIcon },
  { id: "blocks", label: "Composites", icon: BlocksIcon },
  { id: "scenes", label: "Scenes", icon: LayoutDashboardIcon },
  { id: "pages", label: "Pages", icon: LayoutPanelTopIcon },
]

export const LAYER_BLURBS: Record<ShowcaseLayer, string> = {
  primitives:
    "@innate/ui base components — variants, sizes, and slot contracts.",
  blocks:
    "L2 composites — scene blocks, page shells, and KPI rows from admin apps.",
  scenes:
    "L3 benchmark ToB scenes — full page compositions from admin-nextjs demos.",
  pages: "Auth and marketing-style page layouts without backend dependencies.",
}
