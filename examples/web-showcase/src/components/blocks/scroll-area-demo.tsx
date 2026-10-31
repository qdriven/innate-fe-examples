"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
  ScrollBar,
  Separator,
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

const TAGS = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)

export function ScrollAreaDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Vertical list"
        description="Constrained-height region with custom scrollbar styling."
      >
        <ScrollArea className="h-48 w-full rounded-md border">
          <div className="p-4">
            <h4 className="mb-2 text-sm font-medium">Tags</h4>
            {TAGS.map((tag) => (
              <div key={tag}>
                <div className="text-sm">{tag}</div>
                <Separator className="my-1" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Section>

      <Section
        title="Horizontal"
        description='ScrollBar with orientation="horizontal" for wide content.'
      >
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max gap-4 p-4">
            {TAGS.slice(0, 12).map((tag) => (
              <div
                key={tag}
                className="rounded-md border bg-muted/30 px-4 py-2 text-sm"
              >
                {tag}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;scroll-area | scroll-bar&quot;
        </code>
        ; wraps native scroll containers with custom-styled thumb and track.
      </p>
    </div>
  )
}

export default ScrollAreaDemo
