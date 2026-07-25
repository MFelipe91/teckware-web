import 'server-only'
import { createServerClient } from '@/lib/supabase-server'
import { SERVICIOS } from '@/lib/constants'

export type Servicio = {
  id: string
  nombre: string
  descripcion: string
  precio: string
  tiempo: string
  icono: string
  featured: boolean
  whatsappKey: string
}

/** Fallback: los servicios definidos en código (fuente de la semilla). */
export const INITIAL_SERVICIOS: Servicio[] = SERVICIOS as Servicio[]

type ServiceRow = {
  id: string
  nombre: string
  descripcion: string | null
  precio: string | null
  tiempo: string | null
  icono: string | null
  whatsapp_key: string | null
  featured: boolean
  activo: boolean
  orden: number
}

function rowToServicio(r: ServiceRow): Servicio {
  return {
    id: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion ?? '',
    precio: r.precio ?? 'A cotizar',
    tiempo: r.tiempo ?? '',
    icono: r.icono ?? 'package',
    featured: r.featured,
    whatsappKey: r.whatsapp_key ?? '',
  }
}

/**
 * Servicios para las páginas públicas.
 * Lee de Supabase; si la tabla no existe, está vacía o falla, usa el código.
 */
export async function getServices(): Promise<Servicio[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true })
    if (error || !data || data.length === 0) return INITIAL_SERVICIOS
    return (data as ServiceRow[]).map(rowToServicio)
  } catch {
    return INITIAL_SERVICIOS
  }
}
