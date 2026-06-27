/**
 * SCORING con MAP-REDUCE: evalúa N candidatos contra una vacante sin
 * reventar el contexto del LLM. Este es EL patrón que "salvó a TeamUp".
 *
 *   MAP    -> cada candidato se evalúa por separado, con un prompt pequeño
 *             que recibe solo su JSON compacto (no el CV entero).
 *             Se corre en paralelo con un tope de concurrencia (mapLimit).
 *   REDUCE -> ordenas y filtras EN CÓDIGO (gratis y exacto). Solo si
 *             necesitaras un resumen final, ese paso iría a un segundo prompt.
 *
 * Degradación elegante: si un candidato falla tras los reintentos, NO se cae
 * toda la operación. Se marca como no evaluado y el resto continúa. Para el
 * usuario, 95% de resultados > un error total.
 */

import { llmJson } from './llm'
import { mapLimit, withRetry } from './mapLimit'
import type { Vacante, Candidato, ScoreResult } from '../../types'

const SYSTEM = `Eres un reclutador técnico. Evalúa qué tan bien encaja el
candidato con la vacante. Califica de 0 a 100 (penaliza si le falta
experiencia o skills clave). Responde SOLO JSON: { score, motivo }.`

/** Evalúa UN candidato. Usa el perfil compacto, no el CV crudo. */
async function scoreOne(vacante: Vacante, c: Candidato): Promise<ScoreResult> {
  const { score, motivo } = await withRetry(() =>
    llmJson<{ score: number; motivo: string }>({
      system: SYSTEM,
      input: {
        vacante: { titulo: vacante.titulo, skills: vacante.skills },
        candidato: c.perfil ?? { skills: [], anios_experiencia: 0 },
      },
    })
  )
  return { candidato_id: c.id, score, motivo, ok: true }
}

export interface ScoreAllResult {
  /** Resultados ordenados de mayor a menor score (solo los evaluados). */
  ranking: ScoreResult[]
  /** Cuántos no se pudieron evaluar (degradación elegante). */
  fallidos: number
}

/**
 * Evalúa TODOS los candidatos de una vacante. Aguanta cientos sin romperse.
 * @param concurrencia cuántas llamadas al LLM en paralelo (default 5).
 */
export async function scoreAll(
  vacante: Vacante,
  candidatos: Candidato[],
  concurrencia = 5
): Promise<ScoreAllResult> {
  // MAP: cada candidato por separado, en paralelo y con tope de concurrencia.
  const settled = await mapLimit(candidatos, concurrencia, async (c) => {
    try {
      return await scoreOne(vacante, c)
    } catch {
      // Degradación elegante: marca el fallo, no tires todo.
      return { candidato_id: c.id, score: 0, motivo: 'No se pudo evaluar', ok: false } as ScoreResult
    }
  })

  // REDUCE: filtrar y ordenar es trabajo de CÓDIGO, no del LLM.
  const evaluados = settled.filter((r) => r.ok)
  const ranking = evaluados.sort((a, b) => b.score - a.score)
  const fallidos = settled.length - evaluados.length

  return { ranking, fallidos }
}
