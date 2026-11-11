import { useState } from "react"
import { toast } from "sonner"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@innate/ui"
import {
  InfoListCard,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"
import { fetchApprovalReviewData } from "../../lib/api"
import { useAsync } from "../../lib/use-async"
import { SceneViewSkeleton } from "./scene-view-skeleton"

/** 风险级别 → 语义 token 色板（与 MetricCard trend 同一套，暗色自适应）。 */
function riskTone(level: string) {
  if (level === "高") return "text-destructive"
  if (level === "中") return "text-warning-foreground"
  return "text-success-foreground"
}

export function ApprovalReviewSceneView() {
  const { data, loading, error, reload } = useAsync(fetchApprovalReviewData, [])
  const [decided, setDecided] = useState(false)

  if (loading) {
    return <SceneViewSkeleton />
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm font-medium text-destructive">加载失败</p>
          <p className="text-muted-foreground text-xs">
            {error?.message ?? "未知错误"}
          </p>
          <Button variant="outline" size="sm" onClick={reload}>
            重试
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { diffTable, reviewContext } = data
  const riskRows = diffTable.rows.map((row) => {
    const [field, before, after, level] = row
    return [field, before, after, level] as [string, string, string, string]
  })

  const decide = (action: "approve" | "return" | "comment") => {
    const message = {
      approve: { title: "已批准变更", desc: "演示环境：审批流推进（mock）" },
      return: { title: "已退回补充", desc: "演示环境：退回提交人（mock）" },
      comment: { title: "已追加备注", desc: "演示环境：备注已记录（mock）" },
    }[action]
    toast.success(message.title, { description: message.desc })
    setDecided(true)
  }

  return (
    <>
      <SceneIntro
        title="Approval Review 审核样板"
        description="适合审批流、差异比对、审核意见和最终处置决策的标准布局。"
        chips={["Approval", "Diff", "Comment", "Decision"]}
      />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.1fr_0.9fr]">
        <TableCard
          title={diffTable.title}
          description={diffTable.description}
          headers={diffTable.headers}
          rows={[]}
        >
          <div className="flex flex-col">
            {riskRows.map(([field, before, after, level], index) => (
              <div
                key={field}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 transition-colors duration-fast hover:bg-muted/50"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{field}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {before} → {after}
                  </span>
                </div>
                <span
                  className={`shrink-0 text-xs font-medium ${riskTone(level)}`}
                >
                  {level}风险
                </span>
              </div>
            ))}
          </div>
        </TableCard>
        <InfoListCard
          title={reviewContext.title}
          items={
            decided
              ? [
                  ...reviewContext.items.slice(0, -1),
                  { label: "当前结论", value: "已处置（演示）" },
                ]
              : reviewContext.items
          }
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>审批动作区</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            disabled={decided}
            onClick={() => decide("return")}
          >
            退回补充
          </Button>
          <Button
            variant="outline"
            disabled={decided}
            onClick={() => decide("comment")}
          >
            追加备注
          </Button>
          <Button disabled={decided} onClick={() => decide("approve")}>
            批准变更
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
