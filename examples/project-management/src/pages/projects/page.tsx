import { cn } from "@innate/ui"
import { AppLink } from "../../lib/routing"
import { listProjects, permissionLabel } from "../../lib/projects/service"
import { useAsync } from "../../lib/use-async"
import { findUserById } from "../../lib/users/mock-data"

/** 项目列表：卡片栅格 + 成员数 / 权限分布摘要。 */
export function ProjectsPage() {
  const { data, loading, error, reload } = useAsync(listProjects, [])

  if (loading) return <p className="p-6 text-sm text-muted-foreground">加载中…</p>
  if (error)
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">{error.message}</p>
        <button type="button" onClick={reload} className="mt-2 text-sm underline">
          重试
        </button>
      </div>
    )

  const projects = data ?? []

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">项目</h1>
          <p className="text-sm text-muted-foreground">
            共 {projects.length} 个项目
          </p>
        </div>
        <AppLink
          href="/projects/new"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          新建项目
        </AppLink>
      </div>

      {projects.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          还没有项目，点「新建项目」创建第一个。
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const owner = findUserById(project.defaultOwnerId)
            const admins = project.members.filter(
              (m) => m.permission === "admin"
            ).length
            const writers = project.members.filter(
              (m) => m.permission === "write"
            ).length
            return (
              <li key={project.id}>
                <AppLink
                  href={`/projects/${project.id}`}
                  className="block h-full rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {project.key}
                    </span>
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {project.description || "（无描述）"}
                  </p>
                  <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <div className="flex gap-1">
                      <dt>默认负责人：</dt>
                      <dd className={cn("font-medium text-foreground")}>
                        {owner ? owner.name : "（已删除）"}
                      </dd>
                    </div>
                    <div>
                      成员 {project.members.length} ·
                      管理 {admins} · 读写 {writers} ·
                      只读 {project.members.length - admins - writers}
                    </div>
                    <div>
                      权限档：
                      {project.members
                        .map((m) => permissionLabel(m.permission))
                        .join(" / ")}
                    </div>
                  </dl>
                </AppLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
