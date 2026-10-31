import fs from "node:fs"
import path from "node:path"

import type { PipelineResult } from "./pipeline"

// Playground 状态：落盘于 data/playground-state.json（dev server 重启保留）。
// 单活动槽位：最近一次编译成功的用户契约覆盖整个验证台的展示数据。
//
// 读取始终以文件为准、不做内存缓存：Turbopack dev 下页面与 API 路由
// 可能持有不同的模块实例，缓存会让页面读不到 API 刚写入的状态。
// 文件只有十几 KB，同步读取代价可忽略。

export interface PlaygroundState {
  createdAt: string
  description: string
  engine: "llm" | "heuristic"
  skel: string
  result: PipelineResult
}

const STATE_FILE = path.join(process.cwd(), "data", "playground-state.json")

export function loadPlayground(): PlaygroundState | null {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) as PlaygroundState
    }
  } catch {
    return null
  }
  return null
}

export function savePlayground(state: PlaygroundState): void {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true })
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
}

export function clearPlayground(): void {
  if (fs.existsSync(STATE_FILE)) fs.rmSync(STATE_FILE)
}
