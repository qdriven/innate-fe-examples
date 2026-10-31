import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"

import { blockRoutes } from "./blocks/routes"
import {
  COMPONENT_CATEGORIES,
  componentRoutes,
  type ComponentCategory,
} from "./components/routes"
import { pageRoutes } from "./pages/routes"
import { sceneRoutes } from "./scenes/routes"
import {
  LAYER_BLURBS,
  SHOWCASE_LAYERS,
  showcaseHref,
  type ShowcaseLayer,
  type ShowcaseRoute,
} from "@/lib/showcase-catalog"

const primitiveCategoryLabel: Record<ComponentCategory, string> = {
  layout: "Layout & structure",
  navigation: "Navigation",
  forms: "Forms & input",
  actions: "Actions",
  feedback: "Feedback",
  overlay: "Overlays",
  data: "Data display",
}

function routesForLayer(layer: ShowcaseLayer): ShowcaseRoute[] {
  switch (layer) {
    case "primitives":
      return componentRoutes.map((route) => ({
        slug: route.slug,
        name: route.name,
        description: route.description,
        layer: "primitives",
        icon: route.icon,
        group: route.category,
      }))
    case "blocks":
      return blockRoutes
    case "scenes":
      return sceneRoutes
    case "pages":
      return pageRoutes
  }
}

export const metadata = {
  title: "Innate UI — Component Preview",
  description:
    "Primitives, composites, scenes, and page layouts from @innate/ui and admin reference apps.",
}

export default function Home() {
  const primitiveGroups = COMPONENT_CATEGORIES.map((cat) => ({
    category: cat,
    label: primitiveCategoryLabel[cat],
    items: componentRoutes.filter((route) => route.category === cat),
  })).filter((group) => group.items.length > 0)

  const total =
    componentRoutes.length +
    blockRoutes.length +
    sceneRoutes.length +
    pageRoutes.length

  return (
    <main className="w-full px-3 py-8 sm:px-4 lg:px-5">
      <header className="mb-10">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          @innate/ui showcase
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Design system preview
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
          {total} entries across 4 layers — L1 primitives, L2 composites, L3
          benchmark scenes, and auth page layouts from admin-nextjs /
          admin-tanstack. Use the sidebar to jump directly or browse each layer
          below.
        </p>
        <div className="mt-4">
          <Link
            href="/agent-quick-index"
            className="inline-flex rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
          >
            Open Agent Quick Index
          </Link>
          <Link
            href="/theme-editor"
            className="ml-2 inline-flex rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
          >
            Open Theme Editor
          </Link>
        </div>
      </header>

      <div className="space-y-14">
        {SHOWCASE_LAYERS.map((layer) => {
          const items = routesForLayer(layer.id)
          const LayerIcon = layer.icon

          return (
            <section key={layer.id}>
              <details open className="group rounded-xl border bg-card/30 p-4">
                <summary className="mb-4 flex cursor-pointer list-none items-baseline justify-between gap-4">
                  <div>
                    <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                      <LayerIcon className="size-3.5" />
                      {layer.label}
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      {layer.label}
                    </h2>
                    <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
                      {LAYER_BLURBS[layer.id]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground shrink-0 text-xs">
                      {items.length} {items.length === 1 ? "entry" : "entries"}
                    </p>
                    <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" />
                  </div>
                </summary>

                {layer.id === "primitives" ? (
                  <div className="space-y-4">
                    {primitiveGroups.map((group) => (
                      <details
                        key={group.category}
                        open
                        className="group/sub rounded-lg border bg-background p-3"
                      >
                        <summary className="mb-3 flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                          {group.label}
                          <ChevronDownIcon className="size-4 transition-transform group-open/sub:rotate-180" />
                        </summary>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {group.items.map((route) => {
                            const showcaseRoute: ShowcaseRoute = {
                              slug: route.slug,
                              name: route.name,
                              description: route.description,
                              layer: "primitives",
                              icon: route.icon,
                            }
                            const Icon = route.icon
                            return (
                              <Link
                                key={route.slug}
                                href={showcaseHref(showcaseRoute)}
                                className="rounded-xl border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Icon className="text-primary h-4 w-4" />
                                  </div>
                                  <h4 className="font-medium">{route.name}</h4>
                                </div>
                                <p className="text-muted-foreground mt-3 text-sm">
                                  {route.description}
                                </p>
                              </Link>
                            )
                          })}
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((route) => {
                      const Icon = route.icon
                      return (
                        <Link
                          key={route.slug}
                          href={showcaseHref(route)}
                          className="rounded-xl border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <Icon className="text-primary h-4 w-4" />
                            </div>
                            <h3 className="font-medium">{route.name}</h3>
                          </div>
                          <p className="text-muted-foreground mt-3 text-sm">
                            {route.description}
                          </p>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </details>
            </section>
          )
        })}
      </div>
    </main>
  )
}
