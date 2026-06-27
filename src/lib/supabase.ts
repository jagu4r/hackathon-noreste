/**
 * Cliente de Supabase — opcional. El MVP corre con datos MOCK por defecto,
 * así arranca sin configurar nada. Si rellenas el .env, la capa de datos
 * (data.ts) usa Supabase de verdad.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// Solo se crea si está configurado (evita el error "supabaseUrl is required").
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null

if (!isSupabaseConfigured) {
  console.info(
    '[TeamUp MVP] Modo MOCK (sin Supabase). Rellena VITE_SUPABASE_URL y ' +
      'VITE_SUPABASE_ANON_KEY en .env para usar una base real.'
  )
}
