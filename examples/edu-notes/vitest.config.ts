import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// 双 React 修复（同 admin-tanstack）：@innate/ink 经 workspace symlink 到框架仓，
// 它自己的 node_modules/react 是框架仓 .pnpm 的实例 —— 与本包（examples 仓
// store）的 react-dom 不配对，jsdom 里 hooks 断裂（useId of null）。
// 把整条 react 命名空间 alias 钉到本包 node_modules 的实例。
const LOCAL = new URL("./node_modules", import.meta.url).pathname

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react$/, replacement: `${LOCAL}/react` },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: `${LOCAL}/react/jsx-dev-runtime`,
      },
      { find: /^react\/jsx-runtime$/, replacement: `${LOCAL}/react/jsx-runtime` },
      { find: /^react-dom($|\/)/, replacement: `${LOCAL}/react-dom` },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // jsdom 集成测试并行跑墙钟翻倍 + ink 首渲染纹理计算 3-4s：放宽阈值。
    pool: "forks",
    maxWorkers: 2,
    testTimeout: 30000,
  },
})
