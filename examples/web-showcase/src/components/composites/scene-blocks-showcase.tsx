"use client"

import {
  InfoListCard,
  MetricCards,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"

export function SceneBlocksShowcase() {
  return (
    <div className="space-y-[var(--spacing-section)]">
      <SceneIntro
        title="Scene blocks overview"
        description="Shared L2 composites from @innate/scene-catalog — used across admin-nextjs and admin-tanstack scene catalog pages."
        chips={["SceneIntro", "MetricCards", "InfoListCard", "TableCard"]}
      />
      <MetricCards
        items={[
          {
            label: "Active scenes",
            value: "7",
            hint: "L3 benchmark patterns in catalog",
          },
          {
            label: "Block exports",
            value: "4",
            hint: "Composable scene page sections",
          },
          {
            label: "Apps sharing",
            value: "2",
            hint: "admin-nextjs + admin-tanstack",
          },
        ]}
      />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-2">
        <InfoListCard
          title="InfoListCard"
          description="Key/value pairs in a bordered list — great for summaries and metadata."
          items={[
            { label: "Package", value: "@innate/scene-catalog" },
            { label: "Layer", value: "L2 composite" },
            { label: "Depends on", value: "@innate/ui only" },
          ]}
        />
        <TableCard
          title="TableCard"
          description="Card-wrapped static table for demo data and catalog previews."
          headers={["Block", "Use when", "Export"]}
          rows={[
            ["SceneIntro", "Page hero + chips", "title, description, chips"],
            ["MetricCards", "KPI row", "items[]"],
            ["InfoListCard", "Summary panel", "items[]"],
            ["TableCard", "Demo table", "headers, rows"],
          ]}
        />
      </div>
    </div>
  )
}
