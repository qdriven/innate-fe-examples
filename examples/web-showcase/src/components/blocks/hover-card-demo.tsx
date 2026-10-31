"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
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

export function HoverCardDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="On a link"
        description="Hover a username to reveal a profile card."
      >
        <HoverCard>
          <HoverCardTrigger
            render={
              <a
                href="https://github.com"
                target="_blank"
                className="text-primary text-sm font-medium underline underline-offset-2"
              />
            }
          >
            @innate-ui
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex items-start gap-3">
              <Avatar className="size-10">
                <AvatarImage src="https://github.com/innate-ui.png" />
                <AvatarFallback>IU</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">Innate UI</p>
                <p className="text-muted-foreground text-xs">
                  Open-source component library.
                </p>
                <p className="text-muted-foreground text-xs">
                  Joined June 2026 · 54 components
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Section>

      <Section
        title="Plain trigger"
        description="Wrap any element to attach a hover card."
      >
        <HoverCard>
          <HoverCardTrigger
            render={
              <span className="text-muted-foreground cursor-pointer text-sm underline decoration-dotted" />
            }
          >
            What is Innate UI?
          </HoverCardTrigger>
          <HoverCardContent className="w-80 text-sm">
            A React component library built on Base UI and shadcn primitives —
            composable, accessible, and theme-driven via CSS variables.
          </HoverCardContent>
        </HoverCard>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;hover-card | hover-card-trigger |
          hover-card-content&quot;
        </code>
        ; opens on hover.
      </p>
    </div>
  )
}

export default HoverCardDemo
