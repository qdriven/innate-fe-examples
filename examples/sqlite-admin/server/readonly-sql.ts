/** A single read-only SELECT / WITH statement. Returns an error string, or null. */
export function validateReadOnlySql(rawSql: string): string | null {
  const sql = rawSql.trim()
  if (!sql) return "SQL is empty"

  const stripped = sql
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .trim()
  if (!stripped) return "SQL is empty (comments only)"

  const withoutTrailing = stripped.replace(/;+\s*$/, "")
  if (withoutTrailing.includes(";")) return "Only a single statement is allowed"

  const firstWord = withoutTrailing.split(/\s+/)[0]?.toUpperCase()
  if (firstWord !== "SELECT" && firstWord !== "WITH") {
    return "Only SELECT / WITH statements are allowed"
  }

  const forbidden =
    /\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX|REPLACE|GRANT|REVOKE)\b/i
  if (forbidden.test(withoutTrailing)) {
    return "Write / schema / pragma statements are not allowed"
  }
  return null
}
