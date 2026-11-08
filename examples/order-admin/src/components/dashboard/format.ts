/** dashboard 展示格式化（中文货币 / 比率 / 周刻度）。 */

export function formatCNY(value: number): string {
  return `¥${value.toLocaleString("zh-CN")}`
}

export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`
}

/** 周起始日（YYYY-MM-DD）→ 图表刻度用的 MM-DD。 */
export function formatWeekLabel(weekStart: string): string {
  return weekStart.slice(5)
}
