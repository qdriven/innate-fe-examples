import { FeedList } from "../../components/feed/feed-list"
import { getWritingMeta } from "../../lib/content"
import { Newspaper } from "lucide-react"

export function FeedPage() {
  const posts = getWritingMeta().map((meta) => ({
    slug: meta.slug,
    title: meta.title,
    summary: meta.excerpt || "",
    date: new Date(meta.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    author: { name: meta.author, avatar: "", role: "" },
    category: meta.category,
    tags: meta.tags,
    readTime: meta.readingTime,
    isEditorsPick: meta.editorsPick,
  }))

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-2">
        <Newspaper className="size-5" />
        <h1 className="text-xl font-semibold">Feed</h1>
      </header>
      <FeedList posts={posts} />
    </div>
  )
}
