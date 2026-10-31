import CodeWorkspace from "../codeworkspace"

const tabs = [
  { id: "takeover", icon: "🧭", label: "接管" },
  { id: "chat", icon: "💬", label: "对话" },
  { id: "projects", icon: "🗂", label: "项目" },
  { id: "memory", icon: "🐙", label: "CLAUDE.md" },
  { id: "plans", icon: "🗺", label: "计划" },
  { id: "history", icon: "🕐", label: "历史" },
  { id: "skills", icon: "✨", label: "技能" },
  { id: "plugins", icon: "🧩", label: "插件" },
  { id: "agents", icon: "🤖", label: "智能体" },
  { id: "mcp", icon: "🌐", label: "MCP" },
  { id: "stats", icon: "📊", label: "统计" },
  { id: "settings", icon: "⚙️", label: "设置" },
  { id: "account", icon: "👤", label: "账户" },
]

const permissionModes = [
  {
    id: "default",
    label: "标准",
    description: "标准权限模式。Claude 按默认策略请求权限。",
  },
  {
    id: "plan",
    label: "规划",
    description: "先规划分析。适合在执行前讨论方案。",
  },
  {
    id: "auto",
    label: "自动",
    description: "自动选择权限策略，减少手动干预。",
  },
  {
    id: "acceptEdits",
    label: "接受编辑",
    description: "优先直接接受代码编辑操作。",
  },
  { id: "dontAsk", label: "不询问", description: "尽量不请求确认，直接继续。" },
  {
    id: "bypassPermissions",
    label: "跳过权限",
    description: "跳过权限检查。风险最高，仅在完全可信的环境中使用。",
  },
]

export default function ClaudeCodeApp() {
  return (
    <CodeWorkspace
      basePath="/apps/claude-code"
      title="Claude Code"
      emptyIcon="🐙"
      memoryLabel="全局 Claude Code 指令"
      projectLabel="~/.claude/projects/ 下的子目录"
      tabs={tabs}
      defaultPermissionMode="default"
      permissionModes={permissionModes}
    />
  )
}
