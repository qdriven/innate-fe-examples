import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

export function HelpPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>帮助中心</CardTitle>
          <CardDescription>
            提供场景规范编写说明、Pattern 设计原则、以及智能体调用规范流程。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. 新增场景前先检查是否已有可复用 Pattern。</p>
          <p>2. Scene 文档必须注册到 `index.md` 才可用于 AI 决策。</p>
          <p>3. 发布前必须验证审计态、锁定态和权限边界。</p>
        </CardContent>
      </Card>
    </>
  )
}
