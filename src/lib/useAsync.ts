/** Hook mínimo para cargar datos async (loading/error/data + recarga).
 *  En un proyecto más grande, usa TanStack Query. Aquí lo mantenemos ligero. */

import { useCallback, useEffect, useState } from 'react'

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const run = useCallback(() => {
    setLoading(true)
    fn()
      .then((d) => { setData(d); setError(null) })
      .catch((e) => setError(e))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { data, loading, error, reload: run }
}
