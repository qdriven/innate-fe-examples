import {
  AlarmClock,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  CookingPot,
  Drama,
  Gamepad2,
  KanbanSquare,
  KeyRound,
  Layers3,
  Leaf,
  Map,
  Package,
  Palette,
  PanelsTopLeft,
  PenLine,
  ReceiptText,
  Regex,
  Sparkles,
  Swords,
  Timer,
  UsersRound,
  Wrench,
  Zap,
} from "lucide-react"
import type { ComponentType } from "react"
import type { CSSProperties } from "react"
import { useMemo, useState } from "react"
import ChatApp from "../chat"
import { windowManager } from "../../system/windows"

type Template = {
  cat: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  name: string
  desc: string
}

const categories = [
  { key: "all", icon: Layers3, label: "全部", color: "#334155" },
  { key: "ai", icon: Brain, label: "AI 驱动", color: "#4f46e5" },
  { key: "tool", icon: Wrench, label: "工具", color: "#0369a1" },
  { key: "game", icon: Gamepad2, label: "游戏", color: "#7c3aed" },
  { key: "life", icon: Leaf, label: "生活", color: "#15803d" },
  { key: "business", icon: BriefcaseBusiness, label: "商业", color: "#b45309" },
  { key: "productivity", icon: Zap, label: "效率", color: "#0e7490" },
]

