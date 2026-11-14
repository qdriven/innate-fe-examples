import {
  InfoListCard,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"
export function RecordDetailSceneView() {
  return (
    <>
      <SceneIntro
        title="Record Detail 详情样板"
        description="适合单条业务记录的全景阅读，包括摘要、风险、审计线索和关联对象。"
        chips={["Detail", "Summary", "Risk", "Audit"]}
      />
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.3fr_0.9fr]">
        <InfoListCard
          title="记录摘要"
          description="详情页第一屏优先回答“这是什么、当前处于什么状态、是否需要动作”。"
          items={[
            { label: "记录名称", value: "组织单元 A 2026-02 月度运维记录" },
            { label: "当前状态", value: "审计只读期" },
            { label: "归属组织", value: "组织单元 A" },
            { label: "数据边界", value: "核心系统 / 周边系统 / 手工台账" },
          ]}
        />
        <InfoListCard
          title="风险与提醒"
          items={[
            { label: "异常值", value: "2 项待复核" },
            { label: "只读策略", value: "允许变更申请 / 备注 / 附件" },
            { label: "最后同步", value: "今天 07:40" },
            { label: "审计批次", value: "2026-Q1-AUD-08" },
          ]}
        />
      </div>
      <TableCard
        title="审计时间线"
        headers={["时间", "事件", "操作人", "结果"]}
        rows={[
          ["03-11 09:10", "提交复核意见", "刘敏", "待审批"],
          ["03-11 08:22", "追加备注", "王晨", "已记录"],
          ["03-10 18:05", "进入审计只读期", "系统", "已锁定写操作"],
          ["03-10 10:12", "同步表计数据", "系统", "成功"],
        ]}
      />
    </>
  )
}
