"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
  Input,
  Textarea,
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

export function FieldDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Vertical"
        description="Default orientation — label stacked above the control."
      >
        <FieldSet className="w-full max-w-md">
          <Field>
            <FieldLabel htmlFor="field-demo-name">Display name</FieldLabel>
            <FieldDescription>
              This is the name shown across your workspace.
            </FieldDescription>
            <Input id="field-demo-name" placeholder="Patrick" />
          </Field>
          <Field>
            <FieldLabel htmlFor="field-demo-bio">Short bio</FieldLabel>
            <Textarea
              id="field-demo-bio"
              placeholder="Tell us about yourself…"
              rows={3}
            />
          </Field>
        </FieldSet>
      </Section>

      <Section
        title="Horizontal"
        description="Pair with FieldContent for inline layouts."
      >
        <FieldSet className="w-full max-w-md">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="field-demo-email">
                Email me updates
              </FieldLabel>
              <FieldDescription>
                Receive product updates and release notes.
              </FieldDescription>
            </FieldContent>
            <input
              id="field-demo-email"
              type="checkbox"
              className="size-4 accent-primary"
            />
          </Field>
        </FieldSet>
      </Section>

      <Section
        title="With error"
        description="Show FieldError when validation fails; it styles the message red."
      >
        <FieldSet className="w-full max-w-md">
          <Field data-invalid>
            <FieldLabel htmlFor="field-demo-invalid">Username</FieldLabel>
            <Input
              id="field-demo-invalid"
              placeholder="username"
              aria-invalid="true"
              defaultValue="@"
            />
            <FieldError>Username cannot start with @.</FieldError>
          </Field>
        </FieldSet>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;field | field-set | field-content | field-label |
          field-description | field-error&quot;
        </code>
        ; supports{" "}
        <code className="font-mono">
          orientation=&quot;horizontal | vertical&quot;
        </code>
        .
      </p>
    </div>
  )
}

export default FieldDemo
