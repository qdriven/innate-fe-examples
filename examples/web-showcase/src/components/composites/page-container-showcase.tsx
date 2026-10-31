"use client"

import { useState } from "react"

import PageContainer from "@innate/admin-composites/page-container"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@innate/ui"

export function PageContainerShowcase() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-[var(--spacing-section)]">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLoading((value) => !value)}
        >
          Toggle loading
        </Button>
        <span className="text-muted-foreground text-xs">
          Preview @innate/admin-composites/page-container
        </span>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <PageContainer
          isLoading={loading}
          pageTitle="Facilities overview"
          pageDescription="Page shell with optional header action — same API as admin-nextjs dashboard routes."
          pageHeaderAction={<Button size="sm">Export</Button>}
        >
          <Card>
            <CardHeader>
              <CardTitle>Content area</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Children render below the page header. Use access=false or
              isLoading=true to preview gate and skeleton states.
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    </div>
  )
}
