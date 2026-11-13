/** 用户领域类型（无 UI 依赖）。用户是关系的"一端"：project 成员、issue 三角色都指向它。 */

export interface User {
  readonly id: string
  readonly name: string
  readonly email: string
  /** 头像底色（纯展示，UϕAvatar / Badge 用）。 */
  readonly color: string
  readonly createdAt: string
}

/** 用户表单输入：id / createdAt 由 service 生成。 */
export type UserInput = Pick<User, "name" | "email" | "color">
