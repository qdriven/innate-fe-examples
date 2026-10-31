"use client"

import {
  BoldIcon,
  ItalicIcon,
  Redo2Icon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react"

import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
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
      <CardContent className="flex flex-wrap items-center gap-3 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function ButtonGroupDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Horizontal"
        description="Default orientation — buttons share borders and rounding."
      >
        <ButtonGroup>
          <Button variant="outline">
            <Undo2Icon data-icon /> Undo
          </Button>
          <Button variant="outline">
            <Redo2Icon data-icon /> Redo
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Bold">
            <BoldIcon data-icon />
          </Button>
          <Button variant="outline" size="icon" aria-label="Italic">
            <ItalicIcon data-icon />
          </Button>
          <Button variant="outline" size="icon" aria-label="Underline">
            <UnderlineIcon data-icon />
          </Button>
        </ButtonGroup>
      </Section>

      <Section
        title="With separator"
        description="Use ButtonGroupSeparator to break the group into distinct segments."
      >
        <ButtonGroup>
          <Button variant="outline">Save</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">Save as…</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">Export</Button>
        </ButtonGroup>
      </Section>

      <Section
        title="Vertical"
        description='Set orientation="vertical" for stacked groups.'
      >
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;button-group | button-group-separator |
          button-group-text&quot;
        </code>
        ; siblings share a single rounded outline via negative margins.
      </p>
    </div>
  )
}

export default ButtonGroupDemo
