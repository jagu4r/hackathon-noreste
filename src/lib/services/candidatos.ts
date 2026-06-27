/**
 * Service de candidatos: lógica de negocio. Usa la capa de datos (data.ts)
 * para persistir y la capa de IA (ai/*) para inteligencia. Los componentes
 * llaman a estos services, nunca a Supabase ni al LLM directo.
 */

import { listCandidatos, insertCandidato, updateCandidato } from '../data'
import { extractPerfil } from '../ai/extract'
import { scoreAll } from '../ai/score'
import type { Candidato, Vacante, EstadoCandidato } from '../../types'

export { listCandidatos }

/** Crea un candidato y, si trae CV, le extrae el perfil con IA. */
export async function crearCandidato(input: {
  vacanteId?: string
  nombre: string
  email?: string
  cvRaw?: string
  origen?: string
}): Promise<Candidato> {
  const perfil = input.cvRaw ? await extractPerfil(input.cvRaw) : null
  return insertCandidato({
    vacante_id: input.vacanteId,
    nombre: input.nombre,
    email: input.email,
    cv_raw: input.cvRaw,
    perfil,
    origen: input.origen,
  })
}

/** Mueve un candidato de etapa en el pipeline. */
export async function moverEtapa(id: string, estado: EstadoCandidato): Promise<void> {
  await updateCandidato(id, { estado })
}

/**
 * Evalúa con IA a todos los candidatos de una vacante (map-reduce) y guarda
 * los scores. Aguanta cientos sin reventar el contexto.
 */
export async function evaluarVacante(
  vacante: Vacante
): Promise<{ evaluados: number; fallidos: number }> {
  let candidatos = await listCandidatos(vacante.id)

  // Asegura que todos tengan perfil extraído antes de puntuar.
  candidatos = await Promise.all(
    candidatos.map(async (c) =>
      c.perfil || !c.cv_raw ? c : { ...c, perfil: await extractPerfil(c.cv_raw) }
    )
  )

  const { ranking, fallidos } = await scoreAll(vacante, candidatos)

  await Promise.all(
    ranking.map((r) =>
      updateCandidato(r.candidato_id, { ai_score: r.score, ai_motivo: r.motivo })
    )
  )
  // Persiste también los perfiles recién extraídos.
  await Promise.all(
    candidatos.filter((c) => c.perfil).map((c) => updateCandidato(c.id, { perfil: c.perfil }))
  )

  return { evaluados: ranking.length, fallidos }
}
