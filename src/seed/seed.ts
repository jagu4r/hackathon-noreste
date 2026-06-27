/** Datos de ejemplo para arrancar con contenido (modo mock). */

import type { Vacante, Candidato } from '../types'

const WS = 'demo-workspace'
const now = (d: number) => new Date(2026, 5, d).toISOString()

export const vacantesSeed: Vacante[] = [
  { id: 'v1', workspace_id: WS, titulo: 'Desarrollador Frontend Senior', ubicacion: 'Remoto', modalidad: 'remoto', skills: ['react', 'typescript'], estado: 'activa', created_at: now(1) },
  { id: 'v2', workspace_id: WS, titulo: 'Diseñador UX', ubicacion: 'CDMX', modalidad: 'hibrido', skills: ['figma', 'diseño ux'], estado: 'activa', created_at: now(3) },
  { id: 'v3', workspace_id: WS, titulo: 'Ingeniero Backend', ubicacion: 'Remoto', modalidad: 'remoto', skills: ['node', 'postgres'], estado: 'activa', created_at: now(5) },
  { id: 'v4', workspace_id: WS, titulo: 'Data Analyst', ubicacion: 'Monterrey', modalidad: 'presencial', skills: ['python', 'sql'], estado: 'activa', created_at: now(6) },
  { id: 'v5', workspace_id: WS, titulo: 'Product Manager', ubicacion: 'Remoto', modalidad: 'remoto', skills: ['producto', 'agile'], estado: 'borrador', created_at: now(8) },
]

const cv = (s: string) => s.trim()

export const candidatosSeed: Candidato[] = [
  {
    id: 'c1', workspace_id: WS, vacante_id: 'v1', nombre: 'Carla Méndez', email: 'carla@example.com',
    cv_raw: cv('Carla Méndez. 9 años de experiencia. Arquitecta frontend en React, TypeScript y Figma. Mentora de equipos. Lic. en Computación.'),
    perfil: null, ai_score: null, ai_motivo: null, estado: 'nuevo', origen: 'Referido', created_at: now(2),
  },
  {
    id: 'c2', workspace_id: WS, vacante_id: 'v1', nombre: 'Ana Torres', email: 'ana@example.com',
    cv_raw: cv('Ana Torres. Desarrolladora Frontend con 6 años en React y TypeScript. Lideró el rediseño de un panel SaaS. Conoce Node y AWS. Ing. en Sistemas.'),
    perfil: null, ai_score: null, ai_motivo: null, estado: 'entrevista', origen: 'LinkedIn', created_at: now(2),
  },
  {
    id: 'c3', workspace_id: WS, vacante_id: 'v1', nombre: 'Beto Ramírez', email: 'beto@example.com',
    cv_raw: cv('Beto Ramírez. 2 años como desarrollador web junior. HTML, CSS y algo de JavaScript. Bootcamp de programación. Ganas de aprender React.'),
    perfil: null, ai_score: null, ai_motivo: null, estado: 'nuevo', origen: 'Bolsa propia', created_at: now(4),
  },
  {
    id: 'c4', workspace_id: WS, vacante_id: 'v3', nombre: 'Diego Sosa', email: 'diego@example.com',
    cv_raw: cv('Diego Sosa. Ingeniero backend con 5 años en Python y SQL. Algo de JavaScript. Ing. en Sistemas.'),
    perfil: null, ai_score: null, ai_motivo: null, estado: 'nuevo', origen: 'OCC', created_at: now(5),
  },
  {
    id: 'c5', workspace_id: WS, vacante_id: 'v2', nombre: 'Lucía Fernández', email: 'lucia@example.com',
    cv_raw: cv('Lucía Fernández. Diseñadora UX con 4 años. Figma, investigación de usuarios, design systems. Lic. en Diseño.'),
    perfil: null, ai_score: null, ai_motivo: null, estado: 'oferta', origen: 'Bolsa propia', created_at: now(6),
  },
]

/** Contrataciones históricas para la gráfica de atribución. */
export const contratacionesSeed: { origen: string; count: number }[] = [
  { origen: 'Bolsa propia', count: 9 },
  { origen: 'Referido', count: 7 },
  { origen: 'LinkedIn', count: 5 },
  { origen: 'OCC', count: 3 },
  { origen: 'Google', count: 2 },
]

export const WORKSPACE_ID = WS
