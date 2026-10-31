import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

const governanceSteps = [
  "文档编写：scene/pattern/frontmatter 必填字段完整",
  "注册校验：index.md 注册表字段与链接可解析",
  "实现校验：路由与 Demo 页面可运行且结构匹配",
  "状态校验：权限、审计态、锁定态、空错态覆盖",
  "发布管理：版本号、变更记录、弃用声明同步更新",
]

export function GovernancePage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>规范治理流水线</CardTitle>
          <CardDescription>
            通过流程与质量门禁确保场景规范可以持续演进且可被智能体稳定消费。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {governanceSteps.map((step, index) => (
            <p key={step}>
              {index + 1}. {step}
            </p>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
