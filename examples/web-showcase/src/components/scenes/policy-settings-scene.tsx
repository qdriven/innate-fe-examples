"use client"

import { InfoListCard, SceneIntro } from "@innate/scene-catalog/scene-blocks"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Label,
} from "@innate/ui"

export function PolicySettingsScene() {
  return (
    <div className="space-y-[var(--spacing-section)]">
      <SceneIntro
        title="Policy Settings 配置样板"
        description="适合组织级默认策略、审计规则、单位偏好、通知和发布开关。"
        chips={["Settings", "Policy", "Governance", "Org Default"]}
      />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>组织级策略</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>
              <Checkbox checked />
              组织级默认单位生效于所有 Dashboard 与报表
            </Label>
            <Label>
              <Checkbox checked />
              审计只读期允许变更申请与备注补充
            </Label>
            <Label>
              <Checkbox checked />
              历史期间锁定后仅允许导出与对比
            </Label>
            <Label>
              <Checkbox />
              高风险审批自动升级到治理管理员
            </Label>
          </CardContent>
        </Card>
        <InfoListCard
          title="当前生效配置"
          items={[
            { label: "显示单位", value: "tCO2e / MWh" },
            { label: "锁定周期", value: "月结后 T+3" },
            { label: "默认通知渠道", value: "站内 + 邮件" },
            { label: "默认审批链", value: "分析师 → 审核经理 → 管理员" },
          ]}
        />
      </div>
    </div>
  )
}
