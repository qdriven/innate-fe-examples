"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
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
      <CardContent className="flex flex-col gap-3 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function SkeletonDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Text line"
        description="A subtle pulsing rectangle — use anywhere a string of text is loading."
      >
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-4 w-[180px]" />
      </Section>

      <Section
        title="Avatar + content"
        description="Mimics a real card while data is in-flight."
      >
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
      </Section>

      <Section
        title="Card placeholder"
        description="A full card-shaped skeleton — drop in for list views."
      >
        <div className="flex flex-col gap-3 rounded-md border p-4">
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;skeleton&quot;</code>;
        applies a subtle pulse via Tailwind{" "}
        <code className="font-mono">animate-pulse</code>.
      </p>
    </div>
  )
}

export default SkeletonDemo
