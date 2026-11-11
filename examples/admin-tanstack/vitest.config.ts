import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// 双 React 修复：@innate/* 经 workspace symlink 到框架仓，框架仓 .pnpm 里有
// 独立一份 react@18.3.1 + @base-ui/utils，它们 import 框架仓的 react —— 与本包
// （examples 仓 store）的 react-dom 不配对，jsdom 里 hooks 断裂
//（useSyncExternalStore / useRef of null）。
//
// 三件事配合才彻底：
//  1. alias 把 react 全命名空间 + @base-ui/utils 钉到本包 node_modules 实例
//     （@base-ui/utils 用 junction 链到 examples 仓 store 的配对副本）；
//  2. server.deps.inline 让 @base-ui/* / @innate/* 进 bundle —— externalize 的
//     symlink 包不走 resolve 链，alias 不生效，inline 后才走；
//  3. forks 池 + 限 worker，jsdom 集成测试并行墙钟翻倍（同 order-admin）。
const LOCAL = fileURLToPath(new URL("./node_modules", import.meta.url))
const STORE = fileURLToPath(
  new URL("../../node_modules/.pnpm", import.meta.url)
)

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
      { find: "@base-ui/utils", replacement: `${LOCAL}/@base-ui/utils` },
    ],
  },
  test: {
    server: {
      deps: {
        // inline 的 id 是绝对路径（.pnpm/@base-ui+react@…/…），匹配包目录名
        // 而非 scoped 名。
        inline: [/@base-ui\+/, /@innate[-_/]/],
      },
    },
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    pool: "forks",
    maxWorkers: 2,
    testTimeout: 20000,
  },
})
