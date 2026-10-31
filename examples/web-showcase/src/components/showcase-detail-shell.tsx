import type { ReactNode } from "react"

import { ShowcaseDetailTabs } from "@/components/showcase-detail-tabs"
import type { ShowcaseRegistryEntry } from "@/lib/showcase-registry"
import { readSourceFile } from "@/lib/read-source-file"

export function ShowcaseDetailShell({
  entry,
  preview,
}: {
  entry: ShowcaseRegistryEntry
  preview: ReactNode
}) {
  const sourceCode = readSourceFile(entry.sourcePath)

  return (
    <main className="w-full px-3 py-8 sm:px-4 lg:px-5">
      <header className="mb-8">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {entry.categoryLabel}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {entry.name}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {entry.description}
        </p>
      </header>
      <ShowcaseDetailTabs
        preview={preview}
        importLine={entry.importLine}
        sourceCode={sourceCode}
        sourcePath={entry.sourcePath}
      />
    </main>
  )
}
