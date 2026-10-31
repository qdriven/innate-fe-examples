import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

const pkgDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: pkgDir,
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "server/**/*.test.ts"],
  },
})
