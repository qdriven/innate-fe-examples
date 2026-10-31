import { useParams } from "../../../lib/routing"
import { BlogViewer } from "../../../components/writing/blog-viewer"
import { AppLink as Link } from "../../../lib/routing"
import { getWriting } from "../../../lib/content"

export function FeedDetailPage() {
  const { slug } = useParams()
  const post = slug ? getWriting(slug) : undefined
  if (!post) {
    return <p className="text-muted-foreground p-6">Post not found.</p>
  }
  return (
    <div className="space-y-4">
      <Link href="/" className="text-muted-foreground text-sm hover:underline">
        Back to feed
      </Link>
      <BlogViewer
        title={post.title}
        content={post.content}
        excerpt={post.excerpt || ""}
        date={new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        author={post.author}
        category={post.category}
        tags={post.tags}
        readingTime={post.readingTime || 1}
        toc={post.toc}
      />
    </div>
  )
}
