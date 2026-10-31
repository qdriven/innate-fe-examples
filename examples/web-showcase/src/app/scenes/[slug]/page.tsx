import type { ComponentType } from "react"
import { notFound } from "next/navigation"

import { ApprovalReviewScene } from "@/components/scenes/approval-review-scene"
import { DashboardScene } from "@/components/scenes/dashboard-scene"
import { IntegrationHealthScene } from "@/components/scenes/integration-health-scene"
import { PolicySettingsScene } from "@/components/scenes/policy-settings-scene"
import { RecordDetailScene } from "@/components/scenes/record-detail-scene"
import { ReportingWizardScene } from "@/components/scenes/reporting-wizard-scene"
import { WorkspaceListScene } from "@/components/scenes/workspace-list-scene"
import { ShowcaseDetailShell } from "@/components/showcase-detail-shell"
import { getRegistryEntry } from "@/lib/showcase-registry"

import { getSceneRouteBySlug, sceneRoutes } from "../routes"

const sceneBySlug: Record<string, ComponentType> = {
  "workspace-list": WorkspaceListScene,
  "record-detail": RecordDetailScene,
  "reporting-wizard": ReportingWizardScene,
  "approval-review": ApprovalReviewScene,
  "integration-health": IntegrationHealthScene,
  "policy-settings": PolicySettingsScene,
  dashboard: DashboardScene,
}

const missing = sceneRoutes.filter((route) => !sceneBySlug[route.slug])
if (missing.length > 0) {
  throw new Error(
    `Missing scene showcases for: ${missing.map((route) => route.slug).join(", ")}`
  )
}

export function generateStaticParams() {
  return sceneRoutes.map((route) => ({ slug: route.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const route = getSceneRouteBySlug(slug)
  return {
    title: route ? `${route.name} — Innate UI` : "Scene — Innate UI",
  }
}

export default async function ScenePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const Scene = sceneBySlug[slug]
  const entry = getRegistryEntry("scenes", slug)
  if (!Scene || !entry) notFound()

  return <ShowcaseDetailShell entry={entry} preview={<Scene />} />
}
