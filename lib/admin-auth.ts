import 'server-only'
import { cookies, headers } from 'next/headers'
import crypto from 'crypto'
import { rateLimit } from '@/lib/security'

const COOKIE = 'tw_admin'
const MAX_AGE = 60 * 60 * 8 // 8 horas

const sha256 = (texto: string) => crypto.createHash('sha256').update(texto).digest()

// Sin ADMIN_PASSWORD el panel queda cerrado: el repositorio es público, así que aquí nunca
// puede haber una contraseña de respaldo.
function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null
}

/** Token de sesión derivado de la password (no expone la password en la cookie). */
function sessionToken(): string | null {
  const password = adminPassword()
  return password ? sha256(`tw::${password}`).toString('hex') : null
}

/** Verifica credenciales y, si son correctas, abre sesión (cookie httpOnly). */
export async function login(password: string): Promise<boolean> {
  const esperada = adminPassword()
  const token = sessionToken()
  if (!esperada || !token || typeof password !== 'string' || password.length === 0) return false

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
  if (!rateLimit(`admin:${ip}`, 5, 60_000).ok) return false

  if (!crypto.timingSafeEqual(sha256(password), sha256(esperada))) return false

  const c = await cookies()
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
  return true
}

export async function logout(): Promise<void> {
  const c = await cookies()
  c.delete(COOKIE)
}

/** True si la request trae una sesión de admin válida. */
export async function isAuthed(): Promise<boolean> {
  const token = sessionToken()
  if (!token) return false
  const c = await cookies()
  return c.get(COOKIE)?.value === token
}

/** Lanza si no hay sesión. Usar al inicio de acciones sensibles. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthed())) throw new Error('No autorizado')
}
