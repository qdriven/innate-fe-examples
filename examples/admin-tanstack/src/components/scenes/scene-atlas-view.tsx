import { Link } from "@tanstack/react-router"
import {
  getPatternSceneById,
  getSpecificSceneSectionMeta,
  sceneSamples,
  specificSceneSamples,
  specificSceneSectionMeta,
} from "../../lib/scene-catalog"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { TableCard } from "@innate/scene-catalog/scene-blocks"
const prioritySceneIds = [
  "portal-home",
  "todo-center",
  "executive-dashboard",
  "task-workbench",
  "business-record-detail",
  "create-wizard",
  "approval-review-center",
  "policy-settings-center",
  "integration-health-center",
  "ai-copilot",
] as const

function getSectionSurfaceLabel(
  sectionId: (typeof specificSceneSectionMeta)[number]["id"]
) {
  switch (sectionId) {
    case "entry":
      return "门户总览 / 启动流程 / 组织切换"
    case "analytics":
      return "全宽分析画布"
    case "workbench":
      return "全宽执行工作台"
    case "detail":
      return "主区 + 侧栏详情"
    case "capture":
      return "流程页 / 编辑器"
    case "workflow":
      return "审核工作台"
    case "collaboration":
      return "嵌入式会话 / 独立协作页"
    case "governance":
      return "分组设置页"
    case "platform":
      return "平台运维工作区"
    case "ai":
      return "多面板 AI 工作区"
    case "support":
      return "状态反馈页"
  }

  return "标准内容区"
}

function getPriorityRows() {
  return prioritySceneIds.map((sceneId) => {
    const scene = specificSceneSamples.find((item) => item.id === sceneId)
    if (!scene) {
      return ["", "", "", ""]
    }

    const sectionMeta = getSpecificSceneSectionMeta(scene.section)
    const pattern = scene.primaryPatternId
      ? getPatternSceneById(scene.primaryPatternId)
      : undefined

    return [
      scene.title,
      sectionMeta.title,
      pattern?.title ?? "待新增 Pattern",
      scene.description,
    ]
  })
}

function getNavigationRows() {
  return specificSceneSectionMeta.map((section) => {
    const scenes = specificSceneSamples.filter(
      (scene) => scene.section === section.id
    )
    const groups = Array.from(
      new Set(
        scenes.flatMap((scene) => (scene.navGroup ? [scene.navGroup] : []))
      )
    )

    return [
      section.title,
      groups.join(" / "),
      String(scenes.length),
      getSectionSurfaceLabel(section.id),
    ]
  })
}

export function SceneAtlasView() {
  const readyCount = specificSceneSamples.filter(
    (scene) => scene.supportLevel === "Ready"
  ).length
  const extendCount = specificSceneSamples.filter(
    (scene) => scene.supportLevel === "Extend"
  ).length
  const referenceCount = specificSceneSamples.filter(
    (scene) => scene.supportLevel === "Reference"
  ).length

  return (
    <>
      <header className="flex flex-col gap-4">
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
          先把企业系统里的通用场景收成一张地图。左侧是总览、基准 Demo
          和分类，右侧按类目打开具体场景。
        </p>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border @min-[40rem]/main:grid-cols-4">
          {[
            ["场景家族", specificSceneSamples.length],
            ["一级类目", specificSceneSectionMeta.length],
            ["Ready", readyCount],
            ["Extend / Reference", `${extendCount} / ${referenceCount}`],
          ].map(([label, value]) => (
            <div key={label} className="bg-card px-4 py-3">
              <dt className="text-muted-foreground text-xs">{label}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="grid grid-cols-1 gap-3 @min-[40rem]/main:grid-cols-3">
        {[
          ["01", "场景地图", "说明要覆盖哪些场景，以及优先级。"],
          ["02", "基准 Demo", "7 个通用骨架，后面的场景都从这里长出来。"],
          ["03", "分类树", "按类目和分组挂场景，不按行业词堆页面。"],
        ].map(([index, title, body]) => (
          <div key={index} className="rounded-xl border bg-card px-4 py-3">
            <p className="text-muted-foreground text-xs font-medium">{index}</p>
            <p className="mt-1 text-sm font-medium">{title}</p>
            <p className="text-muted-foreground mt-1 text-sm">{body}</p>
          </div>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>基准 Demo 快速入口</CardTitle>
          <CardDescription>
            这 7 个 Demo
            是右侧内容区的第一批标准骨架，后续所有高频场景都应优先映射到它们。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {sceneSamples.map((scene) => (
            <Button
              key={scene.id}
              variant="outline"
              render={<Link to={scene.route} />}
            >
              <scene.icon data-icon />
              {scene.title}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-[var(--spacing-section)] 2xl:grid-cols-2">
        {specificSceneSectionMeta.map((section) => {
          const scenes = specificSceneSamples.filter(
            (scene) => scene.section === section.id
          )
          const groups = Array.from(
            new Set(
              scenes.flatMap((scene) =>
                scene.navGroup ? [scene.navGroup] : []
              )
            )
          )
          const readyScenes = scenes.filter(
            (scene) => scene.supportLevel === "Ready"
          ).length
          const extendScenes = scenes.filter(
            (scene) => scene.supportLevel === "Extend"
          ).length
          const firstScene = scenes[0]

          return (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon data-icon />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{scenes.length} 个场景</Badge>
                  <Badge variant="outline">{groups.length} 个二级分组</Badge>
                  <Badge variant="outline">Ready {readyScenes}</Badge>
                  <Badge variant="outline">Extend {extendScenes}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {groups.map((group) => (
                    <span
                      key={group}
                      className="rounded-md border border-border/70 px-2 py-1"
                    >
                      {group}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/15 px-4 py-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">
                      首个场景入口
                    </span>
                    <span
                      className="truncate text-sm font-medium"
                      title={firstScene.title}
                    >
                      {firstScene.title}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    render={<Link to={firstScene.route} />}
                  >
                    打开
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <TableCard
        title="左侧导航组织建议"
        description="一级导航负责稳定的信息架构，二级分组负责聚合语义相近的场景家族。"
        headers={["一级导航", "二级分组", "覆盖场景数", "右侧建议承载"]}
        rows={getNavigationRows()}
      />

      <TableCard
        title="优先补齐 Demo 的高频场景"
        description="下面这些场景在多数 ToB 系统中都是高频入口，应该优先从说明页升级成专用 Demo。"
        headers={["场景", "归属类目", "建议复用 Pattern", "说明"]}
        rows={getPriorityRows()}
      />
    </>
  )
}
