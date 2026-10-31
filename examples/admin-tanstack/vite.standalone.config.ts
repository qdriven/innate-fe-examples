import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const pkgDir = path.dirname(fileURLToPath(import.meta.url))

/**
 * domain 独立打包：以 src/standalone 为 vite root，
 * 产出 dist-standalone/（index.html + assets）。
 */
export default defineConfig({
  root: path.join(pkgDir, "src/standalone"),
  plugins: [tailwindcss(), react()],
  server: { port: 4015, strictPort: true },
  preview: { port: 4015, strictPort: true },
  build: {
    outDir: path.join(pkgDir, "dist-standalone"),
    emptyOutDir: true,
  },
})
