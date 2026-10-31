'use server'

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
  return firmarFotos(supabase, (data ?? []) as ServiceRequest[])
}

const BUCKET_FOTOS = 'booking-photos'

// Las filas antiguas guardan la URL pública completa; las nuevas, la ruta dentro del bucket.
const rutaFoto = (u: string) => u.split(`/${BUCKET_FOTOS}/`).pop() ?? u

async function firmarFotos(supabase: ReturnType<typeof createServerClient>, filas: ServiceRequest[]) {
  const rutas = [...new Set(filas.flatMap((f) => (f.foto_urls ?? []).map(rutaFoto)))]
  if (rutas.length === 0) return filas
  const { data, error } = await supabase.storage.from(BUCKET_FOTOS).createSignedUrls(rutas, 3600)
  if (error || !data) {
    console.error('No se pudieron firmar las fotos:', error)
    return filas.map((f) => ({ ...f, foto_urls: [] }))
  }
  const firmadas = new Map(data.map((d) => [d.path, d.signedUrl]))
  return filas.map((f) => ({
    ...f,
    foto_urls: (f.foto_urls ?? []).map((u) => firmadas.get(rutaFoto(u))).filter((u): u is string => !!u),
  }))
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
