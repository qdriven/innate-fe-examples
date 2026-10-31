"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@innate/ui"

export function CodePanel({
  title,
  code,
  filename,
  fill = false,
}: {
  title: string
  code: string
  filename?: string
  fill?: boolean
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Copied to clipboard")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {filename ? (
            <p className="text-muted-foreground font-mono text-xs">
              {filename}
            </p>
          ) : null}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <CheckIcon data-icon /> : <CopyIcon data-icon />}
          Copy
        </Button>
      </div>
      <pre
        className={
          fill
            ? "bg-muted/50 max-h-64 overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed lg:max-h-none lg:min-h-[12rem] lg:flex-1"
            : "bg-muted/50 max-h-[32rem] overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed"
        }
      >
        <code>{code}</code>
      </pre>
    </section>
  )
}
