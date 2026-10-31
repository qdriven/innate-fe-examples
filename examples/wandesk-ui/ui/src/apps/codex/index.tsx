import CodeWorkspace from "../codeworkspace"

const tabs = [
  { id: "takeover", icon: "🧭", label: "接管" },
  { id: "chat", icon: "💬", label: "聊天" },
  { id: "projects", icon: "🗂", label: "会话" },
  { id: "memory", icon: "🤖", label: "AGENTS.md" },
  { id: "history", icon: "🕐", label: "历史" },
  { id: "skills", icon: "✨", label: "技能" },
  { id: "mcp", icon: "🌐", label: "MCP" },
  { id: "settings", icon: "⚙️", label: "设置" },
  { id: "account", icon: "👤", label: "账户" },
]

const permissionModes = [
  {
    id: "workspaceWrite",
    label: "工作区",
    description: "工作区写入模式。必要时请求确认,适用于大多数编码改动。",
  },
  {
    id: "readOnly",
    label: "只读",
    description: "只读模式,用于检查与分析,不会直接修改文件。",
  },
  {
    id: "fullAuto",
    label: "自动",
    description: "低干预自动执行,等同于 Codex --full-auto。",
  },
  {
    id: "neverAsk",
    label: "不询问",
    description: "工作区写入模式,尽可能关闭审批确认。",
  },
  {
    id: "dangerFullAccess",
    label: "高风险",
    description: "完整磁盘写入权限。风险高,仅在完全可控的环境下使用。",
  },
  {
    id: "bypassPermissions",
    label: "跳过权限",
    description: "绕过审批与沙箱,风险最高。",
  },
]

export default function CodexApp() {
  return (
    <CodeWorkspace
      basePath="/apps/codex"
      title="Codex"
      emptyIcon="🤖"
      memoryLabel="Codex 全局指令"
      projectLabel="Codex 会话目录"
      tabs={tabs}
      defaultPermissionMode="workspaceWrite"
      permissionModes={permissionModes}
    />
  )
}
