"use client"

import { Trash2Icon } from "lucide-react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
      <CardContent className="p-0 pt-3">{children}</CardContent>
    </Card>
  )
}

export function DialogDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Basic confirmation"
        description="Trigger a destructive confirmation dialog from a button."
      >
        <Dialog>
          <DialogTrigger render={<Button variant="destructive" />}>
            <Trash2Icon data-icon /> Delete account
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete account?</DialogTitle>
              <DialogDescription>
                This action is permanent. All your data will be removed and
                cannot be recovered.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button variant="destructive" />}>
                Yes, delete
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section
        title="Form inside dialog"
        description='Use Dialog as a focused input surface — typical pattern for "quick create" flows.'
      >
        <Dialog>
          <DialogTrigger render={<Button />}>Create project</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New project</DialogTitle>
              <DialogDescription>
                Give your project a name. You can change it later.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="dialog-demo-name">Name</Label>
                <Input id="dialog-demo-name" placeholder="my-awesome-project" />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;dialog | dialog-trigger | dialog-portal |
          dialog-overlay | dialog-content | dialog-header | dialog-footer |
          dialog-title | dialog-description | dialog-close&quot;
        </code>
        ; animations driven by <code className="font-mono">tw-animate-css</code>{" "}
        keyframes.
      </p>
    </div>
  )
}

export default DialogDemo
