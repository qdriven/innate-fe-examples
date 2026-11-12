import { AppLink as Link } from "../../lib/routing"
import { AwesomeItemsClient } from "../../components/awesome/awesome-items-client"
import { getAllAwesomeItems, getAwesomeCategories } from "../../lib/awesome/data"
import { Tag } from "lucide-react"

export function AwesomePage() {
  const categories = getAwesomeCategories()
  const items = getAllAwesomeItems()
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Awesome</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Curated list of {items.length} tools, skills, and resources.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = items.filter((item) => item.category === cat.slug).length
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="bg-card hover:bg-accent/40 flex items-center gap-3 rounded-xl border p-4"
            >
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `color-mix(in oklab, ${cat.color} 12%, transparent)`,
                  color: cat.color,
                }}
              >
                <Tag className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{cat.name}</h3>
                <p className="text-muted-foreground text-xs">{count} items</p>
              </div>
            </Link>
          )
        })}
      </div>
      <AwesomeItemsClient items={items} categories={categories} />
    </div>
  )
}
