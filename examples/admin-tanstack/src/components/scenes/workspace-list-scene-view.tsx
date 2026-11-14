import { SearchIcon, SlidersHorizontalIcon, UploadIcon } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@innate/ui"
import {
  MetricCards,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"
export function WorkspaceListSceneView() {
  return (
    <>
      <SceneIntro
        title="Workspace 列表样板"
        description="适合台账、订单、资产、工单等以筛选、批量处理、列表浏览为核心的页面。"
        chips={["List", "Filterbar", "Batch Action", "Table"]}
      />
      <Card size="sm">
        <CardHeader>
          <CardTitle>筛选与操作区</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                data-icon
              />
              <Input
                className="pl-8"
                placeholder="搜索记录名称、编码或负责人"
              />
            </div>
            <Select defaultValue="month">
              <SelectTrigger className="min-w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">近 30 天</SelectItem>
                <SelectItem value="quarter">近 90 天</SelectItem>
                <SelectItem value="year">近 12 个月</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <SlidersHorizontalIcon data-icon />
              高级筛选
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">批量分配</Button>
            <Button>
              <UploadIcon data-icon />
              导入数据
            </Button>
          </div>
        </CardContent>
      </Card>
      <MetricCards
        items={[
          { label: "待处理记录", value: "128", hint: "较昨日新增 14 条" },
          { label: "异常记录", value: "9", hint: "需优先处理高风险项" },
          { label: "自动归档率", value: "82%", hint: "本月比上月提升 6%" },
        ]}
      />
      <TableCard
        title="记录列表"
        description="表格承载排序、批量操作、状态识别和进入详情的主入口。"
        headers={["记录名称", "负责人", "状态", "更新时间", "来源"]}
        rows={[
          ["组织单元 A 设备巡检台账", "王晨", "待复核", "今天 09:24", "ERP 同步"],
          ["采购订单 PO-2026-0311", "李新", "进行中", "今天 08:16", "手工创建"],
          ["设备资产 A-00918", "赵明", "异常", "昨天 18:42", "IoT 上报"],
          ["季度指标草稿 Q1", "陈雪", "已归档", "昨天 10:05", "报表导入"],
        ]}
      />
    </>
  )
}
