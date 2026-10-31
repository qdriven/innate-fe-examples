import { PlaygroundFlow } from "@/components/playground-flow"
import { llmStatus } from "@/lib/server/llm"

export const dynamic = "force-dynamic"

const EXAMPLES = [
  {
    key: "inventory",
    title: "库存管理",
    description:
      "库存系统：商品 Item 有 id、名称、单价、库存数量、入库时间；支持创建商品、查询商品列表、更新库存；库存状态有 在售 和 下架。",
  },
  {
    key: "library",
    title: "图书馆借阅",
    description:
      "图书馆系统：图书 Book 有 id、书名、作者、ISBN、是否可借；读者 Reader 有 id 和姓名；支持借书和还书，借阅记录有借出时间和归还时间。",
  },
  {
    key: "meeting",
    title: "会议室预订",
    description:
      "会议室预订：会议室 Room 有 id、名称、容纳人数、楼层；预订 Reservation 有 id、开始时间、结束时间、预订人；支持创建预订和取消预订。",
  },
]

export default function PlaygroundPage() {
  const llm = llmStatus()
  return (
    <PlaygroundFlow
      examples={EXAMPLES}
      llmAvailable={llm.available}
      llmReason={llm.reason ?? ""}
    />
  )
}
