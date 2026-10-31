"use client"

import { ChevronRightIcon, MailIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
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

export function ItemDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="With avatar"
        description="Media + title + description in a single horizontal row."
      >
        <Item className="rounded-md border">
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarImage
                src="https://github.com/innate-ui.png"
                alt="@innate-ui"
              />
              <AvatarFallback>IU</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Innate UI</ItemTitle>
            <ItemDescription>Open-source component library</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon-sm" aria-label="Open">
              <ChevronRightIcon data-icon />
            </Button>
          </ItemActions>
        </Item>
        <Item className="rounded-md border">
          <ItemMedia variant="icon">
            <MailIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Messages</ItemTitle>
            <ItemDescription>3 unread threads in your inbox</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Open
            </Button>
          </ItemActions>
        </Item>
      </Section>

      <Section
        title="Compact"
        description="A tighter row with a trailing meta label."
      >
        <Item variant="muted" className="rounded-md">
          <ItemContent>
            <ItemTitle>Last commit</ItemTitle>
            <ItemDescription>
              Refactor Field primitive to support horizontal orientation
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <span className="text-muted-foreground text-xs">2h ago</span>
          </ItemActions>
        </Item>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;item | item-media | item-content | item-title |
          item-description | item-actions&quot;
        </code>
        ; flex row with three slots — leading media, central content, trailing
        actions.
      </p>
    </div>
  )
}

export default ItemDemo
