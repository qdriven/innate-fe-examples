"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"

import {
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
      <CardContent className="flex justify-center p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(() => new Date())
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: new Date(),
    to: undefined,
  }))

  return (
    <div className="space-y-6">
      <Section
        title="Single date"
        description="Click a day to select it. Default value is today."
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </Section>

      <Section
        title="Date range"
        description="Click start, then end, to select a range."
      >
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className="rounded-md border"
        />
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;calendar&quot;</code>; built
        on react-day-picker. Supports{" "}
        <code className="font-mono">
          mode=&quot;single | range | multiple&quot;
        </code>
        .
      </p>
    </div>
  )
}

export default CalendarDemo
