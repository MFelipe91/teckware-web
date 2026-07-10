import { z } from 'zod'

export function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 1000)
}

export const contactSchema = z.object({
  nombre: z.string()
    .min(2, 'Nombre muy corto')
    .max(80, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios'),
  telefono: z.string()
    .regex(/^(\+?56)?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/, 'Teléfono chileno inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  tipoEquipo: z.enum(['notebook', 'pc-gamer', 'macbook', 'aio', 'consola', 'tablet', 'otro']),
  servicio: z.enum(['formateo', 'mantenimiento-fisico', 'diagnostico', 'armado-pc', 'cotizacion-build', 'otro']),
  descripcion: z.string()
    .min(10, 'Describe un poco más el problema')
    .max(500, 'Máximo 500 caracteres'),
})

export type ContactForm = z.infer<typeof contactSchema>
