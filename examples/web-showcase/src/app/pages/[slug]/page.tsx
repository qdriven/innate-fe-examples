import type { ComponentType } from "react"
import { notFound } from "next/navigation"

import { SignInPageDemo } from "@/components/pages/sign-in-page"
import { SignUpPageDemo } from "@/components/pages/sign-up-page"
import { ShowcaseDetailShell } from "@/components/showcase-detail-shell"
import { getRegistryEntry } from "@/lib/showcase-registry"

import { getPageRouteBySlug, pageRoutes } from "../routes"

const pageBySlug: Record<string, ComponentType> = {
  "sign-in": SignInPageDemo,
  "sign-up": SignUpPageDemo,
}

const missing = pageRoutes.filter((route) => !pageBySlug[route.slug])
if (missing.length > 0) {
  throw new Error(
    `Missing page showcases for: ${missing.map((route) => route.slug).join(", ")}`
  )
}

export function generateStaticParams() {
  return pageRoutes.map((route) => ({ slug: route.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const route = getPageRouteBySlug(slug)
  return {
    title: route ? `${route.name} — Innate UI` : "Page — Innate UI",
  }
}

export default async function ShowcasePageRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const Page = pageBySlug[slug]
  const entry = getRegistryEntry("pages", slug)
  if (!Page || !entry) notFound()

  return <ShowcaseDetailShell entry={entry} preview={<Page />} />
}
