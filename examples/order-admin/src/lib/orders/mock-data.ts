import type { Order, OrderCategoryMeta, OrderInput } from "./types"

/**
 * mock-first 的内存订单仓：service 是唯一入口，页面不直接读这里。
 * 切真实后端时删除本文件，service 改为 fetch。
 */

const SEED_LINES = [
  [
    { sku: "SKU-1001", name: "工业传感器 S-200", quantity: 20, unitPrice: 320 },
    { sku: "SKU-1002", name: "网关模块 GW-8", quantity: 2, unitPrice: 1480 },
  ],
  [{ sku: "SKU-2001", name: "精密轴承 BR-45", quantity: 100, unitPrice: 46 }],
  [
    { sku: "SKU-3001", name: "伺服电机 SM-750", quantity: 4, unitPrice: 5600 },
    { sku: "SKU-3002", name: "驱动器 DV-12", quantity: 4, unitPrice: 2100 },
    { sku: "SKU-3003", name: "线缆组件 CB-2M", quantity: 8, unitPrice: 180 },
  ],
  [{ sku: "SKU-4001", name: "控制面板 CP-15", quantity: 1, unitPrice: 9800 }],
  [
    { sku: "SKU-5001", name: "滤芯组 FL-30", quantity: 30, unitPrice: 95 },
    { sku: "SKU-5002", name: "密封圈套装 SK-9", quantity: 50, unitPrice: 12 },
  ],
  [{ sku: "SKU-6001", name: "高速主轴 MH-120", quantity: 2, unitPrice: 12800 }],
  [{ sku: "SKU-7001", name: "输送带 BD-5M", quantity: 8, unitPrice: 760 }],
  [{ sku: "SKU-8001", name: "耗材滤芯套组", quantity: 40, unitPrice: 68 }],
  [{ sku: "SKU-9001", name: "配电柜 PC-40", quantity: 3, unitPrice: 15600 }],
] as const

interface SeedSpec {
  id: string
  customer: string
  status: Order["status"]
  category: Order["category"]
  categoryMeta?: OrderCategoryMeta
  reviewState: Order["reviewState"]
  reviewReason?: string
  reviewDecidedAt?: string
  note: string
  createdAt: string
  updatedAt: string
  lines: (typeof SEED_LINES)[number]
}

/**
 * 既有 5 条种子（0001..0005）的 id 与 status 一个不动——e2e 与既有测试
 * 依赖其存在性与状态；只补 category / reviewState 与追加 0006+。
 */
