import fs from 'node:fs'
import path from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, type APIRequestContext, type BrowserContext, type Page } from '@playwright/test'

export const ETAPA = process.env.AUDIT_ETAPA === 'despues' ? 'despues' : 'antes'
export const DIR_DATOS = path.join(process.cwd(), 'docs', 'auditoria', 'datos', ETAPA)
export const DIR_CAPTURAS = path.join(process.cwd(), 'docs', 'auditoria', 'capturas', ETAPA)

export const SUPABASE_FALSO = 'http://127.0.0.1:54399'

export type Caso = { caso: string; esperado: string; obtenido: string; ok: boolean }

export function guardar(nombre: string, datos: unknown) {
  fs.mkdirSync(DIR_DATOS, { recursive: true })
  fs.writeFileSync(path.join(DIR_DATOS, `${nombre}.json`), JSON.stringify(datos, null, 2))
}

export const ANALITICA =
  /googletagmanager\.com|google-analytics\.com|analytics\.google\.com|vercel-insights\.com|\/_vercel\//

/** Bloquea la analítica para no ensuciar las visitas ni la conversión reales. */
export async function bloquearAnalitica(context: BrowserContext) {
  await context.route(ANALITICA, (route) => route.abort())
}

/** Elementos cuyo contraste axe no puede calcular (texto sobre imagen o degradado). */
export async function contrasteSinResolver(page: Page) {
  const r = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  return r.incomplete.flatMap((i) => i.nodes.map((n) => n.target.join(' ').slice(0, 100)))
}

export async function revisarAxe(page: Page) {
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()
  return r.violations.map((v) => ({
    regla: v.id,
    impacto: v.impact,
    ayuda: v.help,
    nodos: v.nodes.length,
    ejemplos: v.nodes.slice(0, 3).map((n) => ({
      selector: n.target.join(' '),
      detalle: (n.any[0]?.message ?? n.failureSummary ?? '').slice(0, 200),
    })),
  }))
}

type RegistroFalso = {
  peticiones: { metodo: string; ruta: string; bytes: number; cuerpo: string }[]
  solicitudes: Record<string, unknown>[]
}

export async function registroFalso(request: APIRequestContext): Promise<RegistroFalso> {
  const r = await request.get(`${SUPABASE_FALSO}/__registro`)
  return (await r.json()) as RegistroFalso
}

/**
 * Freno de seguridad: confirma que el servidor habla con el Supabase falso antes de enviar nada.
 * La home consulta Supabase al renderizar; si esa consulta no llega aquí, la prueba se detiene.
 */
export async function exigirSupabaseFalso(request: APIRequestContext, baseURL: string | undefined) {
  expect(baseURL, 'Las pruebas con envíos solo corren en localhost').toContain('localhost')
  const antes = (await registroFalso(request)).peticiones.length
  await request.get(`${baseURL}/?auditoria=${Date.now()}`, { timeout: 180_000 })
  const despues = (await registroFalso(request)).peticiones.length
  expect(despues, 'El servidor local no está usando el Supabase falso: se detiene la prueba').toBeGreaterThan(antes)
}

/** Corta cualquier salida del navegador a Supabase real y a WhatsApp. */
export async function aislarNavegador(context: BrowserContext) {
  const bloqueadas: string[] = []
  await context.route(/supabase\.co|wa\.me|api\.whatsapp\.com/, (route) => {
    bloqueadas.push(route.request().url().split('?')[0])
    return route.abort()
  })
  return bloqueadas
}
