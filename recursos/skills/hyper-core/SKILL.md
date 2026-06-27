---
name: hyper-core
description: Arquitectura de referencia de Hyperdigital para levantar un backend nuevo (API + base de datos + auth) multi-tenant. Úsala cuando el usuario quiera crear un backend desde cero, diseñar el esquema de una base, montar autenticación, o estructurar servicios. Se dispara con "nuevo backend", "API desde cero", "multi-tenant", "RLS", "service layer".
disable-model-invocation: false
---

# Hyper Core — Backend nuevo, bien hecho desde el día 1

Plantilla mental de Hyperdigital para arrancar un backend que no se rompa al crecer. Vale para un MVP de hackathon y escala a producción. Default stack: **Supabase (Postgres) + TypeScript**, o **FastAPI (Python)** cuando se necesitan microservicios/colas. Adapta, no copies a ciegas.

## Regla 0 — Multi-tenant desde el primer commit

Si la app la usará más de un cliente/equipo/usuario aislado, **cada tabla con datos de cliente lleva `workspace_id` (o `tenant_id`) y una política RLS**. Reintroducir aislamiento después es una migración dolorosa. No lo pospongas.

## Paso 1 — Modela los datos antes que el código

1. Identifica las **entidades núcleo** (3-6 máximo para un MVP) y sus relaciones.
2. Toda entidad de negocio: `id uuid pk`, `workspace_id uuid`, `created_at timestamptz default now()`, `updated_at`.
3. Escribe la migración SQL primero. Versiona en `migrations/` con timestamp.

```sql
create table items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id),
  nombre text not null,
  created_at timestamptz not null default now()
);
alter table items enable row level security;
create policy "items: solo mi workspace" on items
  for all using (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);
create index on items (workspace_id, created_at desc);
```

## Paso 2 — Auth simple y robusta

- Default: **Magic Link / OTP** (Supabase Auth) — sin contraseñas que mantener.
- El `workspace_id` viaja en el JWT (claim) para que RLS lo lea sin un round-trip extra.
- Roles por workspace en una tabla `workspace_members (user_id, workspace_id, role)`.

## Paso 3 — Service layer obligatorio

Nada de lógica de datos en los handlers/controladores ni en la UI. Toda lectura/escritura pasa por `services/<entidad>.ts`. Beneficio: cambiar de proveedor, cachear, validar o loguear se hace en un solo lugar.

```ts
// services/items.ts
export async function listItems(workspaceId: string) {
  const { data, error } = await db.from('items')
    .select('id, nombre, created_at')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
```

## Paso 4 — Contratos y validación en el borde

- Valida toda entrada con un esquema (Zod / Pydantic). Nunca confíes en el cliente.
- Define el contrato de la API (OpenAPI) si otra gente la va a consumir.
- Respuestas con forma estable: `{ data, error, pagination }`. Pagina siempre las listas.

## Paso 5 — Operación mínima viable

- **Rate limiting** por API key/usuario (aunque sea en memoria para el MVP; Redis en prod).
- **Idempotencia** en endpoints que crean recursos si se pueden reintentar.
- **Logs estructurados** (JSON) con `workspace_id` y `request_id` para depurar.
- Secretos en variables de entorno, nunca en el repo.

## Cuándo partir a microservicios

No empieces con micro-servicios. Sepáralos solo cuando una pieza tenga **escala, lenguaje o ciclo de vida distinto**: OCR/visión, procesamiento pesado de IA (ver `[[hyper-llm]]`), jobs largos, conectores externos. Comunícalos por HTTP o cola, con timeouts y reintentos.

## Checklist antes de declarar el backend listo

- [ ] Toda tabla de cliente tiene `workspace_id` + RLS probada.
- [ ] Auth funciona y el `workspace_id` llega en el token.
- [ ] Toda la lógica de datos vive en `services/`.
- [ ] Entradas validadas con esquema; listas paginadas.
- [ ] Secretos en env; `.env` en `.gitignore`.
- [ ] Migraciones versionadas y reproducibles desde cero.

## Relacionadas
- `[[hyper-sdk]]` — si vas a exponer este backend como SDK.
- `[[hyper-llm]]` — si el backend orquesta IA.
- `[[hyper-doc]]` — para documentar lo que construiste.
