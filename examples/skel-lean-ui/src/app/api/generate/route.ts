import { NextResponse } from "next/server"

import { heuristicSkel } from "@/lib/server/heuristic"
import { llmGenerateSkel, llmStatus, quickCheck } from "@/lib/server/llm"

export const runtime = "nodejs"
export const maxDuration = 300

// POST /api/generate {description}
// 自然语言 → Skel。优先 LLM（arkcli），失败/未登录退回启发式引擎。
// 返回 {engine, skel, notes, attempts} —— skel 可直接进入编辑器。
export async function POST(request: Request) {
  let description: string
  try {
    const body = (await request.json()) as { description?: string }
    description = (body.description ?? "").trim()
  } catch {
    return NextResponse.json({ error: "请求体必须是 JSON" }, { status: 400 })
  }
  if (description.length < 4) {
    return NextResponse.json(
      { error: "描述太短了：请至少写一句话（≥4 字符）" },
      { status: 400 }
    )
  }

  const status = llmStatus()
  if (status.available) {
    const llm = llmGenerateSkel(description, quickCheck)
    if (llm.ok && llm.skel) {
      return NextResponse.json({
        engine: "llm",
        skel: llm.skel,
        notes: [`模型生成并通过 skelc 校验（${llm.attempts.length} 轮）`],
        attempts: llm.attempts,
        llmModel: status.model,
      })
    }
    // LLM 生成失败：带着它的尝试记录退回启发式
    const fallback = heuristicSkel(description)
    return NextResponse.json({
      engine: "heuristic",
      skel: fallback.skel,
      notes: [
        `LLM 生成未通过校验（${llm.error ?? "未知错误"}），已退回本地启发式引擎`,
        ...fallback.notes,
      ],
      attempts: llm.attempts,
    })
  }

  const fallback = heuristicSkel(description)
  return NextResponse.json({
    engine: "heuristic",
    skel: fallback.skel,
    notes: [
      `LLM 通道不可用（${status.reason}），使用本地启发式引擎`,
      ...fallback.notes,
    ],
    attempts: [],
  })
}
