import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

const pkgDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: pkgDir,
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // 这些是 jsdom 里的集成测试：Base UI 的 Checkbox / DropdownMenu / AlertDialog
    // 会挂弹层，Testing Library 的 `findByRole({name})` 要算可访问名——单跑一个
    // 文件约 1s，全仓并行跑时 CPU 被抢，墙钟时间会翻几倍。默认的 5s 阈值是按
    // 单跑定的，负载一上来就偶发超时（实测同一用例在并行跑时 5.4s 挂掉）。
    // 这里放宽的是**墙钟阈值**，断言一条没少。
    testTimeout: 20000,
  },
})
