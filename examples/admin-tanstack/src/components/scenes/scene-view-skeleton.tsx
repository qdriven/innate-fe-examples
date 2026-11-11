import { Card, CardContent, CardHeader, Skeleton } from "@innate/ui"

/**
 * 场景视图加载骨架：映射真实场景布局（SceneIntro 卡 + 3 指标卡 + 表格卡），
 * 非单一灰块；错峰 80ms 步进（spec §Motion & Interaction）。
 */
export function SceneViewSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-[var(--spacing-section)]">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-[var(--spacing-section)] md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} size="sm" style={{ animationDelay: `${i * 80}ms` }}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
