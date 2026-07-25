-- ============================================================
-- TECKWARE — Tabla de SERVICIOS (editables desde el panel admin)
-- Ejecutar UNA VEZ en Supabase → SQL Editor → Run
-- Los datos se auto-importan desde el código la primera vez
-- que abras la pestaña "Servicios" en el panel (no hace falta seed manual).
-- ============================================================

create table if not exists public.services (
  id           text primary key,
  nombre       text not null,
  descripcion  text,
  precio       text,
  tiempo       text,
  icono        text,
  whatsapp_key text,
  featured     boolean not null default false,
  activo       boolean not null default true,
  orden        integer not null default 0,
  updated_at   timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services for select using (true);
