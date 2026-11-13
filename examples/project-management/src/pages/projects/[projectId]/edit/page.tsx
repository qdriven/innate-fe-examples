import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AppLink, useParams, useRouter } from "../../../../lib/routing"
import {
  findProjectById,
} from "../../../../lib/projects/mock-data"
import { getProject, updateProjectProfile } from "../../../../lib/projects/service"
import { listUsers } from "../../../../lib/users/service"
import { useAsync } from "../../../../lib/use-async"

/** 编辑项目：key/名称/描述 + 默认负责人（换人时自动移交 admin 权限）。 */
export function ProjectEditPage() {
  const { projectId = "" } = useParams()
  const { push } = useRouter()
  const { data: users } = useAsync(listUsers, [])

  const [key, setKey] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [defaultOwnerId, setDefaultOwnerId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true
    getProject(projectId)
      .then((project) => {
        if (!alive) return
        setKey(project.key)
        setName(project.name)
        setDescription(project.description)
        setDefaultOwnerId(project.defaultOwnerId ?? "")
      })
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "加载失败")
      })
    return () => {
      alive = false
    }
  }, [projectId])

  const keyOk = key !== null && /^[A-Za-z][A-Za-z0-9]{1,9}$/.test(key)
  const canSubmit = keyOk && name.trim() !== "" && defaultOwnerId !== ""

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      const project = await updateProjectProfile(projectId, {
        key,
        name: name.trim(),
        description: description.trim(),
        defaultOwnerId,
      })
      toast.success("项目已更新")
      push(`/projects/${project.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新失败")
      setSubmitting(false)
    }
  }

  if (!findProjectById(projectId)) {
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">项目不存在或已被删除。</p>
        <AppLink href="/projects" className="mt-2 inline-block text-sm underline">
          ← 返回项目列表
        </AppLink>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <AppLink
        href={`/projects/${projectId}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回项目详情
      </AppLink>
      <h1 className="mt-3 text-lg font-semibold">编辑项目</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="project-key" className="text-sm font-medium">
            项目 Key
          </label>
          <input
            id="project-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          {!keyOk ? (
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
            更换默认负责人时，admin 权限自动移交给新负责人。
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "保存中…" : "保存"}
          </button>
          <AppLink
            href={`/projects/${projectId}`}
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            取消
          </AppLink>
        </div>
      </form>
    </div>
  )
}