const templates: Template[] = [
  {
    cat: "ai",
    icon: ChartNoAxesCombined,
    name: "竞品分析",
    desc: "创建一个竞品分析应用，支持录入多个竞品名称、产品定位、价格、核心功能和目标用户，并自动生成对比表、优劣势总结、差异化建议和可执行的市场切入方向。界面要清晰，适合做策略分析。",
  },
  {
    cat: "ai",
    icon: PenLine,
    name: "营销文案",
    desc: "创建一个 AI 文案工作台,输入产品信息、目标用户、发布渠道和语气风格,生成标题、短文案、长文案、卖点总结以及多个改写版本。还应支持收藏、复制以及按场景切换模板。",
  },
  {
    cat: "ai",
    icon: ClipboardList,
    name: "方案生成器",
    desc: "创建一个提案生成应用，支持录入客户背景、项目目标、预算区间、时间周期和执行方案，自动整理成结构化提案，包括项目概述、交付内容、时间排期、报价说明和风险提示。",
  },
  {
    cat: "ai",
    icon: UsersRound,
    name: "模拟面试",
    desc: "创建一个面试助手应用，支持岗位描述、候选人简历、面试轮次和重点考察项，自动生成面试题、追问建议、评分维度、候选人评价记录和最终结论，适合招聘流程使用。",
  },
  {
    cat: "ai",
    icon: Map,
    name: "思维导图",
    desc: "创建一个思维导图应用，支持输入主题后自动拆分子主题、关键问题、行动建议和层级关系，能够以卡片或树形结构展示，并支持手动补充节点、折叠展开和导出大纲。",
  },
  {
    cat: "ai",
    icon: Drama,
    name: "用户画像",
    desc: "创建一个用户画像应用，支持根据用户群体、年龄、职业、消费能力、需求和痛点自动生成人物卡，包括典型场景、行为模式、决策因素、常见 objections 和产品机会点。",
  },
  {
    cat: "tool",
    icon: KeyRound,
    name: "密码生成器",
    desc: "创建一个密码工具应用，支持生成高强度密码、批量生成、按长度和字符规则自定义、密码强度评分、常用模板切换以及一键复制。界面简洁，强调安全感和效率。",
  },
  {
    cat: "tool",
    icon: Palette,
    name: "配色工坊",
    desc: "创建一个配色工具应用，支持主色输入后自动生成配色方案，包括互补色、邻近色、渐变色、浅深层级和按钮/背景/文字的实际应用示例，并支持一键复制 HEX/RGB 值。",
  },
  {
    cat: "tool",
    icon: Regex,
    name: "正则调试器",
    desc: "创建一个正则表达式工具应用，支持输入文本和规则进行实时匹配，展示命中结果、高亮片段、分组信息和常用规则示例，并提供测试区、说明区和错误提示。",
  },
  {
    cat: "game",
    icon: Gamepad2,
    name: "贪吃蛇",
    desc: "创建一个贪吃蛇小游戏，支持键盘操作、计分、速度递增、重新开始、暂停和移动端基础适配。整体风格不要太普通，可以更复古一点，操作和动画要顺滑。",
  },
  {
    cat: "game",
    icon: PanelsTopLeft,
    name: "记忆翻牌",
    desc: "创建一个记忆翻牌游戏，支持多种难度、计时、步数统计、完成结算和重新开始。卡片视觉要有趣，翻牌动画清晰，适合轻松休闲场景。",
  },
  {
    cat: "game",
    icon: Swords,
    name: "文字冒险",
    desc: "创建一个文字冒险游戏，支持角色状态、剧情分支、物品收集、对话推进和关键选择。界面要有氛围感，让用户像在看互动小说而不是普通表单。",
  },
  {
    cat: "life",
    icon: CookingPot,
    name: "食谱查找",
    desc: "创建一个菜谱应用，支持按食材、口味和烹饪方式筛选，展示做法步骤、准备时间、难度、用量清单和收藏功能，并且可以录入自己的私房菜谱。",
  },
  {
    cat: "life",
    icon: Timer,
    name: "倒数日",
    desc: "创建一个倒计时应用，支持多个事件卡片、目标日期设置、剩余时间显示、进度条、提醒文案和重要日分类，例如生日、旅行、考试和项目截止日。",
  },
  {
    cat: "business",
    icon: Package,
    name: "库存管理",
    desc: "创建一个库存管理应用，支持商品列表、分类、SKU、入库出库、当前库存、库存预警、供应商信息和按条件搜索筛选。需要有清晰的数据表格和方便的录入编辑体验。",
  },
  {
    cat: "business",
    icon: ReceiptText,
    name: "报价单生成",
    desc: "创建一个报价单应用，支持录入客户信息、项目名称、价格项、数量、税率、备注和有效期，自动计算总价并生成规范的报价清单，适合商务沟通和方案报价。",
  },
  {
    cat: "business",
    icon: UsersRound,
    name: "客户跟进看板",
    desc: "创建一个客户跟进应用,支持客户档案、来源渠道、跟进阶段、负责人、下次联系时间、跟进记录和成交状态,适合日常销售或咨询工作流。",
  },
  {
    cat: "productivity",
    icon: CalendarDays,
    name: "日程日历",
    desc: "创建一个日程日历应用,支持日、周、月视图,优先级、彩色标签、提醒时间、完成状态以及快速新建和编辑。整体体验应轻量高效。",
  },
  {
    cat: "productivity",
    icon: KanbanSquare,
    name: "项目看板",
    desc: "创建一个项目看板应用，支持待办、进行中、已完成三列，支持卡片拖拽、负责人、截止时间、标签和任务详情面板，适合个人或小团队管理项目。",
  },
  {
    cat: "productivity",
    icon: AlarmClock,
    name: "番茄专注",
    desc: "创建一个番茄钟应用，支持专注计时、短休息和长休息切换，显示今日专注次数、总时长、专注记录和提醒状态，界面要安静克制，适合长期使用。",
  },
]

const categoryColor = (key: string) =>
  categories.find((cat) => cat.key === key)?.color || "#2563eb"

