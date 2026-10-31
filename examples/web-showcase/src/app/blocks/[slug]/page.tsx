import type { ComponentType } from "react"
import { notFound } from "next/navigation"

import { ChartAreaInteractiveShowcase } from "@/components/composites/chart-area-interactive-showcase"
import { DataTableShowcase } from "@/components/composites/data-table-showcase"
import { PageContainerShowcase } from "@/components/composites/page-container-showcase"
import { SceneBlocksShowcase } from "@/components/composites/scene-blocks-showcase"
import { SectionCardsShowcase } from "@/components/composites/section-cards"
import { ShowcaseDetailShell } from "@/components/showcase-detail-shell"
import { getRegistryEntry } from "@/lib/showcase-registry"

import { blockRoutes, getBlockRouteBySlug } from "../routes"

const blockBySlug: Record<string, ComponentType> = {
  "scene-blocks": SceneBlocksShowcase,
  "page-container": PageContainerShowcase,
  "section-cards": SectionCardsShowcase,
  "data-table": DataTableShowcase,
  "chart-area-interactive": ChartAreaInteractiveShowcase,
}

const missing = blockRoutes.filter((route) => !blockBySlug[route.slug])
if (missing.length > 0) {
  throw new Error(
    `Missing block showcases for: ${missing.map((route) => route.slug).join(", ")}`
  )
}

export function generateStaticParams() {
  return blockRoutes.map((route) => ({ slug: route.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const route = getBlockRouteBySlug(slug)
  return {
    title: route ? `${route.name} — Innate UI` : "Block — Innate UI",
  }
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const Block = blockBySlug[slug]
  const entry = getRegistryEntry("blocks", slug)
  if (!Block || !entry) notFound()

  return <ShowcaseDetailShell entry={entry} preview={<Block />} />
}
