import { MarkdownContent } from "../../../components/markdown-content"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"
import { getSceneDocument } from "../../../lib/scene-documents"

export function SceneDocPage({ sceneId }: { sceneId: string }) {
  const document = getSceneDocument(sceneId)

  if (!document) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>未找到场景规范文档</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          当前路由没有注册对应的场景规范文档，请检查场景目录配置。
        </CardContent>
      </Card>
    )
  }

  return (
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
  )
}
