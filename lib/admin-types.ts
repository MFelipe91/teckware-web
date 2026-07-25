export type ServiceRequest = {
  id: string
  created_at: string
  servicio: string
  servicio_label: string | null
  equipo_tipo: string | null
  marca: string | null
  problema: string | null
  foto_urls: string[]
  nombre: string
  telefono: string
  fecha_preferida: string | null
  horario: string | null
  estado: string
  notas: string | null
  origen: string
}

export const ESTADOS = ['nuevo', 'contactado', 'agendado', 'en_proceso', 'completado', 'cancelado'] as const

/** Fila editable de servicio (tabla Supabase `services`). */
export type ServiceRow = {
  id: string
  nombre: string
  descripcion: string
  precio: string
  tiempo: string
  icono: string
  whatsapp_key: string
  featured: boolean
  activo: boolean
  orden: number
}

/** Íconos disponibles para servicios (deben existir en el mapa de /servicios). */
export const ICONOS_SERVICIO = [
  'search', 'refresh-cw', 'tool', 'cpu', 'package', 'briefcase',
  'hard-drive', 'zap', 'gamepad', 'map-pin',
] as const
