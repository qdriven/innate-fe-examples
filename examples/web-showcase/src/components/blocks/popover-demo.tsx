"use client"

import { useState } from "react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
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

export function PopoverDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Section
        title="Basic"
        description="Click the trigger to open a floating panel."
      >
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Open popover
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-2">
            <h4 className="text-sm font-medium">About this feature</h4>
            <p className="text-muted-foreground text-xs">
              Popovers reveal rich content without leaving the page.
            </p>
          </PopoverContent>
        </Popover>
      </Section>

      <Section
        title="With form"
        description="Place a tiny form inside — useful for inline edits."
      >
        <Popover>
          <PopoverTrigger render={<Button />}>Set display name</PopoverTrigger>
          <PopoverContent className="w-80 space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Display name</h4>
              <p className="text-muted-foreground text-xs">
                This is how others will see you in the app.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="popover-name">Name</Label>
              <Input id="popover-name" defaultValue="Patrick" />
              <Button size="sm">Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      </Section>

      <Section
        title="Controlled"
        description="Drive the open state from React."
      >
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open externally
        </Button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverContent className="w-64 space-y-2">
            <h4 className="text-sm font-medium">Controlled</h4>
            <p className="text-muted-foreground text-xs">
              Click outside to close. Driven by useState above.
            </p>
          </PopoverContent>
        </Popover>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;popover | popover-trigger | popover-content&quot;
        </code>
        ; controlled via <code className="font-mono">open</code> +{" "}
        <code className="font-mono">onOpenChange</code>.
        Header/title/description are rendered as plain JSX inside
        PopoverContent.
      </p>
    </div>
  )
}

export default PopoverDemo
