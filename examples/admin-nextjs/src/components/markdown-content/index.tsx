import { Fragment } from "react"
import { cn } from "@innate/ui"
type MarkdownBlock =
  | {
      type: "heading"
      depth: 1 | 2 | 3
      text: string
    }
  | {
      type: "paragraph"
      text: string
    }
  | {
      type: "list"
      items: Array<string>
    }
  | {
      type: "code"
      code: string
      language?: string
    }

function stripFrontmatter(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, "\n").trim()

  if (!normalized.startsWith("---\n")) {
    return normalized
  }

  const closingMarkerIndex = normalized.indexOf("\n---\n", 4)

  if (closingMarkerIndex === -1) {
    return normalized
  }

  return normalized.slice(closingMarkerIndex + 5).trim()
}

function parseMarkdown(markdown: string): Array<MarkdownBlock> {
  const lines = stripFrontmatter(markdown).split("\n")
  const blocks: Array<MarkdownBlock> = []

  let index = 0

  while (index < lines.length) {
    const line = lines[index]?.trimEnd() ?? ""
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim() || undefined
      const codeLines: Array<string> = []

      index += 1

      while (index < lines.length && !lines[index]?.trim().startsWith("```")) {
        codeLines.push(lines[index] ?? "")
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      blocks.push({
        type: "code",
        code: codeLines.join("\n"),
        language,
      })
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/)

    if (headingMatch) {
      const depth = headingMatch[1].length as 1 | 2 | 3
      const text = headingMatch[2].trim() || ""

      blocks.push({
        type: "heading",
        depth,
        text,
      })
      index += 1
      continue
    }

    if (trimmed.startsWith("- ")) {
      const items: Array<string> = []

      while (index < lines.length) {
        const currentLine = lines[index]?.trim() ?? ""

        if (!currentLine.startsWith("- ")) {
          break
        }

        items.push(currentLine.slice(2).trim())
        index += 1
      }

      blocks.push({
        type: "list",
        items,
      })
      continue
    }

    const paragraphLines: Array<string> = []

    while (index < lines.length) {
      const currentLine = lines[index]?.trim() ?? ""

      if (
        !currentLine ||
        currentLine.startsWith("```") ||
        currentLine.startsWith("- ") ||
        /^#{1,3}\s+/.test(currentLine)
      ) {
        break
      }

      paragraphLines.push(currentLine)
      index += 1
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paragraphLines.join(" "),
      })
      continue
    }

    index += 1
  }

  return blocks
}

function renderInline(text: string) {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith("`") && segment.endsWith("`")) {
        return (
          <code
            key={`${segment}-${index}`}
            className="rounded-md bg-muted px-1 py-0.5 text-[0.85em] text-foreground"
          >
            {segment.slice(1, -1)}
          </code>
        )
      }

      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong
            key={`${segment}-${index}`}
            className="font-semibold text-foreground"
          >
            {segment.slice(2, -2)}
          </strong>
        )
      }

      return <Fragment key={`${segment}-${index}`}>{segment}</Fragment>
    })
}

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = parseMarkdown(content)

  return (
    <div className={cn("flex flex-col gap-4 text-sm leading-6", className)}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const headingClassName =
            block.depth === 1
              ? "text-lg font-semibold tracking-tight text-foreground"
              : block.depth === 2
                ? "pt-1 text-base font-semibold text-foreground"
                : "text-sm font-semibold text-foreground"

          return (
            <h2 key={`${block.text}-${index}`} className={headingClassName}>
              {renderInline(block.text)}
            </h2>
          )
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={`${block.text}-${index}`}
              className="text-sm text-foreground/85"
            >
              {renderInline(block.text)}
            </p>
          )
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${block.items[0]}-${index}`}
              className="flex list-disc flex-col gap-2 pl-5 text-sm text-foreground/85"
            >
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }

        return (
          <div
            key={`${block.language ?? "text"}-${index}`}
            className="overflow-hidden rounded-xl border bg-muted/30"
          >
            {block.language ? (
              <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
                {block.language}
              </div>
            ) : null}
            <pre className="overflow-x-auto p-3 text-xs leading-5 text-foreground">
              <code>{block.code}</code>
            </pre>
          </div>
        )
      })}
    </div>
  )
}
