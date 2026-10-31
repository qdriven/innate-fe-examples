"use client"

import { InboxIcon } from "lucide-react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
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

export function EmptyDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Inbox zero"
        description="Icon + title + description + action button — for empty states across the app."
      >
        <Empty className="rounded-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No messages yet</EmptyTitle>
            <EmptyDescription>
              You have no unread messages. New messages will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Compose message</Button>
          </EmptyContent>
        </Empty>
      </Section>

      <Section
        title="Compact"
        description="No media, just title and description — for inline empty rows."
      >
        <Empty className="rounded-md border">
          <EmptyHeader>
            <EmptyTitle>Nothing here</EmptyTitle>
            <EmptyDescription>
              Add your first item to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm">
              Add item
            </Button>
          </EmptyContent>
        </Empty>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;empty | empty-header | empty-media | empty-title |
          empty-description | empty-content&quot;
        </code>
        ; laid out as a centered column with optional icon, content, and action
        button.
      </p>
    </div>
  )
}

export default EmptyDemo
