/** Tipos compartidos del MVP. En un proyecto real, genéralos desde Supabase
 *  con `supabase gen types typescript`. */

export type EstadoCandidato =
  | 'nuevo' | 'contactado' | 'entrevista' | 'evaluacion'
  | 'oferta' | 'contratado' | 'rechazado'

export const ESTADOS: EstadoCandidato[] = [
  'nuevo', 'contactado', 'entrevista', 'evaluacion', 'oferta', 'contratado', 'rechazado',
]

export interface PerfilCandidato {
  nombre: string | null
  anios_experiencia: number
  skills: string[]
  educacion: string | null
}

export interface Vacante {
  id: string
  workspace_id: string
  titulo: string
  ubicacion: string
  modalidad: 'remoto' | 'hibrido' | 'presencial'
  skills: string[]
  estado: 'borrador' | 'activa' | 'cerrada'
  created_at: string
}

export interface Candidato {
  id: string
  workspace_id: string
  vacante_id: string | null
  nombre: string
  email: string | null
  cv_raw: string | null
  perfil: PerfilCandidato | null
  ai_score: number | null
  ai_motivo: string | null
  estado: EstadoCandidato
  origen: string | null
  created_at: string
}

export interface ScoreResult {
  candidato_id: string
  score: number
  motivo: string
  ok: boolean
}
