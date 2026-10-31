import { Badge } from "@innate/ui"
import { cn } from "@innate/ui"

import type { Impact, PipelineStatus } from "@/lib/snapshot"

/** 流水线步骤状态徽章。 */
export function StatusBadge({ status }: { status: PipelineStatus }) {
  const map: Record<PipelineStatus, { label: string; className: string }> = {
    passed: {
      label: "✓ 通过",
      className: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
    },
    "expected-failure": {
      label: "✓ 按预期拒绝",
      className: "border-violet-500/40 text-violet-600 dark:text-violet-400",
    },
    failed: {
      label: "✗ 失败",
      className: "border-red-500/40 text-red-600 dark:text-red-400",
    },
    unknown: {
      label: "未采集",
      className: "border-border text-muted-foreground",
    },
  }
  const item = map[status]
  return (
    <Badge variant="outline" className={cn("font-medium", item.className)}>
      {item.label}
    </Badge>
  )
}

/** schema diff 影响级别徽章。 */
export function ImpactBadge({ impact }: { impact: Impact }) {
  const map: Record<
    Impact,
    { label: string; variant: "destructive" | "default" | "secondary" }
  > = {
    BREAKING: { label: "BREAKING", variant: "destructive" },
    DANGEROUS: { label: "DANGEROUS", variant: "secondary" },
    COMPATIBLE: { label: "COMPATIBLE", variant: "default" },
  }
  const item = map[impact]
  return <Badge variant={item.variant}>{item.label}</Badge>
}

/** 定理验证徽章。 */
export function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        verified
          ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
          : "border-amber-500/40 text-amber-600 dark:text-amber-400"
      )}
    >
      {verified ? "已验证 ✓ kernel" : "未覆盖"}
    </Badge>
  )
}
