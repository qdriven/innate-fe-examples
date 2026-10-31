import { useCallback, useEffect, useRef, useState } from "react"

interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

/**
 * 极简异步数据 hook：loading / error / reload 三态。
 * 仓内不引查询库（见 fe-feature references/data.md 策略分层）；
 * 引入 TanStack Query 前需先定 QueryClientProvider 的归属。
 */
export function useAsync<T>(
  load: () => Promise<T>,
  deps: readonly unknown[]
): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  })
  const [nonce, setNonce] = useState(0)
  const loadRef = useRef(load)
  loadRef.current = load

  useEffect(() => {
    let alive = true
    setState((prev) => ({ ...prev, loading: true, error: undefined }))
    loadRef
      .current()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: undefined })
      })
      .catch((error: unknown) => {
        if (alive) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          }))
        }
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps 由调用方显式给出
  }, [nonce, ...deps])

  const reload = useCallback(() => {
    setNonce((n) => n + 1)
  }, [])

  return { ...state, reload }
}
