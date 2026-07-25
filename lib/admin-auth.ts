import 'server-only'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE = 'tw_admin'
const MAX_AGE = 60 * 60 * 8 // 8 horas

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? 'teckware2026'
}

/** Token de sesión derivado de la password (no expone la password en la cookie). */
function sessionToken(): string {
  return crypto.createHash('sha256').update(`tw::${adminPassword()}`).digest('hex')
}

/** Verifica credenciales y, si son correctas, abre sesión (cookie httpOnly). */
export async function login(password: string): Promise<boolean> {
  const ok =
    typeof password === 'string' &&
    password.length > 0 &&
    password === adminPassword()
  if (!ok) return false

  const c = await cookies()
  c.set(COOKIE, sessionToken(), {
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
  const c = await cookies()
  return c.get(COOKIE)?.value === sessionToken()
}

/** Lanza si no hay sesión. Usar al inicio de acciones sensibles. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAuthed())) throw new Error('No autorizado')
}
