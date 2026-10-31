"use client"

import {
  InfoListCard,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@innate/ui"

export function ApprovalReviewScene() {
  return (
    <div className="space-y-[var(--spacing-section)]">
      <SceneIntro
        title="Approval Review 审核样板"
        description="适合审批流、差异比对、审核意见和最终处置决策的标准布局。"
        chips={["Approval", "Diff", "Comment", "Decision"]}
      />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.1fr_0.9fr]">
        <TableCard
          title="变更差异概览"
          description="左侧主区聚焦差异条目、风险程度和影响范围。"
          headers={["字段", "原值", "新值", "风险级别"]}
          rows={[
            ["排放因子版本", "2025.10", "2026.02", "中"],
            ["天然气用量", "12,440 Nm³", "12,980 Nm³", "高"],
            ["运输边界", "国内运输", "国内 + 海运", "高"],
            ["核算负责人", "王晨", "王晨 / 李新", "低"],
          ]}
        />
        <InfoListCard
          title="审核上下文"
          items={[
            { label: "提交人", value: "王晨" },
            { label: "提交时间", value: "今天 09:16" },
            { label: "审批 SLA", value: "24 小时" },
            { label: "当前结论", value: "待审批意见" },
          ]}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>审批动作区</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-end gap-2">
          <Button variant="outline">退回补充</Button>
          <Button variant="outline">追加备注</Button>
          <Button>批准变更</Button>
        </CardContent>
      </Card>
    </div>
  )
}
