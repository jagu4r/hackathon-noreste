# Hackathon Hyperdigital × Google — Recursos

Todo lo que ofrecemos a los equipos, centralizado en esta carpeta. Sábado 27 de junio de 2026.

## 🌐 Guías (páginas web compartibles + PDF)

| Guía | Para quién | Link web | Archivo |
|---|---|---|---|
| 🚀 **Hub del participante** | Todos — empieza aquí | https://claude.ai/code/artifact/f176e417-da7d-465a-bc5b-78b038d4e1fa | `hub.html` / `hub.pdf` |
| 🌱 **Primeros Pasos** | Principiantes / sin experiencia | https://claude.ai/code/artifact/d4ff0659-a3bb-4b51-ac2d-566b054d1f93 | `primeros-pasos.html` / `.pdf` |
| ⚡ **Orwel Kit** | Quien va a medir su producto | https://claude.ai/code/artifact/d1805a58-c3c6-4b8a-8508-566dff872c1e | `orwel-kit.html` / `.pdf` |
| 📐 **TeamUp Playbook** | Arquitectura + curso de IA | https://claude.ai/code/artifact/2e7a8003-00d9-45bc-95c5-c84faef7d83b | `teamup-papers.html` / `.pdf` |
| 🪄 **Catálogo de Skills** | Referencia de las skills | https://claude.ai/code/artifact/04500259-71b0-4393-8e0b-0449bf480754 | `skills-catalogo.html` / `.pdf` |
| 🔬 **Conceptos Avanzados** | Perfiles técnicos | https://claude.ai/code/artifact/1e51626b-5fb3-4472-8f1e-4ca609a2b8de | `avanzado.html` / `.pdf` |
| 🧩 **TeamUp Demo Interactivo** | Todos — pruébalo | https://claude.ai/code/artifact/7a695b00-91d7-4d5d-b1b8-1e03f905b38c | `teamup-demo.html` |

> Los archivos `.html` son la fuente; los `.pdf` son para imprimir/repartir. Las páginas web tienen botones de copiar y navegación entre sí.

## 🪄 Skills (carpeta `skills/`)

Pack de skills de Hyperdigital para asistentes de IA (Claude Code, Cursor). Cada una es una carpeta con un `SKILL.md`. Los equipos las copian a `.claude/skills/` en su proyecto.

| Skill | Qué hace |
|---|---|
| `orwel` | Instala e integra el SDK de analítica Orwel en cualquier framework. |
| `hyper-llm` | IA en producción: RAG, agentes y manejo de contexto grande. |
| `hyper-core` | Arquitectura para un backend nuevo multi-tenant. |
| `hyper-sdk` | Arquitectura para crear un SDK cliente con buena DX. |
| `hyper-doc` | Genera documentación completa del proyecto. |
| `hyper-papers` | Genera un paper técnico / case study. |
| `hyper-env` | Entornos de prueba para testear IA. |
| `svelte-loading` | Carga de datos en SvelteKit 2 + Svelte 5. |

(El detalle de cada una —por qué se creó, qué resuelve, cuándo se activa— está en el **Catálogo de Skills**.)

## Temas destacados que cubre el material

- **Orwel**: instalación self-serve (cuenta gratis en orwel.io), SDK completo, API REST, y las **personalidades** (orwel-mind, vía Teorema de Bayes — no IA).
- **TeamUp**: blueprint multi-tenant + RLS, design system, y un **curso de IA**: límites de LLMs, el problema de las **peticiones grandes** (map-reduce), **prompts** (semántica y reglas), **embeddings**, **RAG**, **agentes**, y **¿IA o algoritmo?** (cuándo NO usar IA).
- **Fundamentos**: terminal, Node, estructura de proyecto, `.env` y secretos, `.gitignore`, Git, y dónde van las skills.
- **Avanzado**: internals de Orwel, RLS y performance, y operación de IA (evals, observabilidad, costos, guardrails, seguridad).

## Template de código: TeamUp MVP (carpeta `teamup-mvp/`)

Un **starter completo** de un ATS multi-tenant con IA, con marca TeamUp. Estructura de proyecto, routing y 9 secciones funcionales (Resumen, Vacantes, Candidatos, Carga masiva, Pipeline Kanban, Taxonomía, Bolsa pública, Postulaciones, Atribución), design system, capa de datos (mock o Supabase), service layer, capa de IA mockeable y esquema SQL con RLS. **Sin auth** — entra directo.

```bash
cd teamup-mvp
npm install
npm run dev        # http://localhost:5173 — corre con datos mock, sin configurar nada
```

Verificado: `tsc` y `vite build` pasan sin errores. Conecta Supabase llenando `.env` cuando quieras persistir de verdad.

**Guías de uso:**
- `teamup-mvp/README.md` — estructura y arquitectura del template.
- `teamup-mvp/COMO_PROBAR.md` — paso a paso para correrlo y probarlo (para principiantes).
- `COMO_USAR.md` (en esta carpeta) — cómo usar/probar el demo y el MVP, y **cómo entregarlos**.

**Entrega:** el demo es un solo HTML (compartes el link o el archivo). El MVP se entrega **sin `node_modules`** — cada equipo corre `npm install`. Ver `COMO_USAR.md` para el detalle.

## Diseño

Todos los documentos comparten el sistema visual de **Hyperdigital**: logo HYPER incrustado (SVG), índigo `#170175` para títulos, violeta `#3F00FF` como acento, fondo claro y formal (sin emojis decorativos). Inspirado en la documentación de orwel-api. Cada documento incluye un elemento **interactivo** (playground del SDK, estimador de tokens, simulador de personalidad con Bayes, terminal de práctica, buscador de skills, filtro de retos) y **diagramas de flujo** en SVG.

El logo está en `assets/logo-hyper.svg`.

## Regenerar los PDFs

Los PDF se generan desde los `.html` con Chrome headless (forzando fondos de color y ocultando los botones de copiar). El comando vive en el historial del proyecto; cualquier cambio en un `.html` requiere regenerar su `.pdf`.
