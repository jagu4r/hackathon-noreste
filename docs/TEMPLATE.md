# TeamUp MVP — Template del Hackathon

Un **starter completo** de un ATS (sistema de seguimiento de candidatos) multi-tenant con IA, basado en los patrones reales de TeamUp. Úsalo como **base, ejemplo o template** para tu proyecto: ya trae estructura, navegación, varias features funcionales, capa de datos, service layer y capa de IA.

> **Corre sin configurar nada.** Por defecto usa datos *mock* en memoria, así arranca al instante. Cuando quieras persistir de verdad, conecta Supabase con una variable de entorno.

```bash
npm install
npm run dev        # abre http://localhost:5173
```

(Opcional: `cp .env.example .env` y rellena Supabase para usar una base real.)

## Qué incluye (features funcionales)

| Sección | Qué demuestra |
|---|---|
| **Resumen** | Dashboard con métricas en vivo desde la capa de datos. |
| **Vacantes** | Listado multi-tenant (cada query lleva `workspace_id`). |
| **Candidatos** | Tabla + **evaluación con IA (map-reduce)** que puntúa y reordena. |
| **Carga masiva** | Procesa cientos de CVs en **lotes con concurrencia limitada**. |
| **Pipeline** | Embudo tipo **Kanban**; mover candidatos persiste vía el service. |
| **Taxonomía** | Normaliza skills sueltos a un **árbol canónico** (diccionario en código). |
| **Bolsa de trabajo** | Página **pública** de empleos (sin auth, pensada para SEO). |
| **Postulaciones** | Formulario que captura **origen** (atribución) + extrae perfil con IA. |
| **Atribución** | Contrataciones por canal de origen. |

## Estructura

```
teamup-mvp/
├── README.md
├── package.json · vite.config.ts · tsconfig.json · index.html
├── .env.example                 # variables (Supabase + IA), todas opcionales
├── supabase/migrations/
│   └── 0001_init.sql            # esquema + RLS multi-tenant (la base real)
└── src/
    ├── main.tsx · App.tsx       # arranque + router
    ├── index.css                # design system (marca TeamUp)
    ├── types.ts
    ├── brand/Logo.tsx           # logo TeamUp (SVG)
    ├── seed/seed.ts             # datos de ejemplo
    ├── lib/
    │   ├── supabase.ts          # cliente opcional (solo si configuras .env)
    │   ├── data.ts              # CAPA DE DATOS: mock por defecto, Supabase si hay config
    │   ├── useAsync.ts          # hook de carga async
    │   ├── services/
    │   │   └── candidatos.ts    # SERVICE LAYER: lógica de negocio
    │   └── ai/                  # CAPA DE IA (mockeable)
    │       ├── llm.ts           # cliente LLM mock/real
    │       ├── mapLimit.ts      # concurrencia + reintentos
    │       ├── extract.ts       # CV crudo -> JSON compacto
    │       ├── score.ts         # scoring map-reduce
    │       └── taxonomy.ts      # normalización de skills
    ├── components/Layout.tsx    # shell: sidebar + topbar
    └── pages/                   # una por sección (Dashboard, Vacantes, ...)
```

## La arquitectura, en capas

```
páginas (pages/)  →  servicios (lib/services/)  →  datos (lib/data.ts)  →  mock | Supabase
                                  ↓
                          IA (lib/ai/*)  →  LLM mock | tu proveedor
```

- **Las páginas no saben de Supabase ni del LLM.** Solo llaman a servicios.
- **El service layer** orquesta negocio (ej. "evaluar una vacante" = extraer perfiles + map-reduce + guardar).
- **La capa de datos** decide dónde persistir (mock o Supabase) sin que el resto cambie.
- **La capa de IA** está aislada y es mockeable: desarrollas y testeas gratis.

## Modos

| | Sin `.env` (default) | Con Supabase en `.env` |
|---|---|---|
| Datos | en memoria (seed) | Postgres real con RLS |
| IA | `VITE_AI_MODE=mock` (gratis) | `real` con tu proveedor |
| Setup | cero | aplica la migración + llaves |

## Los patrones de IA que vas a robarte

- **Extraer, no pegar** (`extract.ts`): CV largo → JSON compacto, con caché por hash.
- **Map-Reduce** (`score.ts`): evalúas cada candidato por separado (en paralelo, limitado) y armas el ranking en código. Aguanta cientos sin reventar el contexto.
- **¿IA o algoritmo?** (`taxonomy.ts`): la normalización es un diccionario en código; la IA se reserva para lo ambiguo.
- **Mockeable** (`llm.ts`): cambias de proveedor (Gemini, Claude, OpenAI…) o pruebas gratis, sin tocar la lógica.

## Cómo conectar Supabase (cuando quieras)

1. Crea un proyecto en supabase.com.
2. Aplica `supabase/migrations/0001_init.sql` (SQL Editor o CLI).
3. Pon `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env`.
4. Recarga: la misma app ahora lee/escribe en Postgres con RLS.

Cada archivo está comentado explicando el *por qué*, no solo el *qué*.
