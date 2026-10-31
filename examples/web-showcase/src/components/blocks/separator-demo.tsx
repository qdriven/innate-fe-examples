"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

export function SeparatorDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Horizontal"
        description="Default horizontal rule separating two blocks of content."
      >
        <div className="space-y-2">
          <p className="text-sm">Innate UI</p>
          <Separator />
          <p className="text-muted-foreground text-sm">
            An open-source component library.
          </p>
        </div>
      </Section>

      <Section
        title="Vertical"
        description='Use orientation="vertical" to divide horizontal layouts.'
      >
        <div className="flex h-5 items-center gap-2 text-sm">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Source</span>
          <Separator orientation="vertical" />
          <span>Blog</span>
        </div>
      </Section>

      <Section
        title="With label"
        description="Wrap with flex to align a text label in the middle of the rule."
      >
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs uppercase">or</span>
          <Separator className="flex-1" />
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;separator&quot;</code>;
        defaults to{" "}
        <code className="font-mono">role=&quot;separator&quot;</code> with
        horizontal orientation.
      </p>
    </div>
  )
}

export default SeparatorDemo
