/**
 * Mock data for Wandesk UI standalone preview.
 * Provides realistic sample data for all API endpoints.
 */

export const mockSetupStatus = {
  initialized: true,
  welcomeSkipped: true,
}

export const mockAuthState = {
  authenticated: true,
  hasPassword: true,
}

export const mockSettings = {
  provider: "deepseek",
  apiUrl: "https://api.deepseek.com/v1",
  apiKey: "sk-mock-key-for-preview",
  model: "deepseek-chat",
  contextRounds: 100,
  enableToolResultTruncate: true,
  toolResultMaxChars: 12000,
  enableToolLoopLimit: true,
  toolMaxRounds: 50,
  language: "zh",
}

export const mockConversations = [
  {
    id: 1,
    conversation_id: "conv-001",
    title: "如何使用 React Hooks",
    description: "",
    scene: "chat",
    meta: null,
    state: "idle",
    pinned: 1,
    created_at: "2026-06-10 14:30:00",
  },
  {
    id: 2,
    conversation_id: "conv-002",
    title: "Python 数据分析入门",
    description: "",
    scene: "chat",
    meta: null,
    state: "idle",
    pinned: 0,
    created_at: "2026-06-09 10:15:00",
  },
  {
    id: 3,
    conversation_id: "conv-003",
    title: "Docker 部署最佳实践",
    description: "",
    scene: "chat",
    meta: null,
    state: "idle",
    pinned: 0,
    created_at: "2026-06-08 16:45:00",
  },
  {
    id: 4,
    conversation_id: "conv-004",
    title: "设计一个 RESTful API",
    description: "",
    scene: "chat",
    meta: null,
    state: "idle",
    pinned: 0,
    created_at: "2026-06-07 09:20:00",
  },
]

export const mockMessages: Record<string, any[]> = {
  "conv-001": [
    {
      _id: 1,
      role: "user",
      content: "React Hooks 是什么？怎么用？",
      _meta: {},
    },
    {
      _id: 2,
      role: "assistant",
      content:
        "React Hooks 是 React 16.8 引入的新特性，让你在函数组件中使用 state 和其他 React 特性。\n\n最常用的 Hooks 包括：\n\n- **useState**: 管理组件内部状态\n- **useEffect**: 处理副作用\n- **useContext**: 访问 Context\n- **useRef**: 引用 DOM 元素\n- **useMemo / useCallback**: 性能优化\n\n### 示例：useState\n\n```tsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      点击了 {count} 次\n    </button>\n  );\n}\n```\n\nHooks 的规则：\n1. 只在函数组件或自定义 Hook 中调用\n2. 只在顶层调用，不要在循环、条件或嵌套函数中调用",
    },
    { _id: 3, role: "user", content: "能再详细讲讲 useEffect 的清理函数吗？" },
    {
      _id: 4,
      role: "assistant",
      content:
        "当然！`useEffect` 的清理函数在组件卸载或 effect 重新执行前运行。\n\n```tsx\nuseEffect(() => {\n  const timer = setInterval(() => {\n    console.log('每秒执行');\n  }, 1000);\n\n  // 清理函数\n  return () => clearInterval(timer);\n}, []);\n```\n\n常见清理场景：\n- 取消订阅（WebSocket、EventEmitter）\n- 清除定时器\n- 取消请求（AbortController）\n- 移除事件监听",
    },
  ],
  "conv-002": [
    {
      _id: 5,
      role: "user",
      content: "推荐一些 Python 数据分析的库",
      _meta: {},
    },
    {
      _id: 6,
      role: "assistant",
      content:
        "Python 数据分析核心库：\n\n## 基础三件套\n\n| 库 | 用途 |\n|---|---|\n| **NumPy** | 数值计算，多维数组运算 |\n| **Pandas** | 数据处理，DataFrame 操作 |\n| **Matplotlib** | 基础绘图库 |\n\n## 进阶工具\n\n- **Seaborn**: 高级统计图表\n- **Polars**: 高性能 DataFrame（Rust 实现）\n- **Plotly**: 交互式图表\n\n```python\nimport pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.describe())\n```",
    },
  ],
  "conv-003": [
    { _id: 7, role: "user", content: "Docker 多阶段构建怎么用？", _meta: {} },
    {
      _id: 8,
      role: "assistant",
      content:
        '多阶段构建可大幅减小镜像大小。\n\n```dockerfile\n# 阶段 1: 构建\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# 阶段 2: 运行\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nEXPOSE 3000\nCMD ["node", "dist/index.js"]\n```\n\n优势：最终镜像不含源码和构建工具，体积可缩小 50%-90%。',
    },
  ],
  "conv-004": [
    {
      _id: 9,
      role: "user",
      content: "帮我设计一个用户管理的 RESTful API",
      _meta: {},
    },
    {
      _id: 10,
      role: "assistant",
      content:
        '## 用户管理 RESTful API\n\n| 方法 | 路径 | 说明 |\n|---|---|---|\n| GET | /api/users | 获取用户列表 |\n| GET | /api/users/:id | 获取单个用户 |\n| POST | /api/users | 创建用户 |\n| PUT | /api/users/:id | 更新用户 |\n| DELETE | /api/users/:id | 删除用户 |\n\n### 响应格式\n\n```json\n{\n  "code": 0,\n  "data": {\n    "id": 1,\n    "name": "张三",\n    "email": "zhangsan@example.com"\n  }\n}\n```',
    },
  ],
}

