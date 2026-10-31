"use client"

import { useState } from "react"

import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Toggle,
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

export function ToggleDemo() {
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(true)
  const [underline, setUnderline] = useState(false)

  return (
    <div className="space-y-6">
      <Section
        title="With icon"
        description="Default pressed state — use for toolbars."
      >
        <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
          <BoldIcon data-icon />
        </Toggle>
        <Toggle
          pressed={italic}
          onPressedChange={setItalic}
          aria-label="Italic"
        >
          <ItalicIcon data-icon />
        </Toggle>
        <Toggle
          pressed={underline}
          onPressedChange={setUnderline}
          aria-label="Underline"
        >
          <UnderlineIcon data-icon />
        </Toggle>
      </Section>

      <Section
        title="Outline"
        description="Use the outline variant for a subtler pressed state."
      >
        <Toggle variant="outline" defaultPressed aria-label="Bold outline">
          <BoldIcon data-icon />
        </Toggle>
        <Toggle variant="outline" aria-label="Italic outline">
          <ItalicIcon data-icon />
        </Toggle>
      </Section>

      <Section
        title="With text"
        description="Mix icons and labels for clearer actions."
      >
        <Toggle defaultPressed>
          <BoldIcon data-icon /> Bold
        </Toggle>
        <Toggle>
          <ItalicIcon data-icon /> Italic
        </Toggle>
      </Section>

      <Section
        title="Disabled"
        description="Disabled toggles cannot change state."
      >
        <Toggle disabled defaultPressed aria-label="Locked">
          <BoldIcon data-icon />
        </Toggle>
        <Toggle disabled aria-label="Locked off">
          <ItalicIcon data-icon />
        </Toggle>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;toggle&quot;</code>; driven
        by <code className="font-mono">pressed</code> +{" "}
        <code className="font-mono">onPressedChange</code>; data-state=&quot;on
        | off&quot;.
      </p>
    </div>
  )
}

export default ToggleDemo
