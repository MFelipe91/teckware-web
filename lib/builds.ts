import 'server-only'
import { createServerClient } from '@/lib/supabase-server'
import { INITIAL_BUILDS, type Build } from '@/lib/builds-data'

type BuildRow = {
  id: string
  nombre: string
  tag: string | null
  tag_color: string | null
  descripcion: string | null
  precio: number
  disponible: boolean
  featured: boolean
  specs: Build['specs']
  fps: Build['fps']
  youtube_id: string | null
  orden: number
}

export function rowToBuild(r: BuildRow): Build {
  return {
    id: r.id,
    nombre: r.nombre,
    tag: r.tag ?? '',
    tagColor: (r.tag_color ?? 'cyan') as Build['tagColor'],
    descripcion: r.descripcion ?? '',
    precio: r.precio,
    disponible: r.disponible,
    featured: r.featured,
    specs: r.specs,
    fps: r.fps ?? {},
    youtubeId: r.youtube_id ?? '',
  }
}

export function buildToRow(b: Build, orden = 0) {
  return {
    id: b.id,
    nombre: b.nombre,
    tag: b.tag,
    tag_color: b.tagColor,
    descripcion: b.descripcion,
    precio: b.precio,
    disponible: b.disponible,
    featured: b.featured,
    specs: b.specs,
    fps: b.fps,
    youtube_id: b.youtubeId,
    orden,
    updated_at: new Date().toISOString(),
  }
}

/**
 * Builds para la página pública /builds.
 * Lee de Supabase; si la tabla no existe, está vacía o falla, usa el código.
 */
export async function getBuilds(): Promise<Build[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from('builds').select('*').order('orden', { ascending: true })
    if (error || !data || data.length === 0) return INITIAL_BUILDS
    return (data as BuildRow[]).map(rowToBuild)
  } catch {
    return INITIAL_BUILDS
  }
}
