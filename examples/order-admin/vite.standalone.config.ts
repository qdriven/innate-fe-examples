import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const pkgDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.join(pkgDir, "src/standalone"),
  plugins: [tailwindcss(), react()],
  server: { port: 4016, strictPort: true },
  preview: { port: 4016, strictPort: true },
  build: {
    outDir: path.join(pkgDir, "dist-standalone"),
    emptyOutDir: true,
  },
})
