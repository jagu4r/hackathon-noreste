-- =====================================================================
-- TeamUp MVP · Esquema inicial
-- =====================================================================
-- La idea CLAVE del multi-tenant: cada tabla de datos lleva workspace_id
-- y una política RLS (Row-Level Security). Así, aunque el código de la app
-- tenga un bug y olvide filtrar, la BASE DE DATOS impide que un usuario vea
-- datos de otra empresa. La seguridad no vive en la UI: vive aquí.
-- =====================================================================

-- ---------- Workspaces (los "tenants": cada empresa/equipo) ----------
create table workspaces (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  created_at  timestamptz not null default now()
);

-- ---------- Miembros: qué usuario pertenece a qué workspace ----------
create table workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  rol          text not null default 'member',  -- 'owner' | 'admin' | 'member'
  created_at   timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

-- ---------- Vacantes ----------
create table vacantes (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  titulo        text not null,
  ubicacion     text,
  modalidad     text default 'remoto',         -- 'remoto'|'hibrido'|'presencial'
  skills        text[] default '{}',           -- skills requeridos
  estado        text not null default 'activa',-- 'borrador'|'activa'|'cerrada'
  created_at    timestamptz not null default now()
);

-- ---------- Candidatos ----------
create table candidatos (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  vacante_id    uuid references vacantes(id) on delete set null,
  nombre        text not null,
  email         text,
  cv_raw        text,                          -- texto crudo del CV (OCR)
  perfil        jsonb,                         -- JSON compacto extraído por IA
  ai_score      int,                           -- 0-100, calculado por IA
  ai_motivo     text,                          -- por qué ese score
  estado        text not null default 'nuevo', -- nuevo|entrevista|oferta|...
  origen        text,                          -- de dónde vino (atribución)
  created_at    timestamptz not null default now()
);

-- Índices: el filtro por tenant SIEMPRE va primero. Sin esto, a escala
-- la base escanea tablas completas en cada consulta.
create index on vacantes   (workspace_id, created_at desc);
create index on candidatos (workspace_id, created_at desc);
create index on candidatos (workspace_id, vacante_id);

-- =====================================================================
-- Row-Level Security: el muro que aísla a cada tenant
-- =====================================================================
alter table workspaces        enable row level security;
alter table workspace_members enable row level security;
alter table vacantes          enable row level security;
alter table candidatos        enable row level security;

-- Un usuario solo "ve" los workspaces de los que es miembro.
create policy "miembro ve su workspace" on workspaces
  for select using (
    id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

create policy "miembro ve su membresía" on workspace_members
  for select using (user_id = auth.uid());

-- Vacantes y candidatos: solo si perteneces a su workspace.
-- Reutilizable: cualquier tabla de datos lleva una política idéntica.
create policy "acceso vacantes por workspace" on vacantes
  for all using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

create policy "acceso candidatos por workspace" on candidatos
  for all using (
    workspace_id in (select workspace_id from workspace_members where user_id = auth.uid())
  );

-- =====================================================================
-- Datos de ejemplo (semilla) — borra esto en producción
-- =====================================================================
-- insert into workspaces (id, nombre) values
--   ('00000000-0000-0000-0000-000000000001', 'Acme Reclutamiento');
