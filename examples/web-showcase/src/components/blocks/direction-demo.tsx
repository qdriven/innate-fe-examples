"use client"

import { useState } from "react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DirectionProvider,
} from "@innate/ui"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="rounded-xl border bg-card p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-3">{children}</CardContent>
    </Card>
  )
}

export function DirectionDemo() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")

  return (
    <div className="space-y-6">
      <Section
        title="Toggle direction"
        description="Wrap content in DirectionProvider to flip reading order."
      >
        <div className="flex items-center gap-2">
          <Button
            variant={dir === "ltr" ? "default" : "outline"}
            size="sm"
            onClick={() => setDir("ltr")}
          >
            LTR
          </Button>
          <Button
            variant={dir === "rtl" ? "default" : "outline"}
            size="sm"
            onClick={() => setDir("rtl")}
          >
            RTL
          </Button>
        </div>

        <DirectionProvider direction={dir}>
          <div className="rounded-md border p-4 text-sm" dir={dir}>
            <p>
              The quick brown fox jumps over the lazy dog. رقم ١٢٣ يستعرض النص
              العربي بسهولة.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-medium">Item 1</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">Item 2</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">Item 3</span>
            </div>
          </div>
        </DirectionProvider>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;direction-provider&quot;
        </code>
        ; sets <code className="font-mono">dir</code> on the wrapped subtree for
        CSS <code className="font-mono">:dir(rtl)</code> selectors and
        logical-property layouts.
      </p>
    </div>
  )
}

export default DirectionDemo
