"use client"

import {
  AspectRatio,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
      <CardContent className="grid grid-cols-3 gap-3 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

function RatioBox({ ratio, label }: { ratio: number; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <AspectRatio
        ratio={ratio}
        className="overflow-hidden rounded-md border bg-muted"
      >
        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
          {label}
        </div>
      </AspectRatio>
      <p className="text-muted-foreground text-center text-xs">
        {ratio.toFixed(2)} ({label})
      </p>
    </div>
  )
}

export function AspectRatioDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Common ratios"
        description="Fixed-ratio wrappers — child fills available space without distortion."
      >
        <RatioBox ratio={16 / 9} label="16:9 video" />
        <RatioBox ratio={4 / 3} label="4:3 classic" />
        <RatioBox ratio={1} label="1:1 square" />
      </Section>

      <Section
        title="Photo placeholder"
        description="Use with an <img> or <Image> to enforce cropping."
      >
        <div className="col-span-3">
          <AspectRatio
            ratio={21 / 9}
            className="overflow-hidden rounded-md border bg-gradient-to-br from-primary/20 to-primary/5"
          >
            <div className="text-muted-foreground flex h-full w-full items-center justify-center font-mono text-xs">
              21:9 banner
            </div>
          </AspectRatio>
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;aspect-ratio&quot;</code>;
        uses CSS <code className="font-mono">aspect-ratio</code> and{" "}
        <code className="font-mono">overflow: hidden</code> on the child.
      </p>
    </div>
  )
}

export default AspectRatioDemo
