import { cn } from "@innate/ui"

/** 轻量只读代码块：等宽、可滚动、带文件路径标注。 */
export function CodeBlock({
  code,
  label,
  truncated,
  totalLines,
  className,
}: {
  code: string
  label?: string
  truncated?: boolean
  totalLines?: number
  className?: string
}) {
  return (
    <figure
      className={cn("overflow-hidden rounded-lg border bg-muted/40", className)}
    >
      {label ? (
        <figcaption className="border-b bg-muted/60 px-3 py-1.5 font-mono text-xs text-muted-foreground">
          {label}
          {truncated
            ? `（前 ${code.split("\n").length} / 共 ${totalLines} 行）`
            : ""}
        </figcaption>
      ) : null}
      <pre className="max-h-[28rem] overflow-auto p-3 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  )
}
