/** 项目领域类型（无 UI 依赖）。枚举是唯一事实源，UI 与 service 共用。 */

/** 用户在项目上的权限（project × user 关系的一部分）。 */
export const PROJECT_PERMISSIONS = ["read", "write", "admin"] as const
export type ProjectPermission = (typeof PROJECT_PERMISSIONS)[number]

export const PROJECT_PERMISSION_LABELS: Readonly<
  Record<ProjectPermission, string>
> = {
  read: "只读",
  write: "读写",
  admin: "管理",
}

/** 成员 = 用户 + 在该项目上的权限。 */
export interface ProjectMember {
  readonly userId: string
  readonly permission: ProjectPermission
}

export interface Project {
  readonly id: string
  /** 短标识（大写字母数字，如 PM / INNO），列表与 issue id 前缀用。 */
  readonly key: string
  readonly name: string
  readonly description: string
  /** 项目默认 issue owner（project → user 关系；可被 issue 自己的 owner 覆盖）。 */
  readonly defaultOwnerId: string | null
  /** 项目成员（user 可被分配到 project 下；每人一个权限）。 */
  readonly members: readonly ProjectMember[]
  readonly createdAt: string
}

/** 项目表单输入：id / members / createdAt 由 service 组装。 */
export type ProjectInput = Pick<
  Project,
  "key" | "name" | "description" | "defaultOwnerId"
>
