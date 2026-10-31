import { NextResponse } from "next/server"

import { clearPlayground } from "@/lib/server/store"

export const runtime = "nodejs"

// POST /api/reset —— 清除 Playground 覆盖，验证台恢复展示基线 commerce 演示。
export async function POST() {
  clearPlayground()
  return NextResponse.json({ ok: true })
}
