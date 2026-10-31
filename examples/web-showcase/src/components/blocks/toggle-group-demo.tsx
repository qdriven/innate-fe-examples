"use client"

import { useState } from "react"

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ToggleGroup,
  ToggleGroupItem,
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

export function ToggleGroupDemo() {
  const [align, setAlign] = useState("left")
  const [formats, setFormats] = useState<string[]>(["bold"])

  return (
    <div className="space-y-6">
      <Section
        title="Single select"
        description='Use type="single" for radio-like groups.'
      >
        <ToggleGroup
          value={[align]}
          onValueChange={(v) => v.length > 0 && setAlign(v[0] ?? "left")}
          variant="outline"
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeftIcon data-icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenterIcon data-icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRightIcon data-icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Section>

      <Section
        title="Multi-select"
        description='Use type="multiple" for checkbox-like groups.'
      >
        <ToggleGroup
          multiple
          value={formats}
          onValueChange={(v) => setFormats(v)}
          variant="outline"
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon data-icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon data-icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon data-icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Section>

      <Section
        title="Sizes & spacing"
        description='size="sm" and spacing="2" customize the visual rhythm.'
      >
        <ToggleGroup size="sm" spacing={2} variant="outline">
          <ToggleGroupItem value="left" aria-label="Align left small">
            <AlignLeftIcon data-icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center small">
            <AlignCenterIcon data-icon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right small">
            <AlignRightIcon data-icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;toggle-group | toggle-group-item&quot;
        </code>
        ; supports <code className="font-mono">multiple</code> for checkbox-like
        groups (default is single) and variants{" "}
        <code className="font-mono">default | outline</code>.
      </p>
    </div>
  )
}

export default ToggleGroupDemo
