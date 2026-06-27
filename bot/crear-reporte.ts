/**
 * Skill `crear_reporte` para el agente ÚLTIMO RECURSO (OpenClaw / Hermes).
 *
 * Reparto de responsabilidades:
 *   - El AGENTE (el LLM del framework) recibe la foto/texto del vecino por
 *     Telegram y la INTERPRETA (visión + lenguaje natural), guiado por el
 *     system prompt (ver system-prompt.md).
 *   - Esta SKILL solo PERSISTE: recibe los campos ya estructurados y los manda
 *     al backend. No llama a ninguna IA (de eso ya se encargó el agente).
 *
 * Así, conectar Gemini/Claude es trabajo del framework, no de este archivo.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

export interface ReporteInput {
  tipo: 'agua' | 'aire' | 'otro'
  subtipo: string
  severidad: 'baja' | 'media' | 'alta'
  desc: string
  lat?: number
  lng?: number
  colonia?: string
  ciudad?: string
}

/** Guarda el reporte en el backend y devuelve un mensaje natural para el vecino. */
export async function crearReporte(input: ReporteInput) {
  const res = await fetch(`${BACKEND_URL}/api/reportes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, origen: 'agente' }),
  })
  if (!res.ok) throw new Error(`El backend respondió ${res.status}`)

  const r = await res.json()
  const donde = [r.colonia, r.ciudad].filter(Boolean).join(', ') || 'tu zona'
  return {
    ok: true,
    reporte: r,
    // El agente le repite esto al vecino, en lenguaje natural.
    mensaje:
      `Ya quedó en el mapa de ${donde} como ${r.tipo} (${r.subtipo}), ` +
      `severidad ${r.severidad}. Si más vecinos confirman lo mismo, la alerta sube.`,
  }
}

/**
 * Definición de la herramienta para el agente (JSON Schema de los argumentos).
 * OpenClaw valida los frames entrantes contra esquemas como este; en Hermes es
 * el "tool spec". Regístrala junto con el handler `crearReporte` de arriba.
 */
export const crearReporteTool = {
  name: 'crear_reporte',
  description:
    'Guarda un reporte de riesgo ambiental (agua/aire) en el mapa colaborativo del Noreste. ' +
    'Úsalo en cuanto entiendas qué problema reporta el vecino (por foto o por texto).',
  parameters: {
    type: 'object',
    properties: {
      tipo: { type: 'string', enum: ['agua', 'aire', 'otro'] },
      subtipo: { type: 'string', description: 'turbia, exceso de cloro, corte, humo, mal olor, espuma…' },
      severidad: { type: 'string', enum: ['baja', 'media', 'alta'] },
      desc: { type: 'string', description: 'Qué entendiste del problema, claro y humano.' },
      lat: { type: 'number', description: 'Latitud (de la ubicación que compartió el vecino).' },
      lng: { type: 'number', description: 'Longitud.' },
      colonia: { type: 'string' },
      ciudad: { type: 'string' },
    },
    required: ['tipo', 'subtipo', 'severidad', 'desc'],
  },
} as const
