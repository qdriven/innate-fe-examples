import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  // 相对路径资源：作为 static 插件嵌入 desktop-host 的 /plugins/<id>/ 子路径时资源不 404
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    port: 4010,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
})
