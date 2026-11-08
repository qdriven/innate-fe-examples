import { InfoListCard } from "@innate/scene-catalog/scene-blocks"
import {
  ORDER_CATEGORY_LABELS,
  type Order,
  type OrderCategoryMeta,
} from "../../lib/orders/types"

interface MetaItem {
  label: string
  value: string
}

/**
 * 按订单种类组装差异化区块的标题与键值：
 * standard 交付信息 / urgent 加急 SLA / subscription 订阅周期 / framework 协议额度。
 * categoryMeta 缺失或 kind 与种类不匹配时，值统一兜底「—」。
 */
function buildSection(order: Order): { title: string; items: MetaItem[] } {
  const meta: OrderCategoryMeta | undefined = order.categoryMeta
  switch (order.category) {
    case "standard": {
      const m = meta?.kind === "standard" ? meta : null
      return {
        title: "交付信息",
        items: [
          { label: "交期", value: m?.dueDate ?? "—" },
          { label: "物流方式", value: m?.logisticsMethod ?? "—" },
        ],
      }
    }
    case "urgent": {
      const m = meta?.kind === "urgent" ? meta : null
      return {
        title: "加急 SLA",
        items: [
          { label: "响应时效", value: m ? `${m.slaHours} 小时` : "—" },
          { label: "加急费率", value: m ? `${m.rushRate}×` : "—" },
          { label: "超时升级联系人", value: m?.escalationContact ?? "—" },
        ],
      }
    }
    case "subscription": {
      const m = meta?.kind === "subscription" ? meta : null
      return {
        title: "订阅周期",
        items: [
          { label: "补货周期", value: m ? `${m.cycleDays} 天` : "—" },
          { label: "下次补货日", value: m?.nextRestockAt ?? "—" },
          { label: "历史补货次数", value: m ? `${m.restockCount} 次` : "—" },
        ],
      }
    }
    case "framework": {
      const m = meta?.kind === "framework" ? meta : null
      return {
        title: "协议额度",
        items: [
          { label: "协议号", value: m?.contractNo ?? "—" },
          { label: "授信额度", value: m ? `¥${m.creditLimit}` : "—" },
          { label: "已用额度", value: m ? `¥${m.creditUsed}` : "—" },
          {
            label: "剩余额度",
            value: m ? `¥${m.creditLimit - m.creditUsed}` : "—",
          },
          { label: "有效期", value: m?.validUntil ?? "—" },
        ],
      }
    }
  }
}

/** 详情页基本信息卡之后插入的种类差异化区块（消费 Order.categoryMeta）。 */
export function OrderDetailSections({ order }: { order: Order }) {
  const { title, items } = buildSection(order)
  return (
    <InfoListCard
      title={title}
      description={`种类：${ORDER_CATEGORY_LABELS[order.category]}`}
      items={items}
    />
  )
}
