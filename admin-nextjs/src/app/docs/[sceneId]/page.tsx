import { notFound } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { sceneSpecContents } from "@innate/scene-catalog"
import { MarkdownContent } from "@/components/markdown-content"
import { getSceneDocument } from "@/lib/scene-documents"

export function generateStaticParams() {
  return Object.keys(sceneSpecContents).map((sceneId) => ({ sceneId }))
}

export default async function SceneDocPage({
  params,
}: {
  params: Promise<{ sceneId: string }>
}) {
  const { sceneId } = await params
  const document = getSceneDocument(sceneId)

  if (!document) {
    notFound()
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
          <CardDescription>
            当前页面与“场景说明”弹框共用同一份规范源文件。
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <MarkdownContent content={document.content} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
