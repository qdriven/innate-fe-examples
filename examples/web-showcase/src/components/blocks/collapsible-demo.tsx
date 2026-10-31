"use client"

import { useState } from "react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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

export function CollapsibleDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Section
        title="Uncontrolled"
        description="Open state is internal; the trigger toggles it."
      >
        <Collapsible className="w-full rounded-md border">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" className="w-full justify-between" />
            }
          >
            Show filters <span aria-hidden>↓</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 p-3 text-sm">
            <p>Filter by:</p>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              <li>Status</li>
              <li>Owner</li>
              <li>Date range</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section
        title="Controlled"
        description="Drive the open state yourself with React state."
      >
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="w-full rounded-md border"
        >
          <CollapsibleTrigger
            render={
              <Button variant="outline" className="w-full justify-between" />
            }
          >
            {open ? "Hide" : "Show"} advanced options
            <span aria-hidden>{open ? "↑" : "↓"}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 p-3 text-sm">
            <p className="text-muted-foreground">
              These options only appear when you opt in. Useful for power-user
              toggles in dense forms.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;collapsible | collapsible-trigger |
          collapsible-content&quot;
        </code>
        ; controlled via <code className="font-mono">open</code> +{" "}
        <code className="font-mono">onOpenChange</code>.
      </p>
    </div>
  )
}

export default CollapsibleDemo
