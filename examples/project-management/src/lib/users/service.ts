import {
  deleteUser,
  findAllUsers,
  findUserById,
  insertUser,
  updateUser,
} from "./mock-data"
import type { User, UserInput } from "./types"

/**
 * typed service：用户页面唯一的数据入口（mock-first，与真实后端同签名）。
 * 切真实后端时把实现换成 fetch，页面零改动。
 */

const LATENCY_MS = 80

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, LATENCY_MS)
  })
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`用户 ${id} 不存在`)
    this.name = "UserNotFoundError"
  }
}

export async function listUsers(): Promise<User[]> {
  await delay()
  return [...findAllUsers()]
}

export async function getUser(id: string): Promise<User> {
  await delay()
  const user = findUserById(id)
  if (!user) throw new UserNotFoundError(id)
  return user
}

export async function createUser(input: UserInput): Promise<User> {
  await delay()
  return insertUser(input)
}

export async function updateUserProfile(
  id: string,
  patch: Partial<UserInput>,
): Promise<User> {
  await delay()
  return updateUser(id, patch)
}

export async function removeUser(id: string): Promise<void> {
  await delay()
  if (!findUserById(id)) throw new UserNotFoundError(id)
  deleteUser(id)
}
