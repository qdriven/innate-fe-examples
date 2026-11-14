import { DashboardShell } from "@/components/dashboard-shell"
import { specificSceneSamples, getSpecificSceneById } from "@/lib/scene-catalog"
import { SpecificScenePageBody } from "@/components/specific-scene-page-body"
import { SpecificSceneExample } from "@/components/specific-scene-example"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@innate/ui"

export function generateStaticParams() {
  return specificSceneSamples.map((scene) => ({
    sceneId: scene.id,
  }))
}

export default async function SpecificScenePage({
  params,
}: {
  params: Promise<{ sceneId: string }>
}) {
  const { sceneId } = await params
  const scene = getSpecificSceneById(sceneId)

  if (!scene) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>未找到场景案例</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          当前路由没有注册对应的场景案例，请检查场景目录配置。
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardShell>
      <SpecificScenePageBody
        scene={scene}
        example={<SpecificSceneExample scene={scene} />}
      />
    </DashboardShell>
  )
}
