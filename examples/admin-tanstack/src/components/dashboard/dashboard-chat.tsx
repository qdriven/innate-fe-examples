import * as React from "react"
import { SendIcon } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  cn,
} from "@innate/ui"
interface Message {
  id: string
  text: string
  from: "agent" | "user"
}

const initialMessages: Array<Message> = [
  { id: "1", text: "您好，有什么可以帮您？", from: "agent" },
  { id: "2", text: "我的账户登录遇到了问题。", from: "user" },
  { id: "3", text: "请问具体是什么情况呢？", from: "agent" },
  { id: "4", text: "一直提示密码错误，但我确认密码是对的。", from: "user" },
]

interface DashboardChatProps {
  className?: string
}

export function DashboardChat({ className }: DashboardChatProps) {
  const [messages, setMessages] =
    React.useState<Array<Message>>(initialMessages)
  const [input, setInput] = React.useState("")

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, from: "user" },
    ])
    setInput("")
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center gap-3 border-b pb-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">SD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Sofia Davis</p>
          <p className="text-xs text-muted-foreground">m@example.com</p>
        </div>
      </CardHeader>
      <CardContent
        className="flex flex-1 flex-col overflow-hidden"
        style={{ padding: "var(--spacing-block)" }}
      >
        <div
          className="flex flex-1 flex-col overflow-y-auto"
          style={{ gap: "var(--spacing-block)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                msg.from === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted text-foreground"
              )}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <Input
            placeholder="输入消息..."
            className="flex-1 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend()
            }}
          />
          <Button size="icon" variant="outline" onClick={handleSend}>
            <SendIcon data-icon />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
