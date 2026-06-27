/**
 * Último Recurso — servidor (Bun).
 *
 *  - Sirve la web estática (web/mapa.html).
 *  - Expone POST /api/analizar-foto: recibe una foto (y/o texto) de un vecino
 *    y la interpreta con CLAUDE (visión) para decidir tipo de riesgo,
 *    severidad y una descripción para el ciudadano.
 *
 * Regla de oro: la API key de Claude vive AQUÍ (en el servidor), nunca en el
 * navegador. El frontend solo le pega a /api/analizar-foto.
 *
 * Arranque:   bun run server.js   (necesita ANTHROPIC_API_KEY en .env)
 */
import Anthropic from '@anthropic-ai/sdk';

const port = Number(process.env.PORT) || 8080;

// El SDK lee ANTHROPIC_API_KEY del entorno (Bun carga .env automáticamente).
const client = new Anthropic();

// --- Prompt e instrucciones de la IA -------------------------------------
const SYSTEM = `Eres un analista ambiental ciudadano del Noreste de México (Nuevo León, Coahuila, Tamaulipas).
Vecinos te envían fotos y/o descripciones de posibles riesgos de AGUA o AIRE. Tu trabajo es interpretar la
evidencia y, en lenguaje claro para cualquier persona, decir qué problema parece haber y qué tan grave es.
No inventes datos que no puedas observar. Si la evidencia es ambigua, dilo y baja la severidad.
Responde SIEMPRE en español.`;

// Salida estructurada: Claude debe devolver EXACTAMENTE esta forma (el "contrato"
// con la web y con la base de datos: el reporte de Último Recurso).
const SCHEMA = {
  type: 'object',
  properties: {
    subtipo: {
      type: 'string',
      description:
        'Etiqueta corta del problema. Agua: "turbia", "exceso de cloro", "corte", "espuma", "contaminada", "sin anomalía". Aire: "humo", "mal olor", "bruma", "mala calidad", "aceptable". Otro: "sin clasificar".',
    },
    severidad: { type: 'string', enum: ['alta', 'media', 'baja'] },
    descripcion_ia: {
      type: 'string',
      description:
        'Una o dos frases para el ciudadano: qué se observa y qué tan probable es que NO sea seguro / apto.',
    },
  },
  required: ['subtipo', 'severidad', 'descripcion_ia'],
  additionalProperties: false,
};

async function analizarReporte({ tipo, texto, imagen }) {
  const content = [];

  // Imagen (opcional): viene como data URL base64 desde el navegador.
  if (imagen) {
    const m = /^data:(.+?);base64,(.*)$/s.exec(imagen);
    if (!m) throw new Error('Imagen inválida: se esperaba una data URL base64.');
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: m[1], data: m[2] },
    });
  }

  const instruccion =
    `Tipo de reporte: ${tipo}.` +
    (texto ? ` El vecino describe: "${texto}".` : '') +
    (imagen ? ' Analiza la foto adjunta.' : '') +
    ' Si es AGUA: evalúa turbidez, color, espuma o sedimento y di qué tan probable es que NO sea apta para consumo.' +
    ' Si es AIRE: evalúa humo, bruma o contaminación visible y qué tan mala se ve la calidad del aire.' +
    ' Entrega tu diagnóstico.';
  content.push({ type: 'text', text: instruccion });

  const res = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: 'user', content }],
    output_config: { format: { type: 'json_schema', schema: SCHEMA } },
  });

  const bloque = res.content.find((b) => b.type === 'text');
  return JSON.parse(bloque?.text ?? '{}');
}

// --- Servidor ------------------------------------------------------------
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Bun.serve({
  port,
  // Las imágenes en base64 pueden ser grandes: subimos el límite del body.
  maxRequestBodySize: 25 * 1024 * 1024,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // --- API: análisis con Claude ---
    if (url.pathname === '/api/analizar-foto' && req.method === 'POST') {
      try {
        const body = await req.json();
        const out = await analizarReporte(body);
        return Response.json(out, { headers: CORS });
      } catch (err) {
        console.error('[analizar-foto]', err);
        return Response.json(
          { error: String(err?.message || err) },
          { status: 500, headers: CORS },
        );
      }
    }

    // --- Estático ---
    let filePath = '.' + url.pathname;
    if (url.pathname === '/') filePath = './web/mapa.html';
    try {
      const file = Bun.file(filePath);
      if (await file.exists()) return new Response(file);
    } catch (_) {}
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Último Recurso en http://localhost:${port}/`);
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('⚠️  ANTHROPIC_API_KEY no está definida — el análisis con IA fallará. Crea un .env (ver .env.example).');
}
