import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@innate/ui"

export function SettingsPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>系统设置</CardTitle>
          <CardDescription>
            这里用于维护组织级默认策略，例如单位偏好、规范版本策略与发布控制参数。
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          当前页面作为占位，后续可接入真实设置表单与配置管理流程。
        </CardContent>
      </Card>
    </>
  )
}
