/**
 * EXTRACCIÓN: convierte un CV largo y ruidoso en un JSON compacto.
 *
 * Patrón "extraer, no pegar":
 *   Un CV en PDF puede tener ~1,100 tokens. Si vas a evaluar 500 candidatos,
 *   pegar los CVs completos en un prompt revienta el contexto (ver el muro de
 *   contexto en el Playbook). En vez de eso, primero EXTRAES los campos clave
 *   a un JSON de ~80 tokens. Luego razonas sobre el JSON, no sobre el PDF.
 *
 * Bonus: la extracción se puede CACHEAR por hash del CV — si el CV no cambió,
 * no vuelves a pagarle al modelo.
 */

import { llmJson } from './llm'
import { withRetry } from './mapLimit'
import type { PerfilCandidato } from '../../types'

const SYSTEM = `Eres un parser de CVs. Extrae SOLO estos campos del texto y
responde en JSON: { nombre, anios_experiencia, skills (array), educacion }.
No inventes datos: si un campo no aparece, usa null o un array vacío.`

// Caché simple en memoria por hash del CV (en producción: Redis o tabla).
const cache = new Map<string, PerfilCandidato>()

function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return String(h)
}

/** Extrae el perfil estructurado de un CV en texto crudo. */
export async function extractPerfil(cvRaw: string): Promise<PerfilCandidato> {
  const key = hash(cvRaw)
  const hit = cache.get(key)
  if (hit) return hit // ya extraído antes: gratis e instantáneo

  const perfil = await withRetry(() =>
    llmJson<PerfilCandidato>({ system: SYSTEM, input: { cv_raw: cvRaw } })
  )

  cache.set(key, perfil)
  return perfil
}
