# Handoff — Hackathon Noreste

Documento de traspaso del estado del proyecto. Para que cualquiera del equipo pueda continuar sin contexto previo.

**Última actualización:** 2026-06-27

---

## 1. Qué es esto

Repositorio del **Hackathon Hyperdigital × Google** (sábado 27 de junio de 2026).

- **Reto:** desarrollar una solución que resuelva una problemática de la región **Noreste de México** (Nuevo León, Coahuila, Tamaulipas). Gana la propuesta más creativa.
- **Base de código:** el template **TeamUp MVP** (un ATS multi-tenant con IA, React + Vite + TypeScript) que viene en el kit del hackathon. Lo usamos como punto de partida.

## 2. Dónde está

- **Repo GitHub:** https://github.com/jagu4r/hackathon-noreste (público, cuenta `jagu4r`)
- **Local:** `/Users/omar/projects/hackaton/hackathon-noreste`
- **Rama:** `main`

## 3. Estructura

```
hackathon-noreste/
├── README.md              Portada + el reto
├── handoff.md             Este documento
├── COMO_PROBAR.md         Paso a paso para correr el MVP (principiantes)
├── package.json, vite.config.ts, tsconfig.json, index.html
├── .env.example           Plantilla de variables (sin secretos)
├── src/                   Código del MVP
│   ├── pages/             9 secciones (Dashboard, Vacantes, Candidatos, CargaMasiva,
│   │                      Pipeline, Taxonomia, BolsaPublica, Postulaciones, Atribucion)
│   ├── lib/ai/            Capa de IA mockeable (extract, score, taxonomy, llm, mapLimit)
│   ├── lib/services/      Service layer (candidatos)
│   ├── lib/               data, supabase, useAsync
│   ├── components/        Layout
│   ├── brand/             Logo
│   └── seed/              Datos mock
├── supabase/
│   └── migrations/0001_init.sql   Esquema SQL con RLS
├── docs/
│   └── TEMPLATE.md        Arquitectura del template MVP
└── recursos/              Material del kit del hackathon
    ├── README.md          Índice del kit
    ├── teamup-mvp-guia.md
    ├── guias/             7 guías HTML (primeros-pasos, avanzado, orwel-kit,
    │                      skills-catalogo, teamup-demo, teamup-papers, inico)
    ├── skills/            8 skills de IA (orwel, hyper-llm, hyper-core, hyper-sdk,
    │                      hyper-doc, hyper-papers, hyper-env, svelte-loading)
    └── assets/            Logos (hyper, teamup)
```

## 4. Cómo correrlo

Requiere Node.js (probado con Node 26 / npm 11).

```bash
git clone git@github.com:jagu4r/hackathon-noreste.git
cd hackathon-noreste
npm install
npm run dev        # http://localhost:5173 — corre con datos mock, sin configurar nada
```

Otros comandos:

```bash
npm run type-check   # tsc --noEmit
npm run build        # tsc -b && vite build
npm run preview      # sirve el build de producción
```

Para persistir datos de verdad: copia `.env.example` a `.env` y llena Supabase/IA. **El `.env` real NUNCA se sube** (ya está en `.gitignore`).

## 5. Estado actual

| Item | Estado |
|---|---|
| Repo creado y pusheado a GitHub | ✅ |
| Recursos del kit organizados en `/recursos` | ✅ |
| `npm install` | ✅ sin errores |
| `npm run type-check` | ✅ pasa |
| `npm run build` | ✅ compila (106 módulos) |
| Sin secretos en el repo | ✅ solo `.env.example` vacío |
| **Problema del Noreste a resolver** | ⬜ pendiente de definir |
| **Propuesta de solución / demo** | ⬜ pendiente |

## 6. Lo que sigue (pendientes)

1. **Definir el problema** del Noreste de México a atacar (lluvia de ideas → enfoque creativo).
2. **Aterrizar la propuesta de valor** y decidir si el template TeamUp se adapta o se construye algo nuevo encima.
3. **Construir el demo** entregable.
4. **Llenar la sección "El reto"** en `README.md` con el problema elegido y la propuesta.

## 7. Notas

- El material de `/recursos` es del kit del hackathon (Hyperdigital × Google), no contiene datos internos de Deacero.
- Las guías HTML son autocontenidas: ábrelas con doble clic en el navegador.
- El demo interactivo de TeamUp (`recursos/guias/teamup-demo.html`) sirve para entender el producto sin instalar nada.
