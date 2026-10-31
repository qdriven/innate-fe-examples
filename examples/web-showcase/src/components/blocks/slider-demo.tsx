"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Slider,
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
      <CardContent className="flex flex-col gap-4 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function SliderDemo() {
  const [single, setSingle] = useState(40)
  const [range, setRange] = useState<number[]>([20, 60])

  return (
    <div className="space-y-6">
      <Section
        title="Single value"
        description="One thumb — track the value via onValueChange."
      >
        <div className="flex w-full max-w-sm flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Volume</span>
            <span className="text-muted-foreground text-xs">{single}%</span>
          </div>
          <Slider
            value={single}
            onValueChange={(v) => setSingle(v as number)}
          />
        </div>
      </Section>

      <Section title="Range" description="Two thumbs for min/max selection.">
        <div className="flex w-full max-w-sm flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Price range</span>
            <span className="text-muted-foreground text-xs">
              ${range[0]} – ${range[1]}
            </span>
          </div>
          <Slider
            value={range}
            onValueChange={(v) => setRange(v as number[])}
            min={0}
            max={100}
            step={5}
          />
        </div>
      </Section>

      <Section
        title="With step"
        description="Force values to multiples of 10 via the step prop."
      >
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Slider defaultValue={50} step={10} />
        </div>
      </Section>

      <Section
        title="Disabled"
        description="Disabled sliders show their state but ignore input."
      >
        <div className="flex w-full max-w-sm flex-col gap-2">
          <Slider defaultValue={30} disabled />
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;slider&quot;</code>; uses
        Base UI Slider primitive; supports single and range modes via the value
        prop.
      </p>
    </div>
  )
}

export default SliderDemo
