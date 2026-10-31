import { HomeIcon } from "lucide-react"

import { blockRoutes } from "@/app/blocks/routes"
import {
  COMPONENT_CATEGORIES,
  componentRoutes,
  type ComponentCategory,
} from "@/app/components/routes"
import { pageRoutes } from "@/app/pages/routes"
import { sceneRoutes } from "@/app/scenes/routes"
import {
  SHOWCASE_LAYERS,
  showcaseHref,
  type ShowcaseLayer,
  type ShowcaseRoute,
} from "@/lib/showcase-catalog"
import type { LucideIcon } from "lucide-react"

const PRIMITIVE_CATEGORY_LABELS: Record<ComponentCategory, string> = {
  layout: "Layout & structure",
  navigation: "Navigation",
  forms: "Forms & input",
  actions: "Actions",
  feedback: "Feedback",
  overlay: "Overlays",
  data: "Data display",
}

export interface SidebarNavGroup {
  key: string
  label: string
  /** Sort order among sibling submenu groups (e.g. primitive categories). */
  order: number
  defaultOpen?: boolean
  items: ShowcaseRoute[]
}

export interface MainMenuItem {
  id: ShowcaseLayer | "home"
  label: string
  icon: LucideIcon
  href?: string
}

export interface SubMenuGroup {
  key: string
  label: string
  order: number
  items: SubMenuItem[]
}

export interface SubMenuItem {
  slug: string
  name: string
  description: string
  href: string
  icon?: LucideIcon
  layer: ShowcaseLayer
}

function withResolvedOrder<T extends { order?: number }>(
  items: T[]
): Array<T & { order: number }> {
  return items
    .map((item, index) => ({
      ...item,
      order: item.order ?? index,
    }))
    .sort((left, right) => left.order - right.order)
}

function primitiveGroups(): SidebarNavGroup[] {
  return COMPONENT_CATEGORIES.map((category, categoryIndex) => ({
    key: category,
    label: PRIMITIVE_CATEGORY_LABELS[category],
    order: categoryIndex,
    defaultOpen: category === "layout" || category === "forms",
    items: withResolvedOrder(
      componentRoutes
        .filter((route) => route.category === category)
        .map((route) => ({
          slug: route.slug,
          name: route.name,
          description: route.description,
          layer: "primitives" as const,
          icon: route.icon,
          group: category,
          order: route.order,
        }))
    ),
  }))
}

function layerRoutes(layer: ShowcaseLayer): ShowcaseRoute[] {
  switch (layer) {
    case "blocks":
      return blockRoutes
    case "scenes":
      return sceneRoutes
    case "pages":
      return pageRoutes
    default:
      return []
  }
}

const LAYER_PATH_PREFIXES: Record<ShowcaseLayer, string> = {
  primitives: "/components",
  blocks: "/blocks",
  scenes: "/scenes",
  pages: "/pages",
}

export function getActiveLayerFromPathname(
  pathname: string
): ShowcaseLayer | "home" {
  for (const layer of SHOWCASE_LAYERS) {
    const prefix = LAYER_PATH_PREFIXES[layer.id]
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return layer.id
    }
  }
  return "home"
}

function getLayerDefaultHref(layer: ShowcaseLayer): string {
  const subMenu = getSubMenu(layer)
  const firstGroup = subMenu[0]
  const firstItem = firstGroup?.items[0]
  return firstItem?.href ?? "/"
}

export function getMainMenu(): MainMenuItem[] {
  return [
    { id: "home", label: "Overview", icon: HomeIcon, href: "/" },
    ...SHOWCASE_LAYERS.map((layer) => ({
      id: layer.id,
      label: layer.label,
      icon: layer.icon,
      href: getLayerDefaultHref(layer.id),
    })),
  ]
}

function routeToSubMenuItem(route: ShowcaseRoute): SubMenuItem {
  return {
    slug: route.slug,
    name: route.name,
    description: route.description,
    href: showcaseHref(route),
    icon: route.icon,
    layer: route.layer,
  }
}

export function getSubMenu(layer: ShowcaseLayer): SubMenuGroup[] {
  switch (layer) {
    case "primitives":
      return primitiveGroups().map((group) => ({
        key: group.key,
        label: group.label,
        order: group.order,
        items: group.items.map(routeToSubMenuItem),
      }))
    case "blocks":
    case "scenes":
    case "pages": {
      const meta = SHOWCASE_LAYERS.find((entry) => entry.id === layer)
      if (!meta) {
        throw new Error(`Unknown showcase layer: ${layer}`)
      }
      return [
        {
          key: layer,
          label: meta.label,
          order: 0,
          items: withResolvedOrder(layerRoutes(layer)).map(routeToSubMenuItem),
        },
      ]
    }
  }
}

function singleLayerGroup(layer: ShowcaseLayer): SidebarNavGroup {
  const meta = SHOWCASE_LAYERS.find((entry) => entry.id === layer)
  if (!meta) {
    throw new Error(`Unknown showcase layer: ${layer}`)
  }

  return {
    key: layer,
    label: meta.label,
    order: 0,
    defaultOpen: layer === "scenes",
    items: withResolvedOrder(layerRoutes(layer)),
  }
}

/**
 * Sidebar navigation tree derived from route/registry config.
 *
 * - Primitive **category** order: `COMPONENT_CATEGORIES` in `components/routes.ts`
 * - Item order within a submenu: optional `order` on each route entry
 */
export function getSidebarNavGroups(): SidebarNavGroup[] {
  const groups: SidebarNavGroup[] = []

  for (const layer of SHOWCASE_LAYERS) {
    if (layer.id === "primitives") {
      groups.push(...primitiveGroups())
      continue
    }
    groups.push(singleLayerGroup(layer.id))
  }

  return groups
}

export function getSidebarEntryCount() {
  return getSidebarNavGroups().reduce(
    (total, group) => total + group.items.length,
    0
  )
}
