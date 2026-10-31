import { AppLink as Link, useParams } from "../../../lib/routing"
import { AwesomeItemsClient } from "../../../components/awesome/awesome-items-client"
import {
  getAwesomeCategories,
  getAwesomeCategory,
  getAwesomeItemsByCategory,
} from "../../../lib/awesome/data"

export function AwesomeCategoryPage() {
  const { category } = useParams()
  const cat = category ? getAwesomeCategory(category) : undefined
  if (!cat || !category) {
    return <p className="text-muted-foreground p-6">Category not found.</p>
  }
  const items = getAwesomeItemsByCategory(category)
  const categories = getAwesomeCategories()
  return (
    <div className="space-y-6">
      <Link href="/" className="text-muted-foreground text-sm hover:underline">
        Back to Awesome
      </Link>
      <header>
        <h1 className="text-xl font-semibold">{cat.name}</h1>
        <p className="text-muted-foreground text-xs">{items.length} items</p>
      </header>
      <AwesomeItemsClient items={items} categories={categories} />
    </div>
  )
}
