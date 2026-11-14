import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// 双 React 修复（同 admin-tanstack 口径）：@innate/* 经 workspace symlink 到
// 框架仓，框架仓 .pnpm 里有独立一份 react@18.3.1 + @base-ui/*，它们 import
// 框架仓的 react —— 与本包（examples 仓 store）的 react-dom 不配对，jsdom 里
// hooks 断裂（useContext of null）。
//
// 三件事配合才彻底：
//  1. alias 把 react 全命名空间钉到本包 node_modules 实例；
//  2. server.deps.inline 让 @base-ui/* / @innate/* 进 bundle —— externalize
//     的 symlink 包不走 resolve 链，alias 不生效，inline 后才走；
//  3. forks 池 + 限 worker，jsdom 集成测试并行墙钟翻倍（本配置原有的
//     testTimeout 注释仍然适用：放宽的是墙钟阈值，断言一条没少）。
const LOCAL = fileURLToPath(new URL("./node_modules", import.meta.url))

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
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
    // 这些是 jsdom 里的集成测试：Base UI 的 Checkbox / DropdownMenu / AlertDialog
    // 会挂弹层，Testing Library 的 `findByRole({name})` 要算可访问名——单跑一个
    // 文件约 1s，全仓并行跑时 CPU 被抢，墙钟时间会翻几倍。默认的 5s 阈值是按
    // 单跑定的，负载一上来就偶发超时（实测同一用例在并行跑时 5.4s 挂掉）。
    // 这里放宽的是**墙钟阈值**，断言一条没少。
    testTimeout: 20000,
  },
})
