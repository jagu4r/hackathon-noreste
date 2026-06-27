/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_AI_MODE: 'mock' | 'real'
  readonly VITE_AI_API_KEY: string
  readonly VITE_ORWEL_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
