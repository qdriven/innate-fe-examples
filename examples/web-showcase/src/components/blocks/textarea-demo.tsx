"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
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

const MAX = 240

export function TextareaDemo() {
  const [value, setValue] = useState("")

  return (
    <div className="space-y-6">
      <Section
        title="Basic"
        description="Multi-line text input — same shape as Input, sized via rows."
      >
        <Textarea placeholder="Tell us about your project…" rows={4} />
      </Section>

      <Section
        title="With label"
        description="Pair with Label and helper text."
      >
        <div className="grid w-full max-w-md gap-1.5">
          <Label htmlFor="textarea-demo-message">Message</Label>
          <Textarea
            id="textarea-demo-message"
            placeholder="Type your message…"
            rows={5}
          />
        </div>
      </Section>

      <Section
        title="Character count"
        description="Track length with useState — render a counter in the bottom-right corner."
      >
        <div className="grid w-full max-w-md gap-1.5">
          <Label htmlFor="textarea-demo-count">Bio</Label>
          <Textarea
            id="textarea-demo-count"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="A few sentences about you…"
            rows={4}
            maxLength={MAX}
          />
          <p className="text-muted-foreground text-right text-xs">
            {value.length} / {MAX}
          </p>
        </div>
      </Section>

      <Section
        title="Disabled & invalid"
        description="Disabled and aria-invalid states share the same data attributes as Input."
      >
        <Textarea disabled placeholder="Disabled textarea" rows={3} />
        <Textarea
          aria-invalid="true"
          placeholder="Invalid textarea"
          rows={3}
          defaultValue="Too short"
        />
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;textarea&quot;</code>;
        supports rows, value, defaultValue, onChange, disabled, aria-invalid.
      </p>
    </div>
  )
}

export default TextareaDemo
