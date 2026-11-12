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
    port: 4022,
    strictPort: true,
    // @innate/ink 是 workspace symlink 指向框架仓，其 fonts.css 的 woff2 走
    // /@fs/ 跨仓访问；Vite 默认 server.fs.strict 只放行 workspace root 内文件，
    // 不放行会 403 → 字体 face error → 手写字体全部回退。
    fs: {
      allow: [
        // examples workspace 根（pnpm-workspace.yaml 所在目录）
        path.resolve(pkgDir, "../.."),
        // @innate/ink symlink 的真实目标：框架仓 packages/ink。
        // fonts.css 的 woff2 url() 被 Vite 重写为 /@fs/<realpath>，真实路径
        // 在 examples workspace 之外，不放行会 403 → face error → 手写字体回退。
        path.resolve(pkgDir, "../../../../framework/innate-fe/packages/ink"),
      ],
    },
  },
  preview: { port: 4022, strictPort: true },
  build: {
    outDir: path.join(pkgDir, "dist-standalone"),
    emptyOutDir: true,
  },
})
