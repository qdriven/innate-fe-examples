import type { LearningModule } from "./types"

export const learningModules: LearningModule[] = [
  {
    id: "letters",
    title: "字母花园",
    emoji: "🌱",
    tagline: "跟 A B C 一起开花",
    age: "3-6 岁",
    minutes: 8,
    activity: "找到卡片里藏着的小写字母",
  },
  {
    id: "numbers",
    title: "数字牧场",
    emoji: "🐑",
    tagline: "数一数，喂一喂小羊",
    age: "4-7 岁",
    minutes: 10,
    activity: "把 3 只小羊牵回围栏",
  },
  {
    id: "drawing",
    title: "涂鸦工作台",
    emoji: "🖍️",
    tagline: "用蜡笔画出彩虹",
    age: "3-9 岁",
    minutes: 12,
    activity: "给纸上的太阳画三条光线",
  },
  {
    id: "stories",
    title: "故事小屋",
    emoji: "📖",
    tagline: "听一个小勇气的故事",
    age: "4-8 岁",
    minutes: 6,
    activity: "猜猜小猫找到了什么钥匙",
  },
]
