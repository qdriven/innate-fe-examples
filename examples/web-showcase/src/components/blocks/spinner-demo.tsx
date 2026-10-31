"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
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
      <CardContent className="flex flex-wrap items-center gap-3 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function SpinnerDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Sizes"
        description="Three sizes — sm, default, lg — passed via className."
      >
        <Spinner className="size-3" />
        <Spinner />
        <Spinner className="size-6" />
      </Section>

      <Section
        title="Colors"
        description="Default inherits text color; pass a className to override."
      >
        <Spinner className="text-primary" />
        <Spinner className="text-blue-500" />
        <Spinner className="text-red-500" />
        <Spinner className="text-green-500" />
      </Section>

      <Section
        title="Loading region"
        description="Wrap a section in a flex container to center the indicator."
      >
        <div className="flex h-24 w-full items-center justify-center rounded-md border bg-muted/30">
          <Spinner />
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;spinner&quot;</code>; pure
        CSS animation, no JS state. Use{" "}
        <code className="font-mono">aria-label</code> for screen readers and
        control size via className (e.g.{" "}
        <code className="font-mono">size-3</code>,{" "}
        <code className="font-mono">size-6</code>).
      </p>
    </div>
  )
}

export default SpinnerDemo
