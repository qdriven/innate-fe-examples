"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
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

export function ResizableDemo() {
  return (
    <div className="space-y-6">
      <Section
        title="Horizontal"
        description="Two side-by-side panels — drag the handle to resize."
      >
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-32 w-full rounded-md border"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-3 text-sm">
              Left panel
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-3 text-sm">
              Right panel
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Section>

      <Section
        title="Vertical"
        description="Stack panels vertically with a horizontal drag handle."
      >
        <ResizablePanelGroup
          orientation="vertical"
          className="h-48 w-full rounded-md border"
        >
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full items-center justify-center p-3 text-sm">
              Top
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center p-3 text-sm">
              Bottom
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Section>

      <p className="text-muted-foreground text-xs">
        Slot contract:{" "}
        <code className="font-mono">
          data-slot=&quot;resizable-panel-group | resizable-panel |
          resizable-handle&quot;
        </code>
        ; built on react-resizable-panels v4; supports horizontal and vertical
        orientations and persisted sizes via autoSaveId.
      </p>
    </div>
  )
}

export default ResizableDemo
