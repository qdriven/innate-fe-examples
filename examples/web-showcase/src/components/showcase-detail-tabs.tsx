"use client"

import type { ReactNode } from "react"

import { CodePanel } from "@/components/code-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@innate/ui"

function PanelChrome({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-muted/30 shrink-0 border-b px-4 py-2.5 text-sm font-medium">
        {title}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </div>
  )
}

function CodeColumn({
  importLine,
  sourceCode,
  sourcePath,
}: {
  importLine: string
  sourceCode: string | null
  sourcePath: string
}) {
  return (
    <div className="flex min-h-0 flex-col gap-4">
      <CodePanel title="Import" code={importLine} fill />
      {sourceCode ? (
        <CodePanel
          title="Showcase source"
          code={sourceCode}
          filename={sourcePath}
          fill
        />
      ) : (
        <p className="text-muted-foreground text-sm">
          Source file not found: <code className="font-mono">{sourcePath}</code>
        </p>
      )}
    </div>
  )
}

export function ShowcaseDetailTabs({
  preview,
  importLine,
  sourceCode,
  sourcePath,
}: {
  preview: ReactNode
  importLine: string
  sourceCode: string | null
  sourcePath: string
}) {
  return (
    <>
      <div className="hidden min-h-[36rem] lg:block">
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-[36rem] overflow-hidden rounded-xl border"
        >
          <ResizablePanel defaultSize={58} minSize={35}>
            <PanelChrome title="Preview">{preview}</PanelChrome>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={42} minSize={28}>
            <PanelChrome title="Code">
              <CodeColumn
                importLine={importLine}
                sourceCode={sourceCode}
                sourcePath={sourcePath}
              />
            </PanelChrome>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="space-y-6 lg:hidden">
        <section className="overflow-hidden rounded-xl border">
          <PanelChrome title="Preview">{preview}</PanelChrome>
        </section>
        <section className="overflow-hidden rounded-xl border">
          <PanelChrome title="Code">
            <CodeColumn
              importLine={importLine}
              sourceCode={sourceCode}
              sourcePath={sourcePath}
            />
          </PanelChrome>
        </section>
      </div>
    </>
  )
}
