import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const pkgDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.join(pkgDir, "src/standalone"),
  plugins: [tailwindcss(), react()],
  server: {
    port: 4018,
    strictPort: true,
    // @innate/* 是 workspace symlink 指向框架仓；若未来引入跨仓静态资源
    // （如 @innate/ink 的 woff2 走 /@fs/），需要把框架仓目标目录加进
    // fs.allow（参考 edu-notes vite.standalone.config.ts）。
    fs: {
      allow: [
        // examples workspace 根（pnpm-workspace.yaml 所在目录）
        path.resolve(pkgDir, "../.."),
      ],
    },
  },
  preview: { port: 4018, strictPort: true },
  build: {
    outDir: path.join(pkgDir, "dist-standalone"),
    emptyOutDir: true,
  },
})
