"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
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

export function SwitchDemo() {
  return (
    <div className="space-y-6">
      <Section title="Basic" description="A binary toggle with label.">
        <div className="flex items-center gap-3">
          <Switch id="switch-airplane" />
          <Label htmlFor="switch-airplane">Airplane mode</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="switch-default" defaultChecked />
          <Label htmlFor="switch-default">Receive notifications</Label>
        </div>
      </Section>

      <Section
        title="Disabled"
        description="Disabled toggles retain their state but cannot be changed."
      >
        <div className="flex items-center gap-3">
          <Switch id="switch-disabled-on" disabled defaultChecked />
          <Label htmlFor="switch-disabled-on">Always on</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="switch-disabled-off" disabled />
          <Label htmlFor="switch-disabled-off">Locked off</Label>
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;switch&quot;</code>; renders
        a toggle with data-state=&quot;checked | unchecked&quot; for styling the
        thumb position.
      </p>
    </div>
  )
}

export default SwitchDemo
