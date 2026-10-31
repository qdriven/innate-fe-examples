import { AppLink as Link, useParams } from "../../../../lib/routing"
import { ArrowLeft, Lightbulb, Calendar } from "lucide-react"
import { Badge } from "@innate/ui"
import { getInsightById, insights } from "../../../../lib/making/data"
import { extractToc } from "../../../../lib/content/parser"
import { ServerMarkdown } from "../../../../components/server-markdown"
import { TableOfContents } from "../../../../components/table-of-contents"

export default function InsightDetailPage() {
  const { id } = useParams()
  const insight = id ? getInsightById(id) : undefined

  if (!insight) {
    return <p className="text-muted-foreground p-6">Insight not found.</p>
  }

  const content = insight.content
  const toc = extractToc(content)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Insights
          </Link>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Insight Detail</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          {/* Title Section */}
          <div className="mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs capitalize">
                {insight.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {insight.date}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{insight.title}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
            <div className="max-w-3xl">
              <ServerMarkdown content={content} />
            </div>
            <aside>
              <TableOfContents headings={toc} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
