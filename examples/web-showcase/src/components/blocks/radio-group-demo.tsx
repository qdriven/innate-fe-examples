"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
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

export function RadioGroupDemo() {
  const [plan, setPlan] = useState("starter")
  const [billing, setBilling] = useState("monthly")

  return (
    <div className="space-y-6">
      <Section
        title="Vertical"
        description="Standard radio list — pick one option from a set."
      >
        <RadioGroup value={plan} onValueChange={setPlan} className="grid gap-2">
          {[
            { value: "starter", label: "Starter", desc: "Up to 3 projects" },
            { value: "pro", label: "Pro", desc: "Unlimited projects" },
            { value: "team", label: "Team", desc: "For organizations" },
          ].map((opt) => (
            <Label
              key={opt.value}
              htmlFor={`plan-${opt.value}`}
              className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-md border p-3"
            >
              <RadioGroupItem value={opt.value} id={`plan-${opt.value}`} />
              <div className="grid gap-0.5">
                <span className="text-sm font-medium">{opt.label}</span>
                <span className="text-muted-foreground text-xs">
                  {opt.desc}
                </span>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </Section>

      <Section
        title="Horizontal"
        description="Lay options inline with flex-row."
      >
        <RadioGroup
          value={billing}
          onValueChange={setBilling}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="monthly" id="billing-monthly" />
            <Label htmlFor="billing-monthly">Monthly</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yearly" id="billing-yearly" />
            <Label htmlFor="billing-yearly">Yearly (save 20%)</Label>
          </div>
        </RadioGroup>
      </Section>

      <Section
        title="Disabled"
        description="Disabled options remain visible but cannot be selected."
      >
        <RadioGroup defaultValue="a" className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="a" id="rg-a" />
            <Label htmlFor="rg-a">Option A</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="b" id="rg-b" disabled />
            <Label htmlFor="rg-b">Option B (locked)</Label>
          </div>
        </RadioGroup>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;radio-group | radio-group-item&quot;
        </code>
        ; controlled via <code className="font-mono">value</code> +{" "}
        <code className="font-mono">onValueChange</code>.
      </p>
    </div>
  )
}

export default RadioGroupDemo
