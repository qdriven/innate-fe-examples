import { CheatsheetsPageClient } from "../../components/cheatsheets/cheatsheets-page-client"
import { getCheatsheetCategories, getCheatsheetMetas } from "../../lib/cheatsheets/data"

export function CheatsheetsPage() {
  const cheatsheets = getCheatsheetMetas()
  return (
    <CheatsheetsPageClient
      cheatsheets={cheatsheets}
      categories={getCheatsheetCategories()}
      total={cheatsheets.length}
    />
  )
}
