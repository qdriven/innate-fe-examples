"use client"

import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  getPatternSceneById,
  getSpecificSceneSectionMeta,
  sceneSamples,
  specificSceneSamples,
  specificSceneSectionMeta,
} from "@/lib/scene-catalog"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { SceneIntro, TableCard } from "@/components/scene-blocks"

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

export default function HomePage() {
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
    <DashboardShell>
      <div className="space-y-[var(--spacing-section)]">
        <SceneIntro
          title="ToB 场景地图 V1"
          description="第一版先把企业级复杂系统的通用场景梳理全，再围绕高频场景逐步补齐专用 demo。左侧导航以「总览 + 基准 Demo + 场景分类」组织，右侧内容区默认支持全宽承载具体场景界面。"
          chips={[
            `${specificSceneSectionMeta.length} 个一级类目`,
            `${specificSceneSamples.length} 个场景家族`,
            `${sceneSamples.length} 个基准 Demo`,
            "Scene 页默认全宽",
          ]}
        />

        <div className="grid grid-cols-1 gap-[var(--spacing-section)] xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>导航重构建议</CardTitle>
              <CardDescription>
                左侧不要再按零散页面或行业案例堆叠，而应固定成三层信息架构。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-muted/20 p-4">
                <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">
                  第一层
                </span>
                <p className="text-sm font-medium">场景地图总览</p>
                <p className="text-sm text-muted-foreground">
                  说明这套系统要覆盖哪些 ToB 场景，以及优先级和组织方式。
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-muted/20 p-4">
                <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">
                  第二层
                </span>
                <p className="text-sm font-medium">基准 Demo</p>
                <p className="text-sm text-muted-foreground">
                  先沉淀 7 个通用骨架 Demo，作为后续所有场景的可复用基线。
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-muted/20 p-4">
                <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">
                  第三层
                </span>
                <p className="text-sm font-medium">场景分类树</p>
                <p className="text-sm text-muted-foreground">
                  再按一级类目和二级分组挂载场景家族，避免行业词汇污染导航结构。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>内容区策略</CardTitle>
              <CardDescription>
                场景页应默认支持全宽展示，文档页再回到标准宽度约束。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3">
                <span className="text-sm text-muted-foreground">基准 Demo</span>
                <span className="text-sm font-medium">全宽工作区</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  场景家族说明页
                </span>
                <span className="text-sm font-medium">全宽 + 结构说明</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  Core / Governance
                </span>
                <span className="text-sm font-medium">标准宽度</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-[var(--spacing-section)] md:grid-cols-3 xl:grid-cols-5">
          <Card>
            <CardHeader>
              <CardDescription>场景家族</CardDescription>
              <CardTitle className="text-2xl">
                {specificSceneSamples.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>一级类目</CardDescription>
              <CardTitle className="text-2xl">
                {specificSceneSectionMeta.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Ready</CardDescription>
              <CardTitle className="text-2xl">{readyCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Extend</CardDescription>
              <CardTitle className="text-2xl">{extendCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Reference</CardDescription>
              <CardTitle className="text-2xl">{referenceCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

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
              <Link key={scene.id} href={scene.route}>
                <Button variant="outline">
                  <scene.icon data-icon />
                  {scene.title}
                </Button>
              </Link>
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
                  {firstScene ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/15 px-4 py-3">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">
                          首个场景入口
                        </span>
                        <span className="truncate text-sm font-medium">
                          {firstScene.title}
                        </span>
                      </div>
                      <Link href={firstScene.route}>
                        <Button size="sm" variant="outline">
                          打开
                        </Button>
                      </Link>
                    </div>
                  ) : null}
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
      </div>
    </DashboardShell>
  )
}
