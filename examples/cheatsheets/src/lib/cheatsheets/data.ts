import { parseMatter } from "../content/parser"
import type { Cheatsheet, CheatsheetMeta } from "./types"

const files = import.meta.glob("../../content/cheatsheets/*.md", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>

function parseCheatsheet(slug: string, raw: string): Cheatsheet {
  const { data, content } = parseMatter(raw)
  const intro =
    typeof data.intro === "string"
      ? data.intro
      : typeof data.description === "string"
        ? data.description
        : null
  const description =
    intro ||
    content
      .replace(/```[\s\S]*?```/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .slice(0, 2)
      .join(" ")
      .slice(0, 200) || ""
  const updated = data.updated || data.lastUpdated || null
  const updatedStr =
    typeof updated === "string"
      ? updated
      : null

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    category: typeof data.category === "string" ? data.category : "Uncategorized",
    tags: Array.isArray(data.tags) ? data.tags : [],
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    updated: updatedStr,
    weight: typeof data.weight === "number" ? data.weight : 0,
    intro,
    description,
    content,
  }
}

function allCheatsheets(): Cheatsheet[] {
  return Object.entries(files)
    .map(([filePath, raw]) => {
      const name = filePath.split("/").pop() ?? ""
      const slug = name.replace(/\.md$/, "")
      if (!slug || slug === "index" || slug.includes("@")) return null
      return parseCheatsheet(slug, raw)
    })
    .filter((item): item is Cheatsheet => item !== null)
    .sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title))
}

export function getCheatsheetMetas(): CheatsheetMeta[] {
  return allCheatsheets().map(({ content: _content, ...meta }) => meta)
}

export function getCheatsheetCategories(): string[] {
  return [...new Set(allCheatsheets().map((item) => item.category))].sort()
}

export function getCheatsheet(slug: string): Cheatsheet | undefined {
  return allCheatsheets().find((item) => item.slug === slug)
}