export default function CreateAppApp() {
  const [prompt, setPrompt] = useState("")
  const [composing, setComposing] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedTpl, setSelectedTpl] = useState<string | null>(null)

  const filteredTemplates = useMemo(
    () =>
      activeCategory === "all"
        ? templates
        : templates.filter((item) => item.cat === activeCategory),
    [activeCategory]
  )
  const selectedTemplate = useMemo(
    () => templates.find((item) => item.name === selectedTpl) || null,
    [selectedTpl]
  )
  const boardAccent = selectedTemplate
    ? categoryColor(selectedTemplate.cat)
    : "#9b6a35"

  const selectTemplate = (template: Template) => {
    setPrompt(template.desc)
    setSelectedTpl(template.name)
  }

  const create = async () => {
    const message = prompt.trim()
    if (!message || composing) return
    await windowManager.openComponent({
      key: "chat",
      appId: "chat",
      title: "聊天",
      icon: "💬",
      component: ChatApp,
      defaultDesktopWindowSize: { w: 900, h: 640 },
      singleton: true,
      props: {
        id: null,
        pendingMessage: null,
        intentRequest: {
          requestId: `createapp-${Date.now()}`,
          intent: "new_and_send",
          payload: { message },
        },
      },
    })
    setPrompt("")
    setSelectedTpl(null)
  }

  return (
    <div className="createapp-shell flex h-full flex-col text-[#18242f]">
      <div className="createapp-top shrink-0 px-7 pb-5 pt-7">
        <div className="mx-auto max-w-[700px]">
          <div className="createapp-masthead flex items-start gap-3.5">
            <div className="createapp-emblem flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] text-[#fff8e9]">
              <Sparkles className="h-[17px] w-[17px]" strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[24px] font-semibold leading-tight text-[#2b2117]">
                {"创建新应用"}
              </h2>
              <p className="mt-1 text-[13px] leading-[1.55] text-[#756452]">
                {"描述你的想法，AI 帮你实现"}
              </p>
            </div>
          </div>
          <div
            className={`prompt-box createapp-board relative mt-5 ${selectedTemplate ? "has-template" : ""}`}
            style={{ "--accent": boardAccent } as CSSProperties}
          >
            <span className="createapp-board-clip" />
            <span className="createapp-board-pin createapp-board-pin-left" />
            <span className="createapp-board-pin createapp-board-pin-right" />
            <textarea
              value={prompt}
              rows={3}
              className="prompt-input w-full resize-none border px-5 py-4 pr-[128px] text-[13.5px] leading-[1.65] text-[#2b2117] outline-none transition placeholder:text-[#a39482]"
              placeholder="描述你想要的应用..."
              onChange={(event) => setPrompt(event.target.value)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault()
                  create()
                }
              }}
            />
            {selectedTemplate && (
              <span className="createapp-template-tag absolute left-5 top-3 inline-flex max-w-[calc(100%-170px)] items-center gap-1.5 truncate px-2 py-1 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="truncate">{selectedTemplate.name}</span>
              </span>
            )}
            <button
              className="create-button absolute bottom-3.5 right-3.5 inline-flex h-8 items-center gap-1.5 px-3.5 text-[12px] font-semibold text-[#fff7e7] transition disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!prompt.trim() || composing}
              onClick={create}
            >
              {"创建"}{" "}
              <ArrowRight className="h-[13px] w-[13px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-7 pb-3">
        <div className="category-group mx-auto flex max-w-[700px] flex-wrap gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.key}
                className={`category-button inline-flex items-center gap-1.5 border px-2.5 py-[5px] text-[11.5px] font-semibold transition ${activeCategory === cat.key ? "is-active" : ""}`}
                style={{ "--accent": cat.color } as CSSProperties}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span className="category-mark">
                  <Icon className="h-[12px] w-[12px]" strokeWidth={2} />
                </span>
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-8 pt-1 [scrollbar-width:thin]">
        <div className="mx-auto grid max-w-[700px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {filteredTemplates.map((template) => {
            const Icon = template.icon
            return (
              <button
                key={template.name}
                className={`template-card group relative flex min-h-[124px] flex-col border px-3.5 pb-3.5 pt-3 text-left transition ${selectedTpl === template.name ? "is-selected" : ""}`}
                style={
                  { "--accent": categoryColor(template.cat) } as CSSProperties
                }
                onClick={() => selectTemplate(template)}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="template-icon flex h-8 w-8 shrink-0 items-center justify-center">
                    <Icon className="h-[16px] w-[16px]" strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 truncate text-[13px] font-semibold text-[#2c241a]">
                    {template.name}
                  </span>
                </div>
                <p className="line-clamp-3 text-[11.5px] leading-[1.62] text-[#766857]">
                  {template.desc}
                </p>
              </button>
            )
          })}
        </div>
        {!filteredTemplates.length && (
          <div className="py-10 text-center text-[12.5px] text-[#8b99a7]">
            {"该分类下暂无灵感"}
          </div>
        )}
      </div>
    </div>
  )
}
