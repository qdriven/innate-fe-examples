"use client"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Kbd,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
      <CardContent className="flex flex-wrap items-center gap-3 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function TooltipDemo() {
  return (
    <TooltipProvider delay={200}>
      <div className="space-y-6">
        <Section
          title="On Button"
          description="Wrap a Button trigger with Tooltip to show a hint on hover or focus."
        >
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover me
            </TooltipTrigger>
            <TooltipContent>Save changes to the document</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Button variant="secondary" />}>
              With shortcut
            </TooltipTrigger>
            <TooltipContent>
              <p>Save your work</p>
              <p className="mt-1 flex items-center gap-1 text-xs">
                <Kbd>⌘</Kbd>
                <Kbd>S</Kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </Section>

        <Section
          title="On Kbd"
          description="Tooltips work on any focusable element, including the Kbd primitive."
        >
          <Tooltip>
            <TooltipTrigger render={<Kbd />} tabIndex={0}>
              K
            </TooltipTrigger>
            <TooltipContent>Open the command palette</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger render={<Kbd />} tabIndex={0}>
              ⇧
            </TooltipTrigger>
            <TooltipContent>Hold to multi-select</TooltipContent>
          </Tooltip>
        </Section>

        <Section
          title="On disabled Button"
          description="Wrap a disabled trigger in a span so the tooltip can still receive hover events."
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <span tabIndex={0} className="inline-block">
                  <Button disabled>Dangerous action</Button>
                </span>
              }
            />
            <TooltipContent>
              You need admin rights to perform this action
            </TooltipContent>
          </Tooltip>
        </Section>

        <p className="text-muted-foreground text-xs">
          Slot contract:{" "}
          <code className="font-mono">
            data-slot=&quot;tooltip | tooltip-trigger | tooltip-content |
            tooltip-provider&quot;
          </code>
          ; wrap once with <code className="font-mono">TooltipProvider</code> at
          the page or block root to share delay/timeout config.
        </p>
      </div>
    </TooltipProvider>
  )
}

export default TooltipDemo
