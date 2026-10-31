"use client"

import { EyeIcon, MailIcon, SearchIcon } from "lucide-react"

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

export function InputDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Plain input"
        description="Default, disabled, file, and aria-invalid states."
      >
        <Input placeholder="Default input" />
        <Input placeholder="Disabled input" disabled />
        <Input type="file" />
        <Input placeholder="Invalid input" aria-invalid="true" />
      </Section>

      <Section
        title="With label"
        description="Pair with Label and helper text for accessible form fields."
      >
        <div className="space-y-2">
          <Label htmlFor="input-demo-email">Email</Label>
          <Input
            id="input-demo-email"
            type="email"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="input-demo-name">Display name</Label>
          <Input id="input-demo-name" placeholder="Patrick" />
        </div>
      </Section>

      <Section
        title="With icons"
        description="Place a lucide icon inline with data-icon for prefix/suffix affordances."
      >
        <div className="relative">
          <SearchIcon
            data-icon
            className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input className="pl-9" placeholder="Search…" />
        </div>
        <div className="relative">
          <MailIcon
            data-icon
            className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2"
          />
          <Input className="pr-9" type="email" placeholder="you@example.com" />
        </div>
        <div className="relative">
          <EyeIcon
            data-icon
            className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input className="pl-9" type="password" placeholder="Password" />
        </div>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;input&quot;</code>;
        controlled by Base UI Input primitive. For grouped inputs with addons
        see <code className="font-mono">/components/input-group</code>.
      </p>
    </div>
  )
}

export default InputDemo
