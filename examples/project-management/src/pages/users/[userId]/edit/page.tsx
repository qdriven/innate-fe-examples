import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AppLink, useParams, useRouter } from "../../../../lib/routing"
import { getUser, updateUserProfile, removeUser } from "../../../../lib/users/service"

const COLOR_PRESETS = [
  "#0ea5e9",
  "#f97316",
  "#22c55e",
  "#a855f7",
  "#ef4444",
  "#eab308",
] as const

/** 编辑用户：姓名 / 邮箱 / 标识色；支持删除（有关系时后端会拒绝）。 */
export function UserEditPage() {
  const { userId = "" } = useParams()
  const { push } = useRouter()

  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [color, setColor] = useState<string>(COLOR_PRESETS[0])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true
    getUser(userId)
      .then((user) => {
        if (!alive) return
        setName(user.name)
        setEmail(user.email)
        setColor(user.color)
      })
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "加载失败")
      })
    return () => {
      alive = false
    }
  }, [userId])

  const emailOk = /^\S+@\S+\.\S+$/.test(email)
  const canSubmit = name !== null && name.trim() !== "" && emailOk && !submitting

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const user = await updateUserProfile(userId, {
        name: (name ?? "").trim(),
        email: email.trim(),
        color,
      })
      toast.success("用户已更新")
      push(`/users/${user.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新失败")
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm("确定删除该用户？")) return
    try {
      await removeUser(userId)
      toast.success("用户已删除")
      push("/users")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败")
    }
  }

  if (name === null) {
    return <p className="p-6 text-sm text-muted-foreground">加载中…</p>
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <AppLink
        href={`/users/${userId}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回用户详情
      </AppLink>
      <h1 className="mt-3 text-lg font-semibold">编辑用户</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="user-name" className="text-sm font-medium">
            姓名
          </label>
          <input
            id="user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="user-email" className="text-sm font-medium">
            邮箱
          </label>
          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          {!emailOk ? (
            <p className="mt-1 text-xs text-destructive">邮箱格式不正确</p>
          ) : null}
        </div>

        <fieldset>
          <legend className="text-sm font-medium">标识色</legend>
          <div className="mt-2 flex gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-label={`选择颜色 ${preset}`}
                aria-pressed={color === preset}
                onClick={() => setColor(preset)}
                className={
                  color === preset
                    ? "size-7 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "size-7 rounded-full"
                }
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "保存中…" : "保存"}
          </button>
          <AppLink
            href={`/users/${userId}`}
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            取消
          </AppLink>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto rounded-md border border-destructive/40 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            删除
          </button>
        </div>
      </form>
    </div>
  )
}
