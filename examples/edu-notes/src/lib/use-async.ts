import { useCallback, useEffect, useState } from "react"

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  reload: () => void
}

/** 三态 hook：loading / error / data（口径同 order-admin 的 use-async）。 */
export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[]
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)

  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fetcher()
      .then((v) => {
        if (alive) setData(v)
      })
      .catch((cause: unknown) => {
        if (alive)
          setError(cause instanceof Error ? cause : new Error(String(cause)))
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
    // deps 由调用方给定
  }, [...deps, tick])

  return { data, loading, error, reload }
}
