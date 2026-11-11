import type { Note } from "./types"

const NOTES: readonly Note[] = [
  {
    id: "n-001",
    title: "二次函数图像的平移",
    subject: "数学",
    excerpt: "y = a(x-h)² + k：h 左右平移，k 上下平移……",
    content:
      "y = a(x-h)² + k 的图像可由 y = ax² 平移得到：\n- h > 0 右移 h 单位；h < 0 左移\n- k > 0 上移 k 单位；k < 0 下移\n- 顶点 (h, k)，对称轴 x = h\n\n易错点：先配方再读顶点，符号不要弄反。",
    state: "published",
    updatedAt: "2026-11-10",
    tags: ["函数", "图像"],
  },
  {
    id: "n-002",
    title: "文言文实词整理：走、去、汤",
    subject: "语文",
    excerpt: "走 = 跑（走马观花）；去 = 离开；汤 = 热水……",
    content:
      "高频实词古今异义：\n- 走：跑。例：走马观花、弃甲曳兵而走\n- 去：离开。例：去国怀乡\n- 汤：热水。例：赴汤蹈火\n\n方法：把现代义代入句子读不通时，优先查古今异义表。",
    state: "published",
    updatedAt: "2026-11-09",
    tags: ["文言文", "实词"],
  },
  {
    id: "n-003",
    title: "牛顿第三定律实验记录",
    subject: "物理",
    excerpt: "两个传感器对撞的 F-t 图像：作用力与反作用力等大反向……",
    content:
      "实验：两只力传感器对撞\n现象：F-t 曲线始终镜像对称\n结论：作用力与反作用力等大、反向、同时出现同时消失\n\n注意：它们作用在两个物体上，不能抵消。",
    state: "draft",
    updatedAt: "2026-11-11",
    tags: ["力学", "实验"],
  },
  {
    id: "n-004",
    title: "unit 6 词表：campus 相关",
    subject: "英语",
    excerpt: "campus / dormitory / lecture / seminar …",
    content:
      "unit 6 核心词：\n- campus n. 校园 on campus\n- dormitory n. 宿舍\n- lecture n. 讲座 attend a lecture\n- seminar n. 研讨课\n\n搭配默写 3 遍。",
    state: "draft",
    updatedAt: "2026-11-11",
    tags: ["词汇"],
  },
  {
    id: "n-005",
    title: "上学期错题本归档",
    subject: "数学",
    excerpt: "上学期的 37 道错题按章节归档完毕……",
    content: "已归档，仅供翻阅。复习时优先看函数与几何章节。",
    state: "archived",
    updatedAt: "2026-09-30",
    tags: ["错题"],
  },
]

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function listNotes(): Promise<readonly Note[]> {
  return delay(NOTES)
}

export function findNote(id: string): Note | undefined {
  return NOTES.find((n) => n.id === id)
}
