import { AppLink } from "../../lib/routing"
import { listUsers } from "../../lib/users/service"
import { useAsync } from "../../lib/use-async"
import { findAllProjects } from "../../lib/projects/mock-data"

/** 用户列表：色点 + 邮箱 + 负责/参与项目数摘要。 */
export function UsersPage() {
  const { data, loading, error, reload } = useAsync(listUsers, [])

  if (loading)
    return <p className="p-6 text-sm text-muted-foreground">加载中…</p>
  if (error)
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">{error.message}</p>
        <button type="button" onClick={reload} className="mt-2 text-sm underline">
          重试
        </button>
      </div>
    )

  const users = data ?? []
  const projects = findAllProjects()

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">用户</h1>
          <p className="text-sm text-muted-foreground">共 {users.length} 人</p>
        </div>
        <AppLink
          href="/users/new"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          新建用户
        </AppLink>
      </div>

      {users.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          还没有用户。
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {users.map((user) => {
            const owns = projects.filter(
              (p) => p.defaultOwnerId === user.id
            ).length
            const memberOf = projects.filter((p) =>
              p.members.some((m) => m.userId === user.id)
            ).length
            return (
              <li key={user.id} className="flex items-center gap-3 px-4 py-3">
                <span
                  aria-hidden
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <AppLink
                  href={`/users/${user.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {user.name}
                </AppLink>
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {user.email}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  负责 {owns} 个项目 · 参与 {memberOf} 个
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
