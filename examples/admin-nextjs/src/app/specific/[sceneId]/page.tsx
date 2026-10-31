import { DashboardShell } from "@/components/dashboard-shell"
import { specificSceneSamples } from "@/lib/scene-catalog"
import { SpecificSceneClient } from "./scene-client"

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
  return (
    <DashboardShell>
      <SpecificSceneClient sceneId={sceneId} />
    </DashboardShell>
  )
}
