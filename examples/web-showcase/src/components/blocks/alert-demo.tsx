"use client"

import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
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
      <CardContent className="flex flex-col gap-3 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function AlertDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Variants"
        description="Two variants — default and destructive — each with title and description."
      >
        <Alert>
          <AlertCircleIcon data-icon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Default alert with the most common styling.
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertCircleIcon data-icon className="text-blue-500" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            New release available — visit the changelog to learn more.
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertCircleIcon data-icon className="text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertCircleIcon data-icon className="text-yellow-500" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Your trial expires in 3 days — upgrade to keep your projects.
          </AlertDescription>
        </Alert>
      </Section>

      <Section
        title="Destructive"
        description="Use the destructive variant for errors and irreversible actions."
      >
        <Alert variant="destructive">
          <AlertCircleIcon data-icon />
          <AlertTitle>Cannot connect to database</AlertTitle>
          <AlertDescription>
            We tried 3 times. Check your network or contact support.
          </AlertDescription>
        </Alert>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;alert | alert-title | alert-description&quot;
        </code>
        ; renders an icon followed by title and description stacked vertically.
      </p>
    </div>
  )
}

export default AlertDemo
