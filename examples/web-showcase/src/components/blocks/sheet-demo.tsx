"use client"

import { useState } from "react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
      <CardContent className="flex flex-wrap gap-2 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function SheetDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Section
        title="Four sides"
        description="Pick a side prop on SheetContent — top, right, bottom, left."
      >
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Right
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="p-4 text-sm">Form goes here.</div>
            <SheetFooter>
              <Button>Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Left
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Browse the app sections.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>Top</SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>Announcements</SheetTitle>
              <SheetDescription>What's new this week.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Bottom
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Confirm action</SheetTitle>
              <SheetDescription>Are you sure?</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Cancel
              </SheetClose>
              <Button>Continue</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Section>

      <Section
        title="Controlled"
        description="Drive the open state from React."
      >
        <Button onClick={() => setOpen(true)}>Open programmatically</Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Controlled sheet</SheetTitle>
              <SheetDescription>
                Opens via external state. Close with the X or by toggling state.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;sheet | sheet-trigger | sheet-content | sheet-header |
          sheet-title | sheet-description | sheet-footer | sheet-close&quot;
        </code>
        ; built on Base UI Dialog with side-positioning classes.
      </p>
    </div>
  )
}

export default SheetDemo
