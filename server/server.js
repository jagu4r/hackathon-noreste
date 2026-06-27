/**
 * Backend mínimo de ÚLTIMO RECURSO.
 *
 * Es el "almacén compartido" que conecta los dos productos:
 *   - El BOT de Telegram (OpenClaw/Hermes) hace POST de reportes nuevos.
 *   - La WEB (mapa.html de Dante) hace GET para pintarlos, y POST para confirmar.
 *
 * A propósito es lo más simple que funciona: Express + un archivo JSON como
 * base de datos. Cero dependencias nativas, corre con `npm start`. Cuando el
 * proyecto crezca, este mismo contrato de API se puede mudar a Postgres/Supabase
 * sin tocar al bot ni a la web.
 *
 * Privacidad (NIST/ISO): los reportes son de ciudadanos y la ubicación puede
 * delatar un domicilio. Por eso redondeamos lat/lng a ~100 m antes de guardar.
 * NUNCA pongas tokens/llaves aquí; van en variables de entorno.
 */

import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const PORT = process.env.PORT || 3001
const DATA_FILE = new URL('./reportes.json', import.meta.url)

const TIPOS = ['agua', 'aire', 'otro']
const SEVERIDADES = ['baja', 'media', 'alta']

// Datos semilla (mismos del mapa, para que arranque con contenido).
const SEED = [
  { id: 'r1', tipo: 'agua', subtipo: 'turbia', severidad: 'alta', desc: 'Agua con alta turbidez y posible sedimento. No apta para consumo.', foto: null, lat: 25.687, lng: -100.316, colonia: 'Centro', ciudad: 'Monterrey', confirmaciones: 7, estado: 'activo', origen: 'agente', created_at: '2026-06-26T18:00:00.000Z' },
  { id: 'r2', tipo: 'aire', subtipo: 'mal olor', severidad: 'media', desc: 'Mal olor en el ambiente: posible emisión industrial cercana.', foto: null, lat: 25.784, lng: -100.187, colonia: 'Apodaca Centro', ciudad: 'Apodaca', confirmaciones: 3, estado: 'activo', origen: 'web', created_at: '2026-06-27T01:00:00.000Z' },
  { id: 'r3', tipo: 'agua', subtipo: 'corte', severidad: 'media', desc: 'Posible corte o falta de suministro de agua en la zona.', foto: null, lat: 22.255, lng: -97.869, colonia: 'Árbol Grande', ciudad: 'Tampico', confirmaciones: 2, estado: 'enfriando', origen: 'agente', created_at: '2026-06-27T03:00:00.000Z' },
]

// --- "Base de datos": un arreglo en memoria respaldado por reportes.json ---
let reportes = cargar()

function cargar() {
  if (existsSync(DATA_FILE)) {
    try { return JSON.parse(readFileSync(DATA_FILE, 'utf8')) } catch { /* archivo corrupto: re-siembra */ }
  }
  return [...SEED]
}
function guardar() {
  writeFileSync(DATA_FILE, JSON.stringify(reportes, null, 2))
}

const uid = () => 'r_' + Math.random().toString(36).slice(2, 9)
const ahora = () => new Date().toISOString()
// Redondea a 3 decimales (~100 m) para no exponer el domicilio exacto.
const fuzz = (n) => (typeof n === 'number' ? Math.round(n * 1000) / 1000 : null)

/** Sube la severidad según cuántos vecinos confirmaron (inteligencia colectiva). */
function escalar(sevActual, confirmaciones) {
  if (confirmaciones >= 8) return 'alta'
  if (confirmaciones >= 3 && sevActual === 'baja') return 'media'
  return sevActual
}

/** Normaliza y valida lo que llega del bot/web. Devuelve un reporte completo. */
function construirReporte(body) {
  const tipo = TIPOS.includes(body.tipo) ? body.tipo : 'otro'
  const severidad = SEVERIDADES.includes(body.severidad) ? body.severidad : 'media'
  return {
    id: uid(),
    tipo,
    subtipo: String(body.subtipo || 'sin clasificar').slice(0, 60),
    severidad,
    desc: String(body.desc || body.descripcion_ia || '').slice(0, 400),
    foto: body.foto || null,
    lat: fuzz(body.lat),
    lng: fuzz(body.lng),
    colonia: body.colonia ? String(body.colonia).slice(0, 80) : null,
    ciudad: body.ciudad ? String(body.ciudad).slice(0, 80) : null,
    confirmaciones: Number.isInteger(body.confirmaciones) ? body.confirmaciones : 1,
    estado: 'activo',
    origen: body.origen === 'web' ? 'web' : 'agente',
    created_at: ahora(),
  }
}

// =====================================================================
// App
// =====================================================================
const app = express()
app.use(cors())                       // demo: abierto. En prod, restringe el origen.
app.use(express.json({ limit: '8mb' })) // 8mb por si llega una foto en base64.

app.get('/api/health', (_req, res) => res.json({ ok: true, total: reportes.length }))

/** La web lee de aquí (reemplaza al mock del setInterval). */
app.get('/api/reportes', (_req, res) => {
  res.json([...reportes].sort((a, b) => b.created_at.localeCompare(a.created_at)))
})

/** El bot de Telegram crea reportes aquí. */
app.post('/api/reportes', (req, res) => {
  const r = construirReporte(req.body || {})
  reportes.unshift(r)
  guardar()
  res.status(201).json(r)
})

/** Un vecino confirma ("yo también lo veo"): sube el contador y la severidad. */
app.post('/api/reportes/:id/confirmar', (req, res) => {
  const r = reportes.find((x) => x.id === req.params.id)
  if (!r) return res.status(404).json({ error: 'no existe' })
  r.confirmaciones += 1
  r.severidad = escalar(r.severidad, r.confirmaciones)
  r.estado = 'activo'
  guardar()
  res.json(r)
})

app.listen(PORT, () => {
  console.log(`Último Recurso · backend en http://localhost:${PORT}`)
  console.log(`  GET  /api/reportes            (la web)`)
  console.log(`  POST /api/reportes            (el bot)`)
  console.log(`  POST /api/reportes/:id/confirmar`)
})
