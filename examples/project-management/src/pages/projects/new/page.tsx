import { useState } from "react"
import { toast } from "sonner"
import { AppLink, useRouter } from "../../../lib/routing"
import { createProject } from "../../../lib/projects/service"
import { listUsers } from "../../../lib/users/service"
import { useAsync } from "../../../lib/use-async"

/** 新建项目：key / 名称 / 描述 + 默认负责人下拉（成员由 defaultOwner 初始化 admin）。 */
export function ProjectCreatePage() {
  const { push } = useRouter()
  const { data: users } = useAsync(listUsers, [])

  const [key, setKey] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [defaultOwnerId, setDefaultOwnerId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const keyOk = /^[A-Za-z][A-Za-z0-9]{1,9}$/.test(key)
  const canSubmit = keyOk && name.trim() !== "" && defaultOwnerId !== ""

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      const project = await createProject({
        key: key.toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        defaultOwnerId,
      })
      toast.success(`项目「${project.name}」已创建`)
      push(`/projects/${project.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建失败")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <AppLink
        href="/projects"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回项目列表
      </AppLink>
      <h1 className="mt-3 text-lg font-semibold">新建项目</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="project-key" className="text-sm font-medium">
            项目 Key
          </label>
          <input
            id="project-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="如 PM（任务编号前缀）"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          {key !== "" && !keyOk ? (
            <p className="mt-1 text-xs text-destructive">
              2-10 位字母或数字，字母开头
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="project-name" className="text-sm font-medium">
            名称
          </label>
          <input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="项目名称"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="project-description" className="text-sm font-medium">
            描述
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="project-owner" className="text-sm font-medium">
            默认负责人
          </label>
          <select
            id="project-owner"
            value={defaultOwnerId}
            onChange={(e) => setDefaultOwnerId(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">选择用户…</option>
            {(users ?? []).map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            默认负责人自动成为项目 admin 成员。
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "创建中…" : "创建"}
          </button>
          <AppLink
            href="/projects"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            取消
          </AppLink>
        </div>
      </form>
    </div>
  )
}