export const mockMemories = [
  {
    id: 1,
    title: "项目编码规范",
    description: "团队 TypeScript 编码规范摘要",
    content:
      "1. 使用 ESLint + Prettier\n2. 变量命名使用 camelCase\n3. 组件使用 PascalCase\n4. 避免 any 类型\n5. 优先使用 const",
    enabled: 1,
    pinned: 1,
    created_at: "2026-06-01 10:00:00",
    updated_at: "2026-06-05 14:30:00",
  },
  {
    id: 2,
    title: "常用 Git 命令",
    description: "日常开发常用的 Git 操作",
    content:
      "git stash - 暂存更改\ngit stash pop - 恢复暂存\ngit rebase -i HEAD~3 - 交互式变基\ngit cherry-pick <hash> - 选择性合并",
    enabled: 1,
    pinned: 0,
    created_at: "2026-05-20 09:00:00",
    updated_at: "2026-06-02 11:00:00",
  },
  {
    id: 3,
    title: "API 设计备忘",
    description: "RESTful API 设计要点",
    content:
      "- 使用名词复数形式\n- HTTP 方法语义化\n- 状态码要准确\n- 支持分页和过滤\n- 版本化 URL",
    enabled: 0,
    pinned: 0,
    created_at: "2026-05-15 16:00:00",
    updated_at: "2026-05-15 16:00:00",
  },
]

export const mockTasks = [
  {
    id: 1,
    conversation_id: "task-001",
    app: "chat",
    title: "分析代码仓库结构",
    mode: "agent",
    payload: JSON.stringify({
      messages: [{ role: "user", content: "分析当前代码仓库的目录结构" }],
    }),
    meta: null,
    response: "已完成",
    status: "done",
    error: null,
    created_at: "2026-06-10 15:00:00",
    finished_at: "2026-06-10 15:02:30",
  },
  {
    id: 2,
    conversation_id: "task-002",
    app: "chat",
    title: "生成单元测试",
    mode: "agent",
    payload: JSON.stringify({
      messages: [{ role: "user", content: "为 utils.ts 生成单元测试" }],
    }),
    meta: null,
    response: null,
    status: "running",
    error: null,
    created_at: "2026-06-11 09:30:00",
    finished_at: null,
  },
  {
    id: 3,
    conversation_id: "task-003",
    app: "chat",
    title: "翻译 README 文档",
    mode: "instant",
    payload: JSON.stringify({
      messages: [{ role: "user", content: "把 README.md 翻译成英文" }],
    }),
    meta: null,
    response: null,
    status: "error",
    error: "API 调用超时",
    created_at: "2026-06-09 11:00:00",
    finished_at: "2026-06-09 11:01:00",
  },
]

export const mockTaskMessages: Record<string, any[]> = {
  "1": [
    {
      id: 1,
      createdAt: "2026-06-10 15:00:00",
      message: { role: "user", content: "分析当前代码仓库的目录结构" },
    },
    {
      id: 2,
      createdAt: "2026-06-10 15:00:30",
      message: {
        role: "assistant",
        content: "好的，我来分析。",
        tool_calls: [
          {
            function: {
              name: "shell",
              arguments:
                '{"command":"find . -type f -name \'*.ts\' | head -50"}',
            },
          },
        ],
      },
    },
    {
      id: 3,
      createdAt: "2026-06-10 15:01:00",
      message: {
        role: "tool",
        content: "server/main/index.ts\nui/src/main.tsx\n...",
      },
    },
    {
      id: 4,
      createdAt: "2026-06-10 15:02:00",
      message: {
        role: "assistant",
        content:
          "## 分析结果\n\n这是一个 monorepo 结构，主要包含：\n1. **ui/** - React 前端\n2. **server/** - 后端服务\n\n架构清晰，前后端分离。",
      },
    },
  ],
  "2": [
    {
      id: 5,
      createdAt: "2026-06-11 09:30:00",
      message: { role: "user", content: "为 utils.ts 生成单元测试" },
    },
    {
      id: 6,
      createdAt: "2026-06-11 09:30:15",
      message: { role: "assistant", content: "正在分析 utils.ts..." },
    },
  ],
  "3": [
    {
      id: 7,
      createdAt: "2026-06-09 11:00:00",
      message: { role: "user", content: "把 README.md 翻译成英文" },
    },
  ],
}

