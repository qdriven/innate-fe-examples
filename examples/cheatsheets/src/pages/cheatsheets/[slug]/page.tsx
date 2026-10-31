import { useParams } from "../../../lib/routing"
import { CheatsheetDetailClient } from "../../../components/cheatsheets/cheatsheet-detail-client"
import { extractToc } from "../../../lib/content/parser"
import { getCheatsheet } from "../../../lib/cheatsheets/data"

export function CheatsheetDetailPage() {
  const { slug } = useParams()
  const cheatsheet = slug ? getCheatsheet(slug) : undefined
  if (!cheatsheet) {
    return <p className="text-muted-foreground p-6">Cheatsheet not found.</p>
  }
  return (
    <CheatsheetDetailClient cheatsheet={cheatsheet} toc={extractToc(cheatsheet.content)} />
  )
}
