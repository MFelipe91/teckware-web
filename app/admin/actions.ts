'use server'

import type { Build } from '@/lib/builds-data'
import { INITIAL_BUILDS } from '@/lib/builds-data'
import { getBuilds, buildToRow } from '@/lib/builds'
import { createServerClient } from '@/lib/supabase-server'
import { login, logout, isAuthed, requireAdmin } from '@/lib/admin-auth'
import { INITIAL_SERVICIOS } from '@/lib/services'
import type { ServiceRequest, ServiceRow } from '@/lib/admin-types'

/* ============================================================
   AUTENTICACIÓN
   ============================================================ */

export async function loginAction(password: string): Promise<boolean> {
  return login(password)
}

export async function logoutAction(): Promise<void> {
  return logout()
}

export async function isAuthedAction(): Promise<boolean> {
  return isAuthed()
}

/* ============================================================
   SOLICITUDES DE SERVICIO (tickets)  — desde Supabase
   ============================================================ */

export async function getServiceRequestsAction(): Promise<ServiceRequest[]> {
  await requireAdmin()
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) {
    console.error('getServiceRequests error:', error)
    return []
  }
  return (data ?? []) as ServiceRequest[]
}

export async function updateRequestStatusAction(id: string, estado: string): Promise<{ ok: boolean }> {
  await requireAdmin()
  const supabase = createServerClient()
  const { error } = await supabase.from('service_requests').update({ estado }).eq('id', id)
  if (error) {
    console.error('updateRequestStatus error:', error)
    return { ok: false }
  }
  return { ok: true }
}

export async function deleteRequestAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin()
  const supabase = createServerClient()
  const { error } = await supabase.from('service_requests').delete().eq('id', id)
  if (error) {
    console.error('deleteRequest error:', error)
    return { ok: false }
  }
  return { ok: true }
}

/* ============================================================
   SERVICIOS (editables desde el panel)  — Supabase
   ============================================================ */

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

type SupabaseClient = ReturnType<typeof createServerClient>

/** Si la tabla está vacía, la siembra con los servicios del código. */
async function ensureServicesSeeded(supabase: SupabaseClient): Promise<void> {
  const { count } = await supabase.from('services').select('id', { count: 'exact', head: true })
  if ((count ?? 0) > 0) return
  const rows = INITIAL_SERVICIOS.map((s, i) => ({
    id: s.id, nombre: s.nombre, descripcion: s.descripcion, precio: s.precio,
    tiempo: s.tiempo, icono: s.icono, whatsapp_key: s.whatsappKey,
    featured: s.featured, activo: true, orden: i,
  }))
  await supabase.from('services').insert(rows)
}

export async function getServicesAction(): Promise<ServiceRow[]> {
  await requireAdmin()
  const supabase = createServerClient()
  await ensureServicesSeeded(supabase)
  const { data, error } = await supabase.from('services').select('*').order('orden', { ascending: true })
  if (error) {
    console.error('getServices error:', error)
    return []
  }
  return (data ?? []) as ServiceRow[]
}

export async function upsertServiceAction(s: ServiceRow): Promise<{ ok: boolean }> {
  await requireAdmin()
  const supabase = createServerClient()
  const id = s.id || slugify(s.nombre)
  const { error } = await supabase.from('services').upsert({
    id,
    nombre: s.nombre,
    descripcion: s.descripcion,
    precio: s.precio,
    tiempo: s.tiempo,
    icono: s.icono,
    whatsapp_key: s.whatsapp_key,
    featured: s.featured,
    activo: s.activo,
    orden: s.orden,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    console.error('upsertService error:', error)
    return { ok: false }
  }
  return { ok: true }
}

export async function deleteServiceAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin()
  const supabase = createServerClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) {
    console.error('deleteService error:', error)
    return { ok: false }
  }
  return { ok: true }
}

/* ============================================================
   BUILDS (catálogo PC Gamer)  — Supabase
   ============================================================ */

async function ensureBuildsSeeded(supabase: SupabaseClient): Promise<void> {
  const { count } = await supabase.from('builds').select('id', { count: 'exact', head: true })
  if ((count ?? 0) > 0) return
  const rows = INITIAL_BUILDS.map((b, i) => buildToRow(b, i))
  await supabase.from('builds').insert(rows)
}

export async function getBuildsAction(): Promise<Build[]> {
  await requireAdmin()
  const supabase = createServerClient()
  await ensureBuildsSeeded(supabase)
  return getBuilds()
}

export async function upsertBuildAction(build: Build): Promise<{ ok: boolean }> {
  await requireAdmin()
  const supabase = createServerClient()
  const id = build.id || build.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const { error } = await supabase.from('builds').upsert(buildToRow({ ...build, id }))
  if (error) {
    console.error('upsertBuild error:', error)
    return { ok: false }
  }
  return { ok: true }
}

export async function deleteBuildAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin()
  const supabase = createServerClient()
  const { error } = await supabase.from('builds').delete().eq('id', id)
  if (error) {
    console.error('deleteBuild error:', error)
    return { ok: false }
  }
  return { ok: true }
}
