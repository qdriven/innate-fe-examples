import { NextResponse } from "next/server"

import { runPipeline } from "@/lib/server/pipeline"
import { savePlayground } from "@/lib/server/store"

export const runtime = "nodejs"
export const maxDuration = 300

// POST /api/compile {skel, description?, engine?}
// 在服务端沙箱里执行完整流水线：
//   skelc check → skel2lean → lean 编译（kernel）→ schema snapshot → gen go
// 编译成功（check + lean 均通过）时把结果存为验证台的当前展示数据。
export async function POST(request: Request) {
  let skel: string
  let description = ""
  let engine: "llm" | "heuristic" = "heuristic"
  try {
    const body = (await request.json()) as {
      skel?: string
      description?: string
      engine?: "llm" | "heuristic"
    }
    skel = (body.skel ?? "").trim()
    description = (body.description ?? "").trim()
    if (body.engine === "llm") engine = "llm"
  } catch {
    return NextResponse.json({ error: "请求体必须是 JSON" }, { status: 400 })
  }
  if (!skel) {
    return NextResponse.json({ error: "缺少 skel 字段" }, { status: 400 })
  }

  const result = runPipeline(skel)
  if (result.ok) {
    savePlayground({
      createdAt: new Date().toISOString(),
      description: description || "(未提供描述)",
      engine,
      skel,
      result,
    })
  }
  return NextResponse.json({ result })
}
