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

// ============================================================
// Rate limiting (best-effort, en memoria por instancia)
// ------------------------------------------------------------
// Ventana deslizante simple. En Vercel serverless cada instancia
// tiene su propio Map, así que esto NO es un límite global estricto.
// Para producción de alto tráfico, migrar a Upstash Redis o una
// tabla en Supabase. Para el volumen de TECKWARE es suficiente para
// frenar abuso básico / bots.
// ============================================================
const hits = new Map<string, number[]>()

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs)
  if (arr.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - arr[0])) / 1000)
    return { ok: false, retryAfter }
  }
  arr.push(now)
  hits.set(key, arr)
  // Limpieza oportunista para no crecer sin límite
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k)
    }
  }
  return { ok: true, retryAfter: 0 }
}

/** Extrae la IP del cliente desde los headers estándar de proxy (Vercel). */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

// ------------------------------------------------------------
// Validación del payload de creación de pago
// ------------------------------------------------------------
export const paymentSchema = z.object({
  servicioId: z.string().min(1).max(60),
  amount: z.number().int().positive().max(100_000_000), // tope de sanidad (CLP)
  subject: z.string().min(2).max(120),
  email: z.string().email('Email inválido'),
  nombre: z.string().min(2, 'Nombre muy corto').max(80, 'Nombre muy largo'),
  serviceRequestId: z.string().uuid().optional(),
})

export type PaymentForm = z.infer<typeof paymentSchema>
