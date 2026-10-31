"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
      <CardContent className="p-0 pt-3">{children}</CardContent>
    </Card>
  )
}

export function AccordionDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Single open"
        description="Only one item can be expanded at a time — accordion collapses the others."
      >
        <Accordion
          defaultValue={["item-1"]}
          className="w-full rounded-md border"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Innate UI?</AccordionTrigger>
            <AccordionContent>
              An open-source component library built on Base UI and shadcn/ui
              primitives.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I install it?</AccordionTrigger>
            <AccordionContent>
              Add <code className="font-mono">@innate/ui</code> via pnpm and
              import the components you need.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I customize the theme?</AccordionTrigger>
            <AccordionContent>
              Yes — all colors are CSS variables exposed via{" "}
              <code className="font-mono">@innate/ui/globals.css</code>.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Multiple open"
        description='Use type="multiple" to allow several sections to be expanded simultaneously.'
      >
        <Accordion
          multiple
          defaultValue={["item-1", "item-2"]}
          className="w-full rounded-md border"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>First section</AccordionTrigger>
            <AccordionContent>Open by default in multi mode.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Second section</AccordionTrigger>
            <AccordionContent>
              Also open by default. Click a trigger to toggle.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Third section</AccordionTrigger>
            <AccordionContent>
              Closed. Open it to see the smooth height animation.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;accordion | accordion-item | accordion-trigger |
          accordion-content&quot;
        </code>
        ; supports type <code className="font-mono">single | multiple</code>
        and the <code className="font-mono">collapsible</code> flag.
      </p>
    </div>
  )
}

export default AccordionDemo
