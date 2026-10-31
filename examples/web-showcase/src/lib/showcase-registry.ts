import { blockRoutes } from "@/app/blocks/routes"
import { componentRoutes } from "@/app/components/routes"
import { pageRoutes } from "@/app/pages/routes"
import { sceneRoutes } from "@/app/scenes/routes"
import type { ShowcaseLayer } from "@/lib/showcase-catalog"
import { slugToPascal } from "@/lib/slug-to-pascal"

export interface ShowcaseRegistryEntry {
  slug: string
  name: string
  description: string
  layer: ShowcaseLayer
  categoryLabel: string
  sourcePath: string
  importLine: string
}

const PRIMITIVE_IMPORT_OVERRIDES: Record<string, string> = {
  sonner: 'import { Toaster } from "@innate/ui"',
}

// Note: SpecPageShell (@innate/admin-composites/spec-page-shell) 故意不上注册表 —
// 它是含 SidebarProvider/SidebarInset 的整页布局壳，不适合嵌入 showcase 详情页预览。
// 用法参考 domains/admin-tanstack 的 AdminLayout（src/components/admin-layout.tsx）：
//   <SpecPageShell sidebar={<AppSidebar variant="inset" />} header={<SiteHeader />}>
const BLOCK_REGISTRY: Record<
  string,
  Pick<ShowcaseRegistryEntry, "sourcePath" | "importLine">
> = {
  "scene-blocks": {
    sourcePath: "src/components/composites/scene-blocks-showcase.tsx",
    importLine:
      'import { SceneIntro, MetricCards, InfoListCard, TableCard } from "@innate/scene-catalog/scene-blocks"',
  },
  "page-container": {
    sourcePath: "src/components/composites/page-container-showcase.tsx",
    importLine:
      'import PageContainer from "@innate/admin-composites/page-container"',
  },
  "section-cards": {
    sourcePath: "src/components/composites/section-cards.tsx",
    importLine:
      'import { SectionCards } from "@innate/admin-composites/section-cards"',
  },
  "data-table": {
    sourcePath: "src/components/composites/data-table-showcase.tsx",
    importLine:
      'import { DataTable } from "@innate/admin-composites/data-table"',
  },
  "chart-area-interactive": {
    sourcePath: "src/components/composites/chart-area-interactive-showcase.tsx",
    importLine:
      'import { ChartAreaInteractive } from "@innate/admin-composites/chart-area-interactive"',
  },
}

const PAGE_REGISTRY: Record<
  string,
  Pick<ShowcaseRegistryEntry, "sourcePath" | "importLine">
> = {
  "sign-in": {
    sourcePath: "src/components/pages/sign-in-page.tsx",
    importLine: "// Auth layout demo — copy patterns from this showcase file",
  },
  "sign-up": {
    sourcePath: "src/components/pages/sign-up-page.tsx",
    importLine: "// Auth layout demo — copy patterns from this showcase file",
  },
}

function primitiveImportLine(slug: string) {
  if (PRIMITIVE_IMPORT_OVERRIDES[slug]) {
    return PRIMITIVE_IMPORT_OVERRIDES[slug]
  }
  return `import { ${slugToPascal(slug)} } from "@innate/ui"`
}

function buildPrimitiveEntries(): ShowcaseRegistryEntry[] {
  return componentRoutes.map((route) => ({
    slug: route.slug,
    name: route.name,
    description: route.description,
    layer: "primitives",
    categoryLabel: route.category,
    sourcePath: `src/components/blocks/${route.slug}-demo.tsx`,
    importLine: primitiveImportLine(route.slug),
  }))
}

function buildBlockEntries(): ShowcaseRegistryEntry[] {
  return blockRoutes.map((route) => {
    const meta = BLOCK_REGISTRY[route.slug]
    if (!meta) {
      throw new Error(`Missing block registry metadata for: ${route.slug}`)
    }
    return {
      slug: route.slug,
      name: route.name,
      description: route.description,
      layer: "blocks",
      categoryLabel: "Composite · L2",
      ...meta,
    }
  })
}

function buildSceneEntries(): ShowcaseRegistryEntry[] {
  return sceneRoutes.map((route) => ({
    slug: route.slug,
    name: route.name,
    description: route.description,
    layer: "scenes",
    categoryLabel: "Scene · L3",
    sourcePath: `src/components/scenes/${route.slug}-scene.tsx`,
    importLine:
      "// Scene composition — see admin-nextjs dashboard pages for production wiring",
  }))
}

function buildPageEntries(): ShowcaseRegistryEntry[] {
  return pageRoutes.map((route) => {
    const meta = PAGE_REGISTRY[route.slug]
    if (!meta) {
      throw new Error(`Missing page registry metadata for: ${route.slug}`)
    }
    return {
      slug: route.slug,
      name: route.name,
      description: route.description,
      layer: "pages",
      categoryLabel: "Page layout",
      ...meta,
    }
  })
}

const registryIndex = new Map<string, ShowcaseRegistryEntry>()

for (const entry of [
  ...buildPrimitiveEntries(),
  ...buildBlockEntries(),
  ...buildSceneEntries(),
  ...buildPageEntries(),
]) {
  registryIndex.set(`${entry.layer}:${entry.slug}`, entry)
}

export const showcaseRegistry = [...registryIndex.values()]

export function getRegistryEntry(layer: ShowcaseLayer, slug: string) {
  return registryIndex.get(`${layer}:${slug}`)
}
