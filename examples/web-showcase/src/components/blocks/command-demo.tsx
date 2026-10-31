"use client"

import { useState } from "react"
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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

export function CommandDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Section
        title="Inline command"
        description="A static searchable list — useful inside a popover or panel."
      >
        <Command className="rounded-md border shadow-sm">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <CalendarIcon data-icon /> Calendar
              </CommandItem>
              <CommandItem>
                <SmileIcon data-icon /> Search emoji
              </CommandItem>
              <CommandItem>
                <CalculatorIcon data-icon /> Calculator
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <UserIcon data-icon /> Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon data-icon /> Billing
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon data-icon /> Settings
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Section>

      <Section
        title="As a dialog (palette)"
        description="Wrap in CommandDialog to launch as a full-screen palette."
      >
        <Button
          variant="outline"
          className="text-muted-foreground w-64 justify-between"
          onClick={() => setOpen(true)}
        >
          Press ⌘K to open
          <span className="text-xs">⌘K</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick actions">
              <CommandItem>
                <CalendarIcon data-icon /> Create event
              </CommandItem>
              <CommandItem>
                <UserIcon data-icon /> Invite teammate
              </CommandItem>
              <CommandItem>
                <SettingsIcon data-icon /> Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;command | command-input | command-list | command-empty
          | command-group | command-item | command-separator | command-shortcut
          | command-dialog&quot;
        </code>
        ; built on cmdk — keyboard-first.
      </p>
    </div>
  )
}

export default CommandDemo
