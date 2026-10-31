import { NextResponse } from "next/server"

import { llmStatus } from "@/lib/server/llm"
import { getActiveSnapshot } from "@/lib/view"

export const runtime = "nodejs"

// GET /api/state —— 当前模式（baseline / playground）、LLM 通道可用性与活动快照。
export async function GET() {
  const { snapshot, playground } = getActiveSnapshot()
  return NextResponse.json({
    mode: playground ? "playground" : "baseline",
    playground: playground
      ? {
          domain: playground.result.domain,
          engine: playground.engine,
          createdAt: playground.createdAt,
        }
      : null,
    llm: llmStatus(),
    snapshot,
  })
}
