"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
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

export function CheckboxDemo() {
  const [items, setItems] = useState<string[]>(["notifications"])

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <Section
        title="Basic"
        description="A single checkbox with label and description."
      >
        <div className="flex items-center gap-3">
          <Checkbox id="checkbox-basic" defaultChecked />
          <Label htmlFor="checkbox-basic">Accept terms and conditions</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="checkbox-basic-2" />
          <Label htmlFor="checkbox-basic-2">Subscribe to newsletter</Label>
        </div>
      </Section>

      <Section
        title="Mixed state"
        description='Show a partial-select via controlled checked — useful for "select all" patterns.'
      >
        <div className="flex items-center gap-3">
          <Checkbox
            id="checkbox-indeterminate"
            checked={items.length === 2}
            onCheckedChange={() => {
              if (items.length === 2) setItems([])
              else setItems(["notifications", "marketing"])
            }}
          />
          <Label htmlFor="checkbox-indeterminate">Select all</Label>
        </div>
        <div className="ml-6 flex flex-col gap-2">
          {["notifications", "marketing", "billing"].map((id) => (
            <div key={id} className="flex items-center gap-2">
              <Checkbox
                id={`checkbox-sub-${id}`}
                checked={items.includes(id)}
                onCheckedChange={() => toggle(id)}
                disabled={id === "billing"}
              />
              <Label htmlFor={`checkbox-sub-${id}`}>{id}</Label>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Disabled"
        description="Disabled checkboxes cannot be toggled."
      >
        <div className="flex items-center gap-3">
          <Checkbox id="checkbox-disabled-1" disabled defaultChecked />
          <Label htmlFor="checkbox-disabled-1">Locked (checked)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="checkbox-disabled-2" disabled />
          <Label htmlFor="checkbox-disabled-2">Locked (unchecked)</Label>
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;checkbox&quot;</code>;
        renders a Base UI Checkbox with check and indeterminate icons via
        data-state.
      </p>
    </div>
  )
}

export default CheckboxDemo
