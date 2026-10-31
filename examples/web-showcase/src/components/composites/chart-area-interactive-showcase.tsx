"use client"

import { ChartAreaInteractive } from "@innate/admin-composites/chart-area-interactive"

export function ChartAreaInteractiveShowcase() {
  return (
    <div className="space-y-[var(--spacing-section)]">
      <p className="text-muted-foreground text-sm">
        Self-contained interactive area chart card from @innate/admin-composites
        — built-in demo data with a time-range toggle (90d / 30d / 7d), no props
        required.
      </p>
      <ChartAreaInteractive />
    </div>
  )
}
