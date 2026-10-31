"use client"

import { EyeIcon, MailIcon, SearchIcon, XIcon } from "lucide-react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
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

export function InputGroupDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Icon addon"
        description="Leading or trailing icons inside the input group."
      >
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <SearchIcon data-icon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput type="email" placeholder="you@example.com" />
          <InputGroupAddon align="inline-end">
            <MailIcon data-icon />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup data-disabled>
          <InputGroupAddon align="inline-start">
            <EyeIcon data-icon />
          </InputGroupAddon>
          <InputGroupInput type="password" placeholder="Disabled" disabled />
        </InputGroup>
      </Section>

      <Section
        title="With button"
        description="InputGroupButton slots at start or end to trigger actions."
      >
        <InputGroup>
          <InputGroupInput placeholder="Search products…" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Clear">
              <XIcon data-icon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="example.com" />
          <InputGroupAddon align="inline-end">
            <Button size="xs">Go</Button>
          </InputGroupAddon>
        </InputGroup>
      </Section>

      <Section
        title="Text addon"
        description="Use InputGroupText to slot static text like a domain prefix."
      >
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;input-group | input-group-addon | input-group-input |
          input-group-button | input-group-text&quot;
        </code>
        ; InputGroupButton uses Base UI Button under the hood.
      </p>
    </div>
  )
}

export default InputGroupDemo
