/**
 * Capa de DATOS (persistencia). Es la frontera entre tu app y "dónde viven
 * los datos". Por defecto usa un store EN MEMORIA (mock) sembrado con
 * seed/seed.ts, así el MVP corre sin backend. Si configuras Supabase,
 * estas mismas funciones leen/escriben en Postgres.
 *
 * Los services (capa de negocio) llaman SIEMPRE a estas funciones, nunca a
 * Supabase directo. Cambiar de mock a real no toca el resto del código.
 */

import { supabase, isSupabaseConfigured } from './supabase'
import { vacantesSeed, candidatosSeed, contratacionesSeed, WORKSPACE_ID } from '../seed/seed'
import type { Vacante, Candidato } from '../types'

/** Workspace activo. En real saldría de la sesión/JWT del usuario. */
export const WS = WORKSPACE_ID

// --- Store en memoria (copias mutables del seed) ---
const mem = {
  vacantes: structuredClone(vacantesSeed) as Vacante[],
  candidatos: structuredClone(candidatosSeed) as Candidato[],
}

function uid(p: string) {
  return p + '_' + Math.random().toString(36).slice(2, 9)
}

// =====================================================================
// Vacantes
// =====================================================================
export async function listVacantes(): Promise<Vacante[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('vacantes').select('*').eq('workspace_id', WS).order('created_at', { ascending: false })
    if (error) throw error
    return data as Vacante[]
  }
  return [...mem.vacantes].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getVacante(id: string): Promise<Vacante | undefined> {
  return (await listVacantes()).find((v) => v.id === id)
}

// =====================================================================
// Candidatos
// =====================================================================
export async function listCandidatos(vacanteId?: string): Promise<Candidato[]> {
  if (isSupabaseConfigured && supabase) {
    let q = supabase.from('candidatos').select('*').eq('workspace_id', WS)
    if (vacanteId) q = q.eq('vacante_id', vacanteId)
    const { data, error } = await q.order('ai_score', { ascending: false, nullsFirst: false })
    if (error) throw error
    return data as Candidato[]
  }
  let rows = [...mem.candidatos]
  if (vacanteId) rows = rows.filter((c) => c.vacante_id === vacanteId)
  return rows.sort((a, b) => (b.ai_score ?? -1) - (a.ai_score ?? -1))
}

export async function insertCandidato(c: Partial<Candidato>): Promise<Candidato> {
  const row: Candidato = {
    id: uid('c'), workspace_id: WS, vacante_id: c.vacante_id ?? null,
    nombre: c.nombre ?? 'Sin nombre', email: c.email ?? null, cv_raw: c.cv_raw ?? null,
    perfil: c.perfil ?? null, ai_score: c.ai_score ?? null, ai_motivo: c.ai_motivo ?? null,
    estado: c.estado ?? 'nuevo', origen: c.origen ?? null,
    created_at: new Date(2026, 5, 9).toISOString(),
  }
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('candidatos').insert(row).select('*').single()
    if (error) throw error
    return data as Candidato
  }
  mem.candidatos.unshift(row)
  return row
}

export async function updateCandidato(id: string, patch: Partial<Candidato>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('candidatos').update(patch).eq('id', id).eq('workspace_id', WS)
    if (error) throw error
    return
  }
  const i = mem.candidatos.findIndex((c) => c.id === id)
  if (i >= 0) mem.candidatos[i] = { ...mem.candidatos[i], ...patch }
}

// =====================================================================
// Atribución (contrataciones por origen) — mock agregado
// =====================================================================
export async function attributionByOrigin(): Promise<{ origen: string; count: number }[]> {
  // En real: SELECT origen, count(*) FROM candidatos WHERE estado='contratado' GROUP BY origen
  return [...contratacionesSeed].sort((a, b) => b.count - a.count)
}
