"use client"

import { MailIcon, PlusIcon, TagIcon, XIcon } from "lucide-react"

import {
  Badge,
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
      <CardContent className="flex flex-wrap items-center gap-2 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function BadgeDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Variants"
        description="7 visual styles — default, secondary, destructive, outline, muted, ghost, link."
      >
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="muted">Muted</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </Section>

      <Section
        title="With icon"
        description="Icons use the data-icon attribute and inherit badge size."
      >
        <Badge>
          <MailIcon data-icon /> 3 unread
        </Badge>
        <Badge variant="secondary">
          <TagIcon data-icon /> Label
        </Badge>
        <Badge variant="destructive">
          <XIcon data-icon /> Error
        </Badge>
        <Badge variant="outline">
          <PlusIcon data-icon /> Add new
        </Badge>
      </Section>

      <Section
        title="As link"
        description="Badge uses Base UI useRender — renders as an anchor when given href."
      >
        <Badge render={<a href="#badge" />}>Anchor</Badge>
        <Badge variant="secondary" render={<a href="#badge" />}>
          Clickable
        </Badge>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;badge&quot;</code>; renders
        via Base UI <code className="font-mono">useRender</code>; defaults to{" "}
        <code className="font-mono">&lt;span&gt;</code> but accepts any element
        via the <code className="font-mono">render</code> prop.
      </p>
    </div>
  )
}

export default BadgeDemo
