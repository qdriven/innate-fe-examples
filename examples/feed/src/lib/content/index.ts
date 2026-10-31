import { extractToc, parseFrontmatter } from "./parser"
import type { PostMeta } from "./types"

const writingFiles = import.meta.glob("../../content/writing/*.{md,mdx}", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>

export interface WritingPost extends PostMeta {
  slug: string
  type: "md" | "mdx"
  content: string
  toc: Array<{ id: string; text: string; level: number }>
}

function parseOne(filePath: string, raw: string): WritingPost {
  const name = filePath.split("/").pop() ?? "untitled.md"
  const type: "md" | "mdx" = name.endsWith(".mdx") ? "mdx" : "md"
  const fallbackSlug = name.replace(/\.(md|mdx)$/, "")
  const { meta, body } = parseFrontmatter(raw)
  return {
    ...meta,
    slug: meta.slug || fallbackSlug,
    type,
    content: body,
    toc: extractToc(body),
  }
}

function allPosts(): WritingPost[] {
  return Object.entries(writingFiles)
    .map(([filePath, raw]) => parseOne(filePath, raw))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getWritingMeta(options?: {
  status?: PostMeta["status"]
}): WritingPost[] {
  const status = options?.status ?? "published"
  return allPosts().filter((post) => post.status === status)
}

export function getWriting(slug: string): WritingPost | undefined {
  return allPosts().find((post) => post.slug === slug)
}
