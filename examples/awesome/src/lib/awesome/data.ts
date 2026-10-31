import type { AwesomeCategory, AwesomeData, AwesomeItem } from "./types"

const files = import.meta.glob("../../content/awesome/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>

function isAwesomeData(value: unknown): value is AwesomeData {
  return Boolean(
    value &&
      typeof value === "object" &&
      "source" in value &&
      "items" in value &&
      Array.isArray((value as AwesomeData).items)
  )
}

function categoriesFile(): { categories?: AwesomeCategory[] } {
  const match = Object.entries(files).find(([path]) =>
    path.endsWith("categories.json")
  )
  return (match?.[1] as { categories?: AwesomeCategory[] }) ?? {}
}

export function getAwesomeCategories(): AwesomeCategory[] {
  return categoriesFile().categories ?? []
}

export function getAllAwesomeData(): AwesomeData[] {
  return Object.entries(files)
    .filter(([path]) => path.endsWith(".json") && !path.endsWith("categories.json"))
    .map(([, value]) => value)
    .filter(isAwesomeData)
}

export function getAllAwesomeItems(): Array<AwesomeItem & { sourceName: string }> {
  const items: Array<AwesomeItem & { sourceName: string }> = []
  for (const data of getAllAwesomeData()) {
    for (const item of data.items) {
      items.push({ ...item, sourceName: data.source.name })
    }
  }
  return items
}

export function getAwesomeItemsByCategory(
  categorySlug: string
): Array<AwesomeItem & { sourceName: string }> {
  return getAllAwesomeItems().filter((item) => item.category === categorySlug)
}

export function getAwesomeCategory(slug: string): AwesomeCategory | undefined {
  return getAwesomeCategories().find((category) => category.slug === slug)
}
