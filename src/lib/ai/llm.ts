/**
 * Cliente LLM — la ÚNICA puerta a la inteligencia artificial del proyecto.
 *
 * Por qué existe esta capa:
 *  - Aísla el proveedor: cambiar de Gemini a Claude/OpenAI se hace solo aquí.
 *  - Es mockeable: en modo "mock" responde sin gastar tokens ni API key,
 *    así puedes desarrollar y testear gratis (ver la skill hyper-env).
 *  - Centraliza el manejo de errores y el formato de las respuestas.
 *
 * Regla de oro: el resto del código NUNCA llama al proveedor directo.
 * Siempre pasa por aquí.
 */

const MODE = import.meta.env.VITE_AI_MODE || 'mock'

export interface LlmJsonOptions {
  /** Instrucción de sistema: rol + tarea + reglas + formato. */
  system: string
  /** Los datos sobre los que razona. Compactos, no texto crudo. */
  input: unknown
}

/**
 * Pide al modelo una respuesta en JSON. Devuelve el objeto ya parseado.
 * En modo "mock" genera una respuesta plausible y determinista.
 */
export async function llmJson<T = unknown>(opts: LlmJsonOptions): Promise<T> {
  if (MODE === 'mock') return mockJson<T>(opts)
  return realJson<T>(opts)
}

// ---------------------------------------------------------------------
// Implementación REAL (esqueleto). Conecta aquí tu proveedor.
// IMPORTANTE: en producción esto vive en tu BACKEND, no en el navegador,
// para no exponer la API key. Aquí es solo de referencia.
// ---------------------------------------------------------------------
async function realJson<T>(opts: LlmJsonOptions): Promise<T> {
  const apiKey = import.meta.env.VITE_AI_API_KEY
  if (!apiKey) throw new Error('VITE_AI_API_KEY no está definida (modo real).')

  // Pseudo-código intencional: reemplaza con el SDK de tu proveedor.
  // const res = await fetch('https://api.tu-proveedor.com/v1/chat', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     response_format: { type: 'json_object' },
  //     messages: [
  //       { role: 'system', content: opts.system },
  //       { role: 'user', content: JSON.stringify(opts.input) },
  //     ],
  //   }),
  // })
  // const data = await res.json()
  // return JSON.parse(data.choices[0].message.content) as T
  console.debug('realJson pendiente de conectar', opts.system)
  throw new Error('Conecta tu proveedor en realJson() o usa VITE_AI_MODE=mock.')
}

// ---------------------------------------------------------------------
// Implementación MOCK: respuestas plausibles sin red ni costo.
// Determinista (mismo input -> mismo output) para tests reproducibles.
// ---------------------------------------------------------------------
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

async function mockJson<T>(opts: LlmJsonOptions): Promise<T> {
  // Simula latencia de red para que la UI se sienta realista.
  await new Promise((r) => setTimeout(r, 120))

  const text = JSON.stringify(opts.input).toLowerCase()
  const seed = hash(text)

  // Si parece una tarea de EXTRACCIÓN de CV -> devuelve un perfil.
  if (opts.system.toLowerCase().includes('extrae')) {
    const skillsPool = ['react', 'node', 'typescript', 'python', 'sql', 'aws', 'figma', 'go']
    const skills = skillsPool.filter((_, i) => (seed >> i) & 1).slice(0, 4)
    return {
      nombre: matchNombre(String((opts.input as any)?.cv_raw ?? '')),
      anios_experiencia: (seed % 12) + 1,
      skills: skills.length ? skills : ['comunicación'],
      educacion: seed % 2 ? 'Ingeniería en Sistemas' : 'Lic. en Computación',
    } as T
  }

  // Si parece una tarea de SCORING -> devuelve score + motivo.
  const score = 45 + (seed % 56) // 45-100
  return {
    score,
    motivo:
      score > 80
        ? 'Cumple los skills clave y la experiencia requerida.'
        : score > 60
        ? 'Buen match parcial; le faltan uno o dos requisitos.'
        : 'Match bajo: perfil alejado de la vacante.',
  } as T
}

function matchNombre(cv: string): string {
  const m = cv.match(/[A-ZÁÉÍÓÚ][a-záéíóú]+\s+[A-ZÁÉÍÓÚ][a-záéíóú]+/)
  return m ? m[0] : 'Candidato Sin Nombre'
}
