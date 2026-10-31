"use client"

import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
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

export function ProgressDemo() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 5))
    }, 300)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-6">
      <Section
        title="Determinate"
        description="Animated 0→100 via setInterval; reset at 100."
      >
        <Progress value={value} />
        <p className="text-muted-foreground text-xs">{value}% complete</p>
      </Section>

      <Section
        title="Fixed values"
        description="Use value to render a fixed snapshot — no animation."
      >
        <Progress value={25} />
        <Progress value={50} />
        <Progress value={75} />
        <Progress value={100} />
      </Section>

      <Section
        title="Indeterminate"
        description="Pass value={0} with a CSS animation class to render an animated bar."
      >
        <Progress value={0} className="animate-pulse" />
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;progress&quot;</code>;
        supports <code className="font-mono">value</code> (number) for
        determinate, omit for indeterminate.
      </p>
    </div>
  )
}

export default ProgressDemo
