import Link from "next/link"

import { sceneRoutes } from "@/app/scenes/routes"

const skillLinks = [
  {
    name: "fe-overview",
    path: "packages/skills-kit/skills/fe-overview/SKILL.md",
    use: "Plugin tracks, UI layering, cn / CVA / token rules.",
  },
  {
    name: "fe-feature",
    path: "packages/skills-kit/skills/fe-feature/SKILL.md",
    use: "Page work: scene map, usage lookup, data wiring.",
  },
  {
    name: "fe-ui",
    path: "packages/skills-kit/skills/fe-ui/SKILL.md",
    use: "Add or update @innate/ui primitives. Usage of existing ones: showcase demos.",
  },
]

export const metadata = {
  title: "Agent Quick Index",
  description:
    "Working index for AI agents: skills, benchmark scenes, and component demos.",
}

export default function AgentQuickIndexPage() {
  return (
    <main className="w-full px-3 py-8 sm:px-4 lg:px-5">
      <header className="mb-8">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          Agent Workflow
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Agent Quick Index
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
          Pick a scene type, open one matching demo, then copy composition from
          L1 primitives and L2 composites. Do not copy component APIs into
          skills.
        </p>
      </header>

      <section className="mb-10 rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Recommended flow</h2>
        <ol className="text-muted-foreground mt-3 list-decimal space-y-2 pl-5 text-sm">
          <li>
            Scene → components:{" "}
            <code className="font-mono">
              fe-feature/references/scenes.md
            </code>
          </li>
          <li>
            How to write them:{" "}
            <code className="font-mono">
              fe-feature/references/usage.md
            </code>{" "}
            → this showcase&apos;s <code className="font-mono">*-demo.tsx</code>
          </li>
          <li>
            Confirm the export exists in{" "}
            <code className="font-mono">packages/ui/src/index.ts</code>
          </li>
          <li>
            Full page:{" "}
            <code className="font-mono">
              domains/admin-tanstack/src/components/scenes/
            </code>
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">Skill index</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {skillLinks.map((skill) => (
            <article key={skill.name} className="rounded-xl border bg-card p-4">
              <p className="font-medium">{skill.name}</p>
              <p className="text-muted-foreground mt-2 text-sm">{skill.use}</p>
              <p className="text-muted-foreground mt-2 font-mono text-xs">
                {skill.path}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">7 benchmark scenes</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sceneRoutes.map((route) => (
            <Link
              key={route.slug}
              href={`/scenes/${route.slug}`}
              className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <p className="font-medium">{route.name}</p>
              <p className="text-muted-foreground mt-2 text-sm">
                {route.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Component demos</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Canonical export list:{" "}
          <code className="font-mono">packages/ui/src/index.ts</code>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
          >
            Showcase overview
          </Link>
          <Link
            href="/components/button"
            className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
          >
            L1 primitive (Button)
          </Link>
          <Link
            href="/blocks/data-table"
            className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
          >
            L2 DataTable
          </Link>
          <Link
            href="/blocks/scene-blocks"
            className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted/50"
          >
            Scene blocks
          </Link>
        </div>
      </section>
    </main>
  )
}
