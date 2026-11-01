import { z } from 'zod'
import { nombreSchema, telefonoSchema } from '@/lib/security'
import { filasCotizacion } from '@/lib/cotizacion-filas'

// Cotización de PC Gamer a pedido: el mismo esquema valida en el navegador y en la API.

export const PRESUPUESTOS = [
  'Hasta $1.500.000',
  '$1.500.000 a $2.500.000',
  '$2.500.000 a $4.000.000',
  'Más de $4.000.000',
  'Aún no lo sé',
] as const
export const USOS = ['Juegos', 'Streaming', 'Edición', 'Trabajo'] as const
export const RESOLUCIONES = ['1080p', '1440p', '4K', 'No estoy seguro'] as const
export const FPS = ['60 FPS', '120 FPS', '144 FPS', '240 FPS o más', 'No estoy seguro'] as const
export const MONITOR = ['No, solo el PC', 'Solo monitor', 'Solo periféricos', 'Monitor y periféricos'] as const
export const PLAZOS = ['Sin apuro', 'Este mes', 'En dos semanas', 'Lo antes posible'] as const

const textoOpcional = (max: number) =>
  z.string().trim().max(max, `Máximo ${max} caracteres`).optional().or(z.literal(''))

export const cotizacionSchema = z.object({
  presupuesto: z.enum(PRESUPUESTOS, { error: 'Elige un presupuesto aproximado' }),
  usos: z.array(z.enum(USOS), { error: 'Elige al menos un uso' }).min(1, 'Elige al menos un uso'),
  resolucion: z.enum(RESOLUCIONES, { error: 'Elige una resolución' }),
  fps: z.enum(FPS, { error: 'Elige los FPS que buscas' }),
  programas: z.string().trim().min(3, 'Cuéntanos qué juegos o programas usarás').max(500, 'Máximo 500 caracteres'),
  marcas: textoOpcional(200),
  componentes: textoOpcional(500),
  monitor: z.enum(MONITOR, { error: 'Indica si necesitas monitor o periféricos' }),
  plazo: z.enum(PLAZOS, { error: 'Elige un plazo' }),
  nombre: nombreSchema,
  telefono: telefonoSchema,
})

export type Cotizacion = z.infer<typeof cotizacionSchema>

export { filasCotizacion }

export const resumenCotizacion = (c: Cotizacion) =>
  filasCotizacion(c).map((f) => `${f.etiqueta}: ${f.valor}`).join('\n')
