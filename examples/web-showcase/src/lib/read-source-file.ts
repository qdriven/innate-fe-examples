import fs from "node:fs"
import path from "node:path"

const SOURCE_ROOT = path.join(process.cwd(), "src")

export function readSourceFile(relativePath: string) {
  const absolutePath = path.resolve(
    SOURCE_ROOT,
    relativePath.replace(/^src\//, "")
  )
  if (!absolutePath.startsWith(SOURCE_ROOT)) {
    return null
  }
  if (!fs.existsSync(absolutePath)) {
    return null
  }
  return fs.readFileSync(absolutePath, "utf-8")
}
