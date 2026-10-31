"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
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

export function LabelDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Basic"
        description="Pairs with a control via htmlFor — clicking the label focuses the input."
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="label-demo-email">Email</Label>
          <Input
            id="label-demo-email"
            type="email"
            placeholder="you@example.com"
          />
        </div>
      </Section>

      <Section
        title="With required indicator"
        description="Append a span with the destructive variant for required fields."
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="label-demo-required">
            Password <span className="text-destructive">*</span>
          </Label>
          <Input id="label-demo-required" type="password" />
        </div>
      </Section>

      <Section
        title="Disabled"
        description="When the input is disabled, the label inherits the muted text color."
      >
        <div
          className="group grid w-full max-w-sm items-center gap-1.5"
          data-disabled
        >
          <Label htmlFor="label-demo-disabled">Disabled field</Label>
          <Input id="label-demo-disabled" disabled placeholder="Cannot edit" />
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;label&quot;</code>; renders
        a <code className="font-mono">&lt;label&gt;</code> element with
        peer-aware disabled styling.
      </p>
    </div>
  )
}

export default LabelDemo
