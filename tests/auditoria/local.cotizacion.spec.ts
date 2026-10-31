import { test, expect, type Page } from '@playwright/test'
import { NOTA_PC } from '../../lib/constants'
import { aislarNavegador, exigirSupabaseFalso, guardar, registroFalso, revisarAxe, type Caso } from './comun'

const NUMERO = '56930209427'

async function llenar(page: Page) {
  await page.selectOption('#presupuesto', { index: 2 })
  await page.getByRole('checkbox', { name: 'Juegos' }).check()
  await page.getByRole('checkbox', { name: 'Streaming' }).check()
  await page.selectOption('#resolucion', '1440p')
  await page.selectOption('#fps', '144 FPS')
  await page.fill('#programas', 'Fortnite y DaVinci Resolve')
  await page.fill('#marcas', 'AMD')
  await page.fill('#componentes', 'Gabinete y fuente 750 W')
  await page.selectOption('#monitor', 'Solo monitor')
  await page.selectOption('#plazo', 'Este mes')
  await page.fill('#nombre', 'Prueba Cotizacion')
  await page.fill('#telefono', '+56 9 1111 3333')
}

test('/builds: niveles y cotización a pedido', async ({ page, context, request, baseURL }) => {
  await exigirSupabaseFalso(request, baseURL)
  await aislarNavegador(context)
  const casos: Caso[] = []
  const anotar = (caso: string, esperado: string, obtenido: unknown, ok: boolean) => {
    casos.push({ caso, esperado, obtenido: String(obtenido), ok })
  }

  await page.goto('/builds')
  await page.waitForLoadState('networkidle')
  const texto = await page.locator('main').innerText()
  for (const prohibido of [/Disponible/i, /M[aá]s pedido/i, /Cotizamos gratis/i, /Bajo pedido/i, /Starter Beast/]) {
    anotar(`Sin el texto ${prohibido.source}`, 'ausente', prohibido.test(texto) ? 'presente' : 'ausente', !prohibido.test(texto))
  }
  for (const nivel of ['Starter', 'Mid', 'Ultra']) {
    const h = await page.getByRole('heading', { name: nivel, exact: true }).count()
    anotar(`Nivel ${nivel}`, 'visible', h, h === 1)
  }
  anotar('Nota de precio referencial', 'exacta', texto.includes(NOTA_PC), texto.includes(NOTA_PC))

  const enviar = page.getByRole('button', { name: 'Revisar cotización' })
  await enviar.click()
  const errores = page.locator('form [role="alert"]')
  await errores.first().waitFor()
  const n = await errores.count()
  anotar('Enviar vacío', '9 errores (campos obligatorios)', n, n === 9)
  const conAria = await page.locator('#presupuesto').getAttribute('aria-invalid')
  anotar('Error anunciado', 'aria-invalid=true', conAria, conAria === 'true')
  anotar('Foco al primer error', 'presupuesto', await page.evaluate(() => document.activeElement?.id), (await page.evaluate(() => document.activeElement?.id)) === 'presupuesto')
  const axe = await revisarAxe(page)

  await llenar(page)
  await page.fill('#telefono', '123')
  await enviar.click()
  await page.getByText('Teléfono chileno inválido').waitFor()
  anotar('Teléfono inválido', 'rechazado', 'rechazado', true)
  await page.fill('#telefono', '+56 9 1111 3333')
  await enviar.click()

  await page.getByRole('heading', { name: 'Revisa tu cotización' }).waitFor()
  const enFoco = await page.evaluate(() => document.activeElement?.tagName)
  anotar('Foco al resumen', 'H3', enFoco, enFoco === 'H3')
  const axeResumen = await revisarAxe(page)

  const enlace = page.getByRole('link', { name: 'Enviar por WhatsApp' })
  const href = new URL((await enlace.getAttribute('href')) ?? '')
  const msg = href.searchParams.get('text') ?? ''
  anotar('Número', NUMERO, href.pathname, href.pathname === `/${NUMERO}`)
  for (const dato of ['Juegos, Streaming', '1440p, 144 FPS', 'Fortnite y DaVinci Resolve', 'AMD', 'Gabinete y fuente 750 W', 'Solo monitor', 'Este mes', 'Prueba Cotizacion', '+56 9 1111 3333']) {
    anotar(`Mensaje incluye "${dato}"`, 'presente', msg.includes(dato), msg.includes(dato))
  }

  const antes = (await registroFalso(request)).solicitudes.length
  const respuesta = page.waitForResponse('**/api/cotizaciones')
  const popup = context.waitForEvent('page')
  await enlace.click()
  const r = await respuesta
  await (await popup).close().catch(() => {})
  anotar('POST /api/cotizaciones', '200', r.status(), r.status() === 200)
  const popup2 = context.waitForEvent('page')
  await enlace.click()
  await (await popup2).close().catch(() => {})
  await page.waitForTimeout(600)
  const nuevas = (await registroFalso(request)).solicitudes.slice(antes)
  anotar('Doble clic', '1 fila', nuevas.length, nuevas.length === 1)
  const fila = nuevas[0] ?? {}
  anotar('Fila guardada', 'origen builds y detalle', JSON.stringify(fila).slice(0, 300),
    fila.origen === 'builds' && fila.servicio === 'pc-gamer-a-pedido' && String(fila.problema).includes('Resolución y FPS: 1440p, 144 FPS'))

  // Si falla el guardado, el cliente lo ve.
  await page.reload()
  await page.waitForLoadState('networkidle')
  await llenar(page)
  await enviar.click()
  await page.route('**/api/cotizaciones', (route) => route.fulfill({ status: 500, json: { error: 'simulado' } }))
  const popup3 = context.waitForEvent('page')
  await page.getByRole('link', { name: 'Enviar por WhatsApp' }).click()
  await (await popup3).close().catch(() => {})
  const aviso = page.getByText('No pudimos registrar tu cotización')
  await aviso.waitFor()
  anotar('Guardado con error 500', 'Aviso visible', await aviso.innerText(), true)
  await page.unroute('**/api/cotizaciones')

  // API directa.
  const api = `${baseURL}/api/cotizaciones`
  const h = { 'x-forwarded-for': '10.6.0.1' }
  let s = (await request.post(api, { headers: h, data: { nombre: 'Solo' } })).status()
  anotar('API sin datos', '400', s, s === 400)
  s = (await request.post(api, { headers: { ...h, 'Content-Type': 'application/json' }, data: '{ roto' })).status()
  anotar('API con JSON roto', '400', s, s === 400)

  guardar('form-cotizacion', { casos, axe, axeResumen })
  expect(casos.filter((c) => !c.ok)).toEqual([])
})
