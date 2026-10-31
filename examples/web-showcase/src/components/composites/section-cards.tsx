"use client"

import { SectionCards } from "@innate/admin-composites/section-cards"

export function SectionCardsShowcase() {
  return (
    <div className="space-y-[var(--spacing-section)]">
      <p className="text-muted-foreground text-sm">
        KPI trend row from @innate/admin-composites — container-query responsive
        grid with gradient card backgrounds.
      </p>
      <SectionCards />
    </div>
  )
}
