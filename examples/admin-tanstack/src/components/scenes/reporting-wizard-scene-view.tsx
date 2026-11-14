import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@innate/ui"
import { InfoListCard, SceneIntro } from "@innate/scene-catalog/scene-blocks"
const steps = ["选择边界", "配置口径", "补齐数据", "预览结果", "提交审批"]

export function ReportingWizardSceneView() {
  return (
    <>
      <SceneIntro
        title="Reporting Wizard 向导样板"
        description="适合多步骤填报、建模初始化、复杂配置和提交前校验流程。"
        chips={["Wizard", "Validation", "Preview", "Submit"]}
      />
      <Card>
        <CardHeader>
          <CardTitle>步骤导航</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <Badge key={step} variant={index === 2 ? "default" : "outline"}>
              {index + 1}. {step}
            </Badge>
          ))}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>当前步骤：补齐数据</CardTitle>
            <CardDescription>
              用结构化表单和校验提示降低复杂配置的出错率。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input defaultValue="2026 Q1 组织数据填报" />
            <Input defaultValue="组织单元 A + 组织单元 B" />
            <Input defaultValue="采购、物流、仓储、渠道分销" />
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline">保存草稿</Button>
              <Button>下一步：预览结果</Button>
            </div>
          </CardContent>
        </Card>
        <InfoListCard
          title="提交前检查"
          description="右侧固定显示校验结果、缺失项和建议动作。"
          items={[
            { label: "缺失字段", value: "2 项" },
            { label: "异常口径", value: "1 项需确认" },
            { label: "预计提交时间", value: "8 分钟后" },
            { label: "审批路径", value: "分析师 → 审核经理" },
          ]}
        />
      </div>
    </>
  )
}
