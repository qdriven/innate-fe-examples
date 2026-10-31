"use client"

import {
  ArrowRightIcon,
  ChevronRightIcon,
  MailIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
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
      <CardContent className="flex flex-wrap items-center gap-2 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function ButtonDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Variants"
        description="6 visual styles — default, outline, secondary, ghost, destructive, link."
      >
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Section>

      <Section
        title="Sizes"
        description="From xs (22px) up to lg (32px). Default is 28px."
      >
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add">
          <PlusIcon data-icon />
        </Button>
        <Button size="icon-sm" aria-label="Mail">
          <MailIcon data-icon />
        </Button>
        <Button size="icon-lg" aria-label="Delete">
          <Trash2Icon data-icon />
        </Button>
      </Section>

      <Section
        title="With icon"
        description="Icons use data-icon and inherit size styles automatically."
      >
        <Button>
          <MailIcon data-icon /> Send email
        </Button>
        <Button variant="secondary">
          Continue <ChevronRightIcon data-icon />
        </Button>
        <Button variant="outline">
          <ArrowRightIcon data-icon /> Read more
        </Button>
        <Button variant="destructive">
          <Trash2Icon data-icon /> Delete
        </Button>
      </Section>

      <Section
        title="States"
        description="Disabled, and class composition via buttonVariants()."
      >
        <Button disabled>Disabled</Button>
        <Button variant="destructive" disabled>
          Disabled destructive
        </Button>
        <Button
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Class composition
        </Button>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;button&quot;</code>;
        size-variant classes target icons via{" "}
        <code className="font-mono">
          [&amp;_svg:not([class*=&#39;size-&#39;])]
        </code>
        ; underlying primitive is Base UI{" "}
        <code className="font-mono">ButtonPrimitive</code>.
      </p>
    </div>
  )
}

export default ButtonDemo
