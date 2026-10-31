"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Kbd,
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

export function KbdDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Single keys"
        description="Standalone keyboard hints — usually shown inline next to a label."
      >
        <div className="flex items-center gap-2 text-sm">
          Press <Kbd>Esc</Kbd> to close
        </div>
        <div className="flex items-center gap-2 text-sm">
          Hit <Kbd>Enter</Kbd> to confirm
        </div>
        <div className="flex items-center gap-2 text-sm">
          Tap <Kbd>Tab</Kbd> to advance
        </div>
      </Section>

      <Section
        title="Combos"
        description="Group multiple Kbd elements with text labels to render keyboard shortcuts."
      >
        <div className="flex items-center gap-1 text-sm">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>P</Kbd>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Kbd>⌥</Kbd>
          <Kbd>↑</Kbd>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>4</Kbd>
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;kbd&quot;</code>; Kbd
        renders an inline keycap. Wrap keys in a flex container with separators
        or text labels for combos.
      </p>
    </div>
  )
}

export default KbdDemo
