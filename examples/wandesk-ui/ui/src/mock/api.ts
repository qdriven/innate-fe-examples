/**
 * Mock API interceptor for Wandesk UI standalone preview.
 * Intercepts fetch() calls and returns mock data.
 */

import {
  mockSetupStatus,
  mockAuthState,
  mockSettings,
  mockConversations,
  mockMessages,
  mockMemories,
  mockTasks,
  mockTaskMessages,
  mockFsRoots,
  mockFsItems,
  mockFileContents,
  mockNotebooks,
  mockFinanceRecords,
  mockGithubTrending,
} from "./data"

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const notFound = () => json({ error: "Not found" }, 404)

let nextConvId = 100
const createdConversations = new Map<string, any>()

function handleApi(url: string, options: RequestInit = {}): Response | null {
  const method = (options.method || "GET").toUpperCase()
  let body: any = null
  try {
    body = options.body ? JSON.parse(options.body as string) : null
  } catch {}

  const path = new URL(url, location.origin).pathname

  // Settings / Setup
  if (path === "/api/settings/setup") return json(mockSetupStatus)
  if (path === "/api/auth/state") return json(mockAuthState)
  if (path === "/api/auth/login" && method === "POST") return json({ ok: true })
  if (path === "/api/auth/logout" && method === "POST")
    return json({ ok: true })
  if (path === "/api/auth/setup" && method === "POST") return json({ ok: true })
  if (path === "/api/settings" && method === "GET") return json(mockSettings)
  if (path === "/api/settings" && method === "POST") return json({ ok: true })
  if (path === "/api/settings/prompt" && method === "GET")
    return json({ prompt: "You are a helpful AI assistant." })
  if (path === "/api/settings/prompt" && method === "POST")
    return json({ ok: true })

  // Chat
  if (path === "/api/chat/list")
    return json([...mockConversations, ...createdConversations.values()])
  if (path === "/api/chat/create" && method === "POST") {
    const id = `conv-mock-${nextConvId++}`
    createdConversations.set(id, {
      id: nextConvId,
      conversation_id: id,
      title: body?.title || "新对话",
      description: "",
      scene: body?.scene || "chat",
      meta: null,
      state: "idle",
      pinned: 0,
      created_at: new Date().toISOString().replace("T", " ").slice(0, 19),
    })
    return json({ conversationId: id })
  }
  if (path === "/api/chat/messages") {
    const params = new URL(url, location.origin).searchParams
    const convId = params.get("conversationId") || ""
    const offset = Number(params.get("offset") || 0)
    const limit = Number(params.get("limit") || 20)
    const msgs = mockMessages[convId] || []
    return json({
      hasMore: offset + limit < msgs.length,
      offset,
      messages: msgs.slice(offset, offset + limit),
    })
  }
  if (path === "/api/chat/rename" && method === "POST")
    return json({ ok: true })
  if (path === "/api/chat/delete" && method === "POST")
    return json({ ok: true })
  if (path === "/api/chat/pin" && method === "POST") return json({ ok: true })
  if (path === "/api/chat/attachments/upload" && method === "POST")
    return json({
      file: {
        type: "file",
        name: body?.name || "file",
        path: `/uploads/${body?.name}`,
        size: 1024,
      },
    })
  if (path === "/api/chat/remarks") return json({ remarks: [] })
  if (path === "/api/llm/providers") return json({ groups: [], providers: [] })

  // Memory
  if (path === "/api/memory/list") return json({ items: mockMemories })
  if (path === "/api/memory/get") {
    const id = Number(new URL(url, location.origin).searchParams.get("id"))
    const item = mockMemories.find((m) => m.id === id)
    return item ? json({ item }) : notFound()
  }
  if (path === "/api/memory/create" && method === "POST")
    return json({ ok: true, id: 999 })
  if (path === "/api/memory/update" && method === "POST")
    return json({ ok: true })
  if (path === "/api/memory/delete" && method === "POST")
    return json({ ok: true })

  // Tasks
  if (path === "/api/task") return json(mockTasks)
  if (path === "/api/task/detail") {
    const id = Number(new URL(url, location.origin).searchParams.get("id"))
    const task = mockTasks.find((t) => t.id === id)
    return task ? json({ task }) : notFound()
  }
  if (path === "/api/task/messages") {
    const id = new URL(url, location.origin).searchParams.get("id") || ""
    return json({ messages: mockTaskMessages[id] || [] })
  }
  if (path === "/api/task/stop" && method === "POST") return json({ ok: true })
  if (path === "/api/task/create/instant" && method === "POST")
    return json({ ok: true, id: nextConvId++ })
  if (path === "/api/task/create/agent" && method === "POST")
    return json({ ok: true, id: nextConvId++ })

  // Filesystem
  if (path === "/api/fs/roots") return json(mockFsRoots)
  if (path === "/api/fs/list") {
    const dirPath =
      new URL(url, location.origin).searchParams.get("path") || "files"
    return json(mockFsItems[dirPath] || [])
  }
  if (path === "/api/fs/read") {
    const filePath =
      new URL(url, location.origin).searchParams.get("path") || ""
    const content = mockFileContents[filePath]
    return content !== undefined ? json({ content }) : notFound()
  }
  if (path === "/api/fs/write" && method === "POST") return json({ ok: true })
  if (path === "/api/fs/mkdir" && method === "POST") return json({ ok: true })
  if (path === "/api/fs/delete" && method === "POST") return json({ ok: true })
  if (path === "/api/fs/upload" && method === "POST") return json({ ok: true })

  // Apps: Notebook
  if (path.startsWith("/apps/notebook/")) {
    if (path === "/apps/notebook/list" || path === "/apps/notebook/") {
      const params = new URL(url, location.origin).searchParams
      const page = Number(params.get("page") || 1)
      const pageSize = Number(params.get("pageSize") || 12)
      const start = (page - 1) * pageSize
      return json({
        items: mockNotebooks.slice(start, start + pageSize),
        total: mockNotebooks.length,
        page,
        pageSize,
        totalPages: Math.ceil(mockNotebooks.length / pageSize),
      })
    }
    if (path === "/apps/notebook/create" && method === "POST")
      return json({ ok: true, id: 999 })
    if (path === "/apps/notebook/update" && method === "POST")
      return json({ ok: true })
    if (path === "/apps/notebook/delete" && method === "POST")
      return json({ ok: true })
  }

  // Apps: Finance
  if (path.startsWith("/apps/finance/")) {
    if (path === "/apps/finance/list" || path === "/apps/finance/")
      return json({
        items: mockFinanceRecords,
        total: mockFinanceRecords.length,
      })
    if (path === "/apps/finance/create" && method === "POST")
      return json({ ok: true, id: 999 })
    if (path === "/apps/finance/delete" && method === "POST")
      return json({ ok: true })
    if (path === "/apps/finance/summary") {
      const income = mockFinanceRecords
        .filter((r) => r.amount > 0)
        .reduce((s, r) => s + r.amount, 0)
      const expense = mockFinanceRecords
        .filter((r) => r.amount < 0)
        .reduce((s, r) => s + Math.abs(r.amount), 0)
      return json({ income, expense, balance: income - expense })
    }
  }

  // Apps: GitHub Trending
  if (path.startsWith("/apps/ghtrending/"))
    return json({ items: mockGithubTrending })

  // Apps: generic catch-all
  if (path.startsWith("/apps/")) return json({ items: [], ok: true })

  // Runtime
  if (path === "/api/runtime/reload/request" && method === "POST")
    return json({ ok: true })
  if (path === "/api/runtime/reload" && method === "POST")
    return json({ ok: true })
  if (path === "/api/runtime/language/apply" && method === "POST")
    return json({ ok: true })

  return null
}

export function installMockApi() {
  const originalFetch = window.fetch.bind(window)
  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url
    if (url.startsWith("/") || url.startsWith(location.origin)) {
      const response = handleApi(url, init)
      if (response) return response
    }
    return originalFetch(input, init)
  }
}
