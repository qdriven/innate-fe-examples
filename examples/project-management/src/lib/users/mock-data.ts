import type { User, UserInput } from "./types"

/**
 * mock-first 的内存用户仓：service 是唯一入口，页面不直接读这里。
 * 切真实后端时删除本文件，service 改为 fetch。
 */

const SEED_USERS: readonly User[] = [
  {
    id: "u-1",
    name: "林小满",
    email: "xiaoman.lin@example.com",
    color: "#0ea5e9",
    createdAt: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "u-2",
    name: "陈北望",
    email: "beiwang.chen@example.com",
    color: "#f97316",
    createdAt: "2026-09-01T09:05:00.000Z",
  },
  {
    id: "u-3",
    name: "苏云溪",
    email: "yunxi.su@example.com",
    color: "#10b981",
    createdAt: "2026-09-02T14:20:00.000Z",
  },
  {
    id: "u-4",
    name: "周砚秋",
    email: "yanqiu.zhou@example.com",
    color: "#a855f7",
    createdAt: "2026-09-05T11:30:00.000Z",
  },
]

let users: User[] = [...SEED_USERS]

export function findAllUsers(): readonly User[] {
  return users
}

export function findUserById(id: string | null): User | undefined {
  if (id === null) return undefined
  return users.find((u) => u.id === id)
}

export function insertUser(input: UserInput): User {
  const user: User = {
    id: `u-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    ...input,
  }
  users = [user, ...users]
  return user
}

export function updateUser(id: string, patch: Partial<UserInput>): User {
  const current = findUserById(id)
  if (!current) throw new Error(`用户 ${id} 不存在`)
  const next: User = { ...current, ...patch }
  users = users.map((u) => (u.id === id ? next : u))
  return next
}

export function deleteUser(id: string): void {
  users = users.filter((u) => u.id !== id)
}