export const mockFsRoots = [
  { name: "工作区", type: "dir", path: "files" },
  { name: "桌面", type: "dir", path: "desktop" },
]

export const mockFsItems: Record<string, any[]> = {
  files: [
    { name: "项目文档", type: "dir", path: "files/项目文档" },
    { name: "笔记", type: "dir", path: "files/笔记" },
    { name: "readme.md", type: "file", path: "files/readme.md" },
    { name: "config.json", type: "file", path: "files/config.json" },
  ],
  "files/项目文档": [
    { name: "需求文档.md", type: "file", path: "files/项目文档/需求文档.md" },
    { name: "技术方案.md", type: "file", path: "files/项目文档/技术方案.md" },
  ],
  "files/笔记": [
    { name: "学习笔记.md", type: "file", path: "files/笔记/学习笔记.md" },
    { name: "待办事项.md", type: "file", path: "files/笔记/待办事项.md" },
  ],
}

export const mockFileContents: Record<string, string> = {
  "files/readme.md":
    "# 项目说明\n\n这是一个示例项目。\n\n## 功能\n\n- 文件浏览\n- 文件编辑\n- 文件搜索",
  "files/config.json": '{\n  "name": "demo-project",\n  "version": "1.0.0"\n}',
  "files/项目文档/需求文档.md":
    "# 需求文档\n\n## 功能需求\n\n1. 用户管理\n2. 权限控制\n3. 数据报表",
  "files/笔记/学习笔记.md":
    "# 学习笔记\n\n## React 新特性\n\n- Server Components\n- Suspense 改进",
}

export const mockNotebooks = [
  {
    id: 1,
    content:
      "# 会议记录\n\n## 2026-06-10 周会\n\n- 讨论了新功能上线计划\n- 确定了技术方案\n- 分配了开发任务",
    style: 0,
    created_at: "2026-06-10 16:00:00",
    updated_at: "2026-06-10 16:30:00",
  },
  {
    id: 2,
    content:
      "# 读书笔记\n\n《重构》要点：\n- 代码的坏味道\n- 提取函数\n- 内联变量",
    style: 2,
    created_at: "2026-06-08 20:00:00",
    updated_at: "2026-06-08 21:00:00",
  },
  {
    id: 3,
    content: "# 灵感记录\n\n- 代码片段管理工具\n- 支持语法高亮\n- 按语言分类",
    style: 5,
    created_at: "2026-06-05 10:00:00",
    updated_at: "2026-06-05 10:15:00",
  },
]

export const mockFinanceRecords = [
  {
    id: 1,
    amount: -35.5,
    category: "餐饮",
    note: "午餐",
    date: "2026-06-11",
    created_at: "2026-06-11 12:30:00",
  },
  {
    id: 2,
    amount: -128,
    category: "交通",
    note: "打车",
    date: "2026-06-10",
    created_at: "2026-06-10 18:00:00",
  },
  {
    id: 3,
    amount: 15000,
    category: "工资",
    note: "6月工资",
    date: "2026-06-10",
    created_at: "2026-06-10 10:00:00",
  },
  {
    id: 4,
    amount: -299,
    category: "购物",
    note: "耳机",
    date: "2026-06-09",
    created_at: "2026-06-09 14:20:00",
  },
  {
    id: 5,
    amount: -45,
    category: "娱乐",
    note: "电影票",
    date: "2026-06-08",
    created_at: "2026-06-08 19:00:00",
  },
]

export const mockGithubTrending = [
  {
    repo: "anthropics/claude-code",
    description: "Claude Code - an agentic coding tool",
    language: "TypeScript",
    stars: 28500,
    todayStars: 1200,
  },
  {
    repo: "vercel/next.js",
    description: "The React Framework for the Web",
    language: "JavaScript",
    stars: 128000,
    todayStars: 850,
  },
  {
    repo: "microsoft/vscode",
    description: "Visual Studio Code",
    language: "TypeScript",
    stars: 165000,
    todayStars: 620,
  },
  {
    repo: "denoland/deno",
    description: "A modern runtime for JavaScript and TypeScript",
    language: "Rust",
    stars: 98000,
    todayStars: 450,
  },
  {
    repo: "sveltejs/svelte",
    description: "Cybernetically enhanced web apps",
    language: "JavaScript",
    stars: 82000,
    todayStars: 380,
  },
]

export const mockChatReply =
  "这是一个 Mock 回复。在独立前端项目中，AI 对话功能通过模拟数据展示。\n\n你可以：\n- 浏览各个应用的界面\n- 查看桌面窗口管理\n- 体验不同的壁纸主题\n- 测试各个功能模块的 UI\n\n如需真实 AI 对话，请连接后端服务。"
