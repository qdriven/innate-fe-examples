"use client"

import type { z } from "zod"

import { DataTable, schema } from "@innate/admin-composites/data-table"

type DataTableRow = z.infer<typeof schema>

const demoData: DataTableRow[] = [
  {
    id: 1,
    header: "目录",
    type: "Table of Contents",
    status: "Done",
    target: "18",
    limit: "5",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "执行摘要",
    type: "Executive Summary",
    status: "In Progress",
    target: "12",
    limit: "8",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 3,
    header: "技术方法",
    type: "Technical Approach",
    status: "Done",
    target: "24",
    limit: "10",
    reviewer: "Eddie Lake",
  },
  {
    id: 4,
    header: "系统设计",
    type: "Design",
    status: "Not Started",
    target: "16",
    limit: "6",
    reviewer: "指派审核人",
  },
  {
    id: 5,
    header: "性能指标",
    type: "Capabilities",
    status: "In Progress",
    target: "20",
    limit: "12",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 6,
    header: "重点文档",
    type: "Focus Documents",
    status: "Done",
    target: "9",
    limit: "3",
    reviewer: "Eddie Lake",
  },
  {
    id: 7,
    header: "叙事描述",
    type: "Narrative",
    status: "Not Started",
    target: "14",
    limit: "7",
    reviewer: "指派审核人",
  },
  {
    id: 8,
    header: "封面",
    type: "Cover Page",
    status: "Done",
    target: "2",
    limit: "1",
    reviewer: "Jamik Tashpulatov",
  },
]

export function DataTableShowcase() {
  return (
    <div className="space-y-[var(--spacing-section)]">
      <p className="text-muted-foreground text-sm">
        Full-featured table from @innate/admin-composites — drag-to-reorder
        rows, column visibility, pagination, and a per-row detail drawer. The
        component requires a data prop matching its exported zod schema.
      </p>
      <DataTable data={demoData} />
    </div>
  )
}
