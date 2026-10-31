import {
  MetricCards,
  SceneIntro,
  TableCard,
} from "@innate/scene-catalog/scene-blocks"
export function IntegrationHealthSceneView() {
  return (
    <>
      <SceneIntro
        title="Integration Health 集成样板"
        description="适合接入健康监控、同步告警、失败重试和接口运营看板。"
        chips={["Integration", "Sync", "Alert", "Freshness"]}
      />
      <MetricCards
        items={[
          {
            label: "运行中连接器",
            value: "18",
            hint: "其中 15 个过去 24 小时无异常",
          },
          { label: "同步成功率", value: "98.4%", hint: "过去 7 日平均值" },
          { label: "待处理告警", value: "4", hint: "2 个为高优先级" },
        ]}
      />
      <TableCard
        title="连接器状态"
        description="统一展示 ERP、IoT、文件导入等来源的同步健康度。"
        headers={["连接器", "来源系统", "最近同步", "状态", "操作"]}
        rows={[
          ["ERP-Production", "SAP", "今天 08:55", "健康", "查看日志"],
          ["IoT-Meter-East", "MQTT Gateway", "今天 08:48", "延迟", "重试"],
          ["Finance-Upload", "SFTP", "今天 07:20", "失败", "排障"],
          ["ESG-Supplier", "API", "昨天 23:10", "健康", "查看详情"],
        ]}
      />
    </>
  )
}
