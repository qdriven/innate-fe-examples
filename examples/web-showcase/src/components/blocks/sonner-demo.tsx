"use client"

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  Button,
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
      <CardContent className="flex flex-wrap items-center gap-2 p-0 pt-3">
        {children}
      </CardContent>
    </Card>
  )
}

export function SonnerDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Variant triggers"
        description="Each button calls toast() with a variant — success, info, warning, error — and the Toaster (mounted in the root layout) renders the matching icon."
      >
        <Button
          variant="outline"
          onClick={() => toast.success("Changes saved successfully")}
        >
          <CheckCircle2Icon data-icon /> Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("A new version is available")}
        >
          <InfoIcon data-icon /> Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Your trial expires in 3 days")}
        >
          <AlertTriangleIcon data-icon /> Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Failed to save — please retry")}
        >
          <XCircleIcon data-icon /> Error
        </Button>
      </Section>

      <Section
        title="With description"
        description="Pass an object with title + description for richer toasts."
      >
        <Button
          variant="secondary"
          onClick={() =>
            toast.success("Upload complete", {
              description: "All 12 files have been uploaded to your workspace.",
            })
          }
        >
          With description
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const id = toast.loading("Saving document…")
            setTimeout(() => {
              toast.success("Document saved", { id })
            }, 1500)
          }}
        >
          Loading → success
        </Button>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">data-slot=&quot;toaster&quot;</code> is
        mounted once at the root layout. Import{" "}
        <code className="font-mono">toast</code> directly from{" "}
        <code className="font-mono">sonner</code>; the Toaster wires icons/theme
        automatically.
      </p>
    </div>
  )
}

export default SonnerDemo
