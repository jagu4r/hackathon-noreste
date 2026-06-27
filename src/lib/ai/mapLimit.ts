/**
 * Utilidades para procesar muchos ítems contra un LLM sin caerte.
 *
 *  - mapLimit: corre N tareas con un TOPE de concurrencia. Si lanzas 500
 *    llamadas a la vez, revientas el rate limit del proveedor. Con un límite
 *    de, p. ej., 5, procesas todo pero solo 5 en vuelo a la vez.
 *
 *  - withRetry: reintenta con espera creciente (backoff). Las APIs fallan
 *    de forma transitoria; reintentar 2-3 veces salva la mayoría de casos.
 */

export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const i = cursor++
      results[i] = await fn(items[i], i)
    }
  }

  // Lanza "limit" trabajadores que se reparten la cola.
  const workers = Array.from({ length: Math.min(limit, items.length) }, worker)
  await Promise.all(workers)
  return results
}

export async function withRetry<R>(
  fn: () => Promise<R>,
  retries = 2,
  baseMs = 300
): Promise<R> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < retries) {
        // Backoff: 300ms, 600ms, 1200ms...
        await new Promise((r) => setTimeout(r, baseMs * 2 ** attempt))
      }
    }
  }
  throw lastErr
}

/** Estimación rápida de tokens: ~4 caracteres ≈ 1 token. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