const SEED: readonly SeedSpec[] = [
  {
    id: "ORD-2026-0001",
    customer: "华东智造有限公司",
    status: "paid",
    category: "framework",
    categoryMeta: {
      kind: "framework",
      contractNo: "HT-2026-Q4-018",
      creditLimit: 800000,
      creditUsed: 246000,
      validUntil: "2027-06-30",
    },
    reviewState: "approved",
    reviewDecidedAt: "2026-10-03T02:00:00.000Z",
    note: "Q4 框架采购，分两批交付",
    createdAt: "2026-10-02T09:15:00.000Z",
    updatedAt: "2026-10-12T14:30:00.000Z",
    lines: SEED_LINES[0],
  },
  {
    id: "ORD-2026-0002",
    customer: "临港装备集团",
    status: "draft",
    category: "standard",
    categoryMeta: {
      kind: "standard",
      dueDate: "2026-11-15",
      logisticsMethod: "德邦物流",
    },
    reviewState: "pending",
    note: "",
    createdAt: "2026-10-18T11:00:00.000Z",
    updatedAt: "2026-10-18T11:00:00.000Z",
    lines: SEED_LINES[1],
  },
  {
    id: "ORD-2026-0003",
    customer: "南州传动科技",
    status: "shipped",
    category: "urgent",
    categoryMeta: {
      kind: "urgent",
      slaHours: 24,
      rushRate: 1.2,
      escalationContact: "值班经理 138-0000-0000",
    },
    reviewState: "approved",
    reviewDecidedAt: "2026-09-21T09:00:00.000Z",
    note: "指定物流：顺丰重货",
    createdAt: "2026-09-21T08:40:00.000Z",
    updatedAt: "2026-10-20T16:05:00.000Z",
    lines: SEED_LINES[2],
  },
  {
    id: "ORD-2026-0004",
    customer: "华北电控股份",
    status: "completed",
    category: "subscription",
    categoryMeta: {
      kind: "subscription",
      cycleDays: 30,
      nextRestockAt: "2026-11-30",
      restockCount: 6,
    },
    reviewState: "approved",
    reviewDecidedAt: "2026-08-30T11:00:00.000Z",
    note: "已验收，含安装调试",
    createdAt: "2026-08-30T10:20:00.000Z",
    updatedAt: "2026-10-09T09:45:00.000Z",
    lines: SEED_LINES[3],
  },
  {
    id: "ORD-2026-0005",
    customer: "西部流体设备",
    status: "cancelled",
    category: "standard",
    categoryMeta: {
      kind: "standard",
      dueDate: "2026-10-20",
      logisticsMethod: "顺丰重货",
    },
    reviewState: "rejected",
    reviewReason: "预算不足，退回修改",
    reviewDecidedAt: "2026-09-06T07:30:00.000Z",
    note: "客户预算调整，明年重下",
    createdAt: "2026-09-05T15:30:00.000Z",
    updatedAt: "2026-09-06T08:10:00.000Z",
    lines: SEED_LINES[4],
  },
  {
    id: "ORD-2026-0006",
    customer: "岭南自动化科技",
    status: "confirmed",
    category: "urgent",
    categoryMeta: {
      kind: "urgent",
      slaHours: 12,
      rushRate: 1.5,
      escalationContact: "生产调度中心 400-800-1234",
    },
    reviewState: "approved",
    reviewDecidedAt: "2026-10-05T03:00:00.000Z",
    note: "产线急单，已排产",
    createdAt: "2026-10-05T02:00:00.000Z",
    updatedAt: "2026-10-07T06:30:00.000Z",
    lines: SEED_LINES[5],
  },
  {
    id: "ORD-2026-0007",
    customer: "东海精密仪器",
    status: "completed",
    category: "standard",
    categoryMeta: {
      kind: "standard",
      dueDate: "2026-10-10",
      logisticsMethod: "顺丰重货",
    },
    reviewState: "approved",
    reviewDecidedAt: "2026-09-14T04:00:00.000Z",
    note: "例行补件，已验收",
    createdAt: "2026-09-14T03:20:00.000Z",
    updatedAt: "2026-10-11T10:00:00.000Z",
    lines: SEED_LINES[6],
  },
  {
    id: "ORD-2026-0008",
    customer: "北原食品机械",
    status: "draft",
    category: "subscription",
    categoryMeta: {
      kind: "subscription",
      cycleDays: 30,
      nextRestockAt: "2026-11-21",
      restockCount: 11,
    },
    reviewState: "pending",
    note: "月度订阅补货",
    createdAt: "2026-10-21T09:00:00.000Z",
    updatedAt: "2026-10-21T09:00:00.000Z",
    lines: SEED_LINES[7],
  },
  {
    id: "ORD-2026-0009",
    customer: "中州基建集团",
    status: "draft",
    category: "framework",
    categoryMeta: {
      kind: "framework",
      contractNo: "HT-2026-0902-007",
      creditLimit: 500000,
      creditUsed: 96000,
      validUntil: "2027-03-31",
    },
    reviewState: "pending",
    note: "框架协议下单，待审批",
    createdAt: "2026-10-27T14:00:00.000Z",
    updatedAt: "2026-10-27T14:00:00.000Z",
    lines: SEED_LINES[8],
  },
]

let store: Order[]
let nextNumber: number

function seedStore(): void {
  store = SEED.map((spec) => ({
    ...spec,
    lines: spec.lines.map((line, index) => ({
      ...line,
      id: `${spec.id}-L${index + 1}`,
    })),
  }))
  nextNumber = SEED.length + 1
}

seedStore()

export function resetOrders(): void {
  seedStore()
}

export function findAll(): Order[] {
  return [...store]
}

export function findById(id: string): Order | undefined {
  return store.find((order) => order.id === id)
}

function nextOrderId(): string {
  return `ORD-2026-${String(nextNumber++).padStart(4, "0")}`
}

export function insertOrder(input: OrderInput, now: string): Order {
  const id = nextOrderId()
  const order: Order = {
    id,
    customer: input.customer,
    status: "draft",
    category: input.category,
    categoryMeta: input.categoryMeta,
    // 新建草稿即进入待审队列（审核维度与履约 status 正交）
    reviewState: "pending",
    note: input.note,
    lines: input.lines.map((line, index) => ({
      ...line,
      id: `${id}-L${index + 1}`,
    })),
    createdAt: now,
    updatedAt: now,
  }
  store = [order, ...store]
  return order
}

export function replaceOrder(id: string, next: Order): void {
  store = store.map((order) => (order.id === id ? next : order))
}
