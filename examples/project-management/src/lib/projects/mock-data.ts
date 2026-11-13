import type { Project, ProjectInput } from "./types"

/**
 * mock-first 的内存项目仓：service 是唯一入口，页面不直接读这里。
 * 切真实后端时删除本文件，service 改为 fetch。
 */

const SEED_PROJECTS: readonly Project[] = [
  {
    id: "p-1",
    key: "PM",
    name: "产品改进",
    description: "收集内部与客户反馈，持续改进产品。",
    defaultOwnerId: "u-1",
    members: [
      { userId: "u-1", permission: "admin" },
      { userId: "u-2", permission: "write" },
      { userId: "u-3", permission: "write" },
      { userId: "u-4", permission: "read" },
    ],
    createdAt: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "p-2",
    key: "INNO",
    name: "创新孵化",
    description: "新技术预研与创新方案孵化。",
    defaultOwnerId: "u-2",
    members: [
      { userId: "u-2", permission: "admin" },
      { userId: "u-4", permission: "write" },
    ],
    createdAt: "2026-10-01T09:00:00.000Z",
  },
]

let projects: Project[] = [...SEED_PROJECTS]

export function findAllProjects(): readonly Project[] {
  return projects
}

export function findProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function insertProject(input: ProjectInput): Project {
  const project: Project = {
    id: `p-${Date.now().toString(36)}`,
    members: input.defaultOwnerId
      ? [{ userId: input.defaultOwnerId, permission: "admin" }]
      : [],
    createdAt: new Date().toISOString(),
    ...input,
  }
  projects = [project, ...projects]
  return project
}

export function updateProject(id: string, patch: Partial<ProjectInput>): Project {
  const current = findProjectById(id)
  if (!current) throw new Error(`项目 ${id} 不存在`)
  const next: Project = { ...current, ...patch }
  projects = projects.map((p) => (p.id === id ? next : p))
  return next
}

export function deleteProject(id: string): void {
  projects = projects.filter((p) => p.id !== id)
}
