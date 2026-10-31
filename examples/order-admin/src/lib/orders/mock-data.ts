import type { Order, OrderInput } from "./types"

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
] as const

interface SeedSpec {
  id: string
  customer: string
  status: Order["status"]
  note: string
  createdAt: string
  updatedAt: string
  lines: (typeof SEED_LINES)[number]
}

const SEED: readonly SeedSpec[] = [
  {
    id: "ORD-2026-0001",
    customer: "华东智造有限公司",
    status: "paid",
    note: "Q4 框架采购，分两批交付",
    createdAt: "2026-10-02T09:15:00.000Z",
    updatedAt: "2026-10-12T14:30:00.000Z",
    lines: SEED_LINES[0],
  },
  {
    id: "ORD-2026-0002",
    customer: "临港装备集团",
    status: "draft",
    note: "",
    createdAt: "2026-10-18T11:00:00.000Z",
    updatedAt: "2026-10-18T11:00:00.000Z",
    lines: SEED_LINES[1],
  },
  {
    id: "ORD-2026-0003",
    customer: "南州传动科技",
    status: "shipped",
    note: "指定物流：顺丰重货",
    createdAt: "2026-09-21T08:40:00.000Z",
    updatedAt: "2026-10-20T16:05:00.000Z",
    lines: SEED_LINES[2],
  },
  {
    id: "ORD-2026-0004",
    customer: "华北电控股份",
    status: "completed",
    note: "已验收，含安装调试",
    createdAt: "2026-08-30T10:20:00.000Z",
    updatedAt: "2026-10-09T09:45:00.000Z",
    lines: SEED_LINES[3],
  },
  {
    id: "ORD-2026-0005",
    customer: "西部流体设备",
    status: "cancelled",
    note: "客户预算调整，明年重下",
    createdAt: "2026-09-05T15:30:00.000Z",
    updatedAt: "2026-09-06T08:10:00.000Z",
    lines: SEED_LINES[4],
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
