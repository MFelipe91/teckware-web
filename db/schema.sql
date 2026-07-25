-- ============================================================
-- TECKWARE SpA — Fase 1: Cimiento de datos
-- Ejecutar UNA VEZ en Supabase → SQL Editor → New query → Run
-- Es idempotente: se puede volver a correr sin romper nada.
-- ============================================================

-- 1) SOLICITUDES DE SERVICIO  (wizard /agendar) — el "ticket" de cada cliente
create table if not exists public.service_requests (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  servicio        text not null,
  servicio_label  text,
  equipo_tipo     text,
  marca           text,
  problema        text,
  foto_urls       jsonb not null default '[]'::jsonb,
  nombre          text not null,
  telefono        text not null,
  fecha_preferida date,
  horario         text,
  estado          text not null default 'nuevo',  -- nuevo|contactado|agendado|en_proceso|completado|cancelado
  notas           text,
  origen          text not null default 'agendar'
);
create index if not exists idx_service_requests_created on public.service_requests (created_at desc);
create index if not exists idx_service_requests_estado  on public.service_requests (estado);

-- 2) LEADS  (contacto / solicitar / otros formularios de captación)
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre     text,
  email      text,
  telefono   text,
  mensaje    text,
  origen     text not null default 'web',
  estado     text not null default 'nuevo'
);
create index if not exists idx_leads_created on public.leads (created_at desc);

-- 3) BUILDS  (migra el admin de archivo JSON → base de datos; arregla el bug de Vercel)
create table if not exists public.builds (
  id          text primary key,
  nombre      text not null,
  tag         text,
  tag_color   text,
  descripcion text,
  precio      integer not null default 0,
  disponible  boolean not null default true,
  featured    boolean not null default false,
  specs       jsonb not null default '{}'::jsonb,
  fps         jsonb not null default '{}'::jsonb,
  youtube_id  text,
  orden       integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- SEGURIDAD (RLS)
-- service_requests y leads: datos de clientes → NO accesibles con la anon key.
--   Todo acceso ocurre en el servidor con SERVICE_ROLE_KEY (que bypassa RLS).
-- builds: catálogo público → lectura abierta, escritura solo desde el servidor.
-- ============================================================
alter table public.service_requests enable row level security;
alter table public.leads            enable row level security;
alter table public.builds           enable row level security;

-- builds: permitir SOLO lectura pública (para la página /builds)
drop policy if exists "builds_public_read" on public.builds;
create policy "builds_public_read" on public.builds for select using (true);
