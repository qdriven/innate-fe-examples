import {
  deleteProject,
  findAllProjects,
  findProjectById,
  insertProject,
  updateProject,
} from "./mock-data"
import {
  PROJECT_PERMISSION_LABELS,
  type Project,
  type ProjectInput,
  type ProjectMember,
} from "./types"

/**
 * typed service：项目页面唯一的数据入口（mock-first，与真实后端同签名）。
 * 切真实后端时把实现换成 fetch，页面零改动。
 */

const LATENCY_MS = 80

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, LATENCY_MS)
  })
}

export class ProjectNotFoundError extends Error {
  constructor(id: string) {
    super(`项目 ${id} 不存在`)
    this.name = "ProjectNotFoundError"
  }
}

export class MemberNotInProjectError extends Error {
  constructor(projectId: string, userId: string) {
    super(`项目 ${projectId} 中没有成员 ${userId}`)
    this.name = "MemberNotInProjectError"
  }
}

export async function listProjects(): Promise<Project[]> {
  await delay()
  return [...findAllProjects()]
}

export async function getProject(id: string): Promise<Project> {
  await delay()
  const project = findProjectById(id)
  if (!project) throw new ProjectNotFoundError(id)
  return project
}

export async function createProject(input: ProjectInput): Promise<Project> {
  await delay()
  return insertProject(input)
}

export async function updateProjectProfile(
  id: string,
  patch: Partial<ProjectInput>,
): Promise<Project> {
  await delay()
  return updateProject(id, patch)
}

export async function removeProject(id: string): Promise<void> {
  await delay()
  if (!findProjectById(id)) throw new ProjectNotFoundError(id)
  deleteProject(id)
}

/** 变更成员权限（成员已存在则覆盖权限，不存在则追加）。 */
export async function setMemberPermission(
  projectId: string,
  member: ProjectMember,
): Promise<Project> {
  await delay()
  const project = findProjectById(projectId)
  if (!project) throw new ProjectNotFoundError(projectId)
  const others = project.members.filter((m) => m.userId !== member.userId)
  return updateProject(projectId, {
    members: [...others, member],
  } as Partial<ProjectInput>)
}

/** 移除成员；默认 owner 不能移除（先把 defaultOwnerId 换人）。 */
export async function removeMember(
  projectId: string,
  userId: string,
): Promise<Project> {
  await delay()
  const project = findProjectById(projectId)
  if (!project) throw new ProjectNotFoundError(projectId)
  if (project.defaultOwnerId === userId) {
    throw new Error(
      `成员 ${userId} 是项目默认负责人，请先更换默认负责人再移除`
    )
  }
  if (!project.members.some((m) => m.userId === userId)) {
    throw new MemberNotInProjectError(projectId, userId)
  }
  return updateProject(projectId, {
    members: project.members.filter((m) => m.userId !== userId),
  } as Partial<ProjectInput>)
}

export function permissionLabel(permission: Project["members"][number]["permission"]): string {
  return PROJECT_PERMISSION_LABELS[permission]
}
