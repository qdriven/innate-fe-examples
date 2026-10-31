/**
 * Mock WebSocket for Wandesk UI standalone preview.
 * Simulates chat streaming when no real server is available.
 */

import { mockChatReply } from "./data"

export function installMockWs() {
  window.WebSocket = class MockWebSocket extends EventTarget {
    readyState = 0
    url: string
    onopen: ((ev: Event) => void) | null = null
    onclose: ((ev: CloseEvent) => void) | null = null
    onmessage: ((ev: MessageEvent) => void) | null = null
    onerror: ((ev: Event) => void) | null = null
    CONNECTING = 0
    OPEN = 1
    CLOSING = 2
    CLOSED = 3
    private pingTimer: ReturnType<typeof setInterval> | null = null

    constructor(url: string | URL, _protocols?: string | string[]) {
      super()
      this.url = url.toString()
      setTimeout(() => {
        this.readyState = 1
        const ev = new Event("open")
        this.onopen?.(ev)
        this.dispatchEvent(ev)
        this.pingTimer = setInterval(() => {}, 30000)
      }, 100)
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
      if (this.readyState !== 1) return
      let parsed: any
      try {
        parsed = typeof data === "string" ? JSON.parse(data) : null
      } catch {
        return
      }
      if (!parsed) return

      if (parsed.type === "ping") {
        setTimeout(() => this.emit({ type: "pong" }), 50)
        return
      }
      if (parsed.type === "message") {
        this.simulateStreaming(parsed.conversationId, mockChatReply)
        return
      }
      if (parsed.type === "abort") {
        setTimeout(
          () =>
            this.emit({
              type: "aborted",
              conversationId: parsed.conversationId,
            }),
          50
        )
      }
    }

    close(code?: number, reason?: string) {
      if (this.pingTimer) clearInterval(this.pingTimer)
      this.readyState = 3
      const ev = new CloseEvent("close", {
        code: code || 1000,
        reason: reason || "",
      })
      this.onclose?.(ev)
      this.dispatchEvent(ev)
    }

    private emit(data: any) {
      const ev = new MessageEvent("message", { data: JSON.stringify(data) })
      this.onmessage?.(ev)
      this.dispatchEvent(ev)
    }

    private simulateStreaming(conversationId: string, fullText: string) {
      const chars = [...fullText]
      let i = 0
      const sendNext = () => {
        if (i >= chars.length) {
          setTimeout(
            () =>
              this.emit({
                type: "done",
                conversationId,
                content: fullText,
                remark: "",
              }),
            100
          )
          return
        }
        // Send 1-4 chars at a time for realistic streaming
        const chunkSize = 1 + Math.floor(Math.random() * 3)
        const chunk = chars.slice(i, i + chunkSize).join("")
        i += chunkSize
        this.emit({ type: "delta", conversationId, delta: chunk })
        setTimeout(sendNext, 20 + Math.random() * 50)
      }
      setTimeout(sendNext, 300 + Math.random() * 500)
    }
  } as any

  ;(window.WebSocket as any).CONNECTING = 0
  ;(window.WebSocket as any).OPEN = 1
  ;(window.WebSocket as any).CLOSING = 2
  ;(window.WebSocket as any).CLOSED = 3
}
