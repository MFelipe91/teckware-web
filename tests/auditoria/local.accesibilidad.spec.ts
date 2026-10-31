import { test, type Page } from '@playwright/test'
import { aislarNavegador, exigirSupabaseFalso, guardar, revisarAxe, type Caso } from './comun'

const siguiente = (page: Page) => page.getByRole('button', { name: /^(Siguiente|Ver resumen)/ })

/** Descripción del elemento con foco y si tiene un indicador visible. */
const foco = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return { elemento: 'body', visible: false }
    const s = getComputedStyle(el)
    const conBorde = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
    return {
      elemento: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40)}"`,
      visible: conBorde || s.boxShadow !== 'none',
    }
  })

test('axe en estados interactivos y teclado', async ({ page, context, request, baseURL }) => {
  test.setTimeout(10 * 60_000)
  await exigirSupabaseFalso(request, baseURL)
  await aislarNavegador(context)
  const axe: Record<string, Awaited<ReturnType<typeof revisarAxe>>> = {}
  const casos: Caso[] = []

  // Wizard, paso a paso (axe y foco al cambiar de paso).
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/agendar')
  axe['agendar paso 1'] = await revisarAxe(page)
  await page.getByRole('button', { name: /Mantención Full/ }).focus()
  await page.keyboard.press('Space')
  const presionado = await page.getByRole('button', { name: /Mantención Full/ }).getAttribute('aria-pressed')
  casos.push({ caso: 'Elegir servicio con teclado', esperado: 'aria-pressed=true', obtenido: String(presionado), ok: presionado === 'true' })

  await siguiente(page).focus()
  await page.keyboard.press('Enter')
  await page.getByText('Cuéntanos sobre tu equipo').waitFor()
  const trasPaso = await foco(page)
  casos.push({ caso: 'Foco al pasar de paso', esperado: 'Va al nuevo contenido, no se pierde', obtenido: trasPaso.elemento, ok: trasPaso.elemento !== 'body' && !/Siguiente/.test(trasPaso.elemento) })
  const anuncio = trasPaso.elemento.startsWith('h2') ? 1 : await page.locator('[aria-live]').filter({ hasText: /Cuéntanos/ }).count()
  casos.push({ caso: 'Cambio de paso anunciado a lector de pantalla', esperado: 'Región aria-live o foco en el título', obtenido: anuncio ? 'anunciado' : 'sin anuncio', ok: anuncio > 0 })
  axe['agendar paso 2'] = await revisarAxe(page)

  await page.getByRole('button', { name: 'Notebook', exact: true }).click()
  await page.getByLabel(/Describe el problema/).fill('Se apaga solo')
  await siguiente(page).click()
  axe['agendar paso 3'] = await revisarAxe(page)
  await page.getByLabel(/Tu nombre/).fill('Prueba Auditoria')
  await page.getByLabel(/Teléfono/).fill('+56 9 1111 2222')
  await siguiente(page).click()
  axe['agendar paso 4'] = await revisarAxe(page)

  // /solicitar con los errores a la vista.
  await page.goto('/solicitar')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /Enviar por WhatsApp/ }).click()
  await page.locator('form p.text-danger').first().waitFor()
  axe['solicitar con errores'] = await revisarAxe(page)
  const enfocado = await foco(page)
  casos.push({ caso: 'Foco al primer campo con error', esperado: 'input#nombre', obtenido: enfocado.elemento, ok: enfocado.elemento.startsWith('input') })

  // Recorrido con Tab por el inicio.
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const pasos: { elemento: string; visible: boolean }[] = []
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press('Tab')
    pasos.push(await foco(page))
  }
  const sinIndicador = pasos.filter((p) => !p.visible && p.elemento !== 'body')
  casos.push({ caso: 'Indicador de foco (45 Tab en la home)', esperado: 'Visible en todos', obtenido: `${pasos.length - sinIndicador.length}/${pasos.length} con indicador. Sin él: ${[...new Set(sinIndicador.map((p) => p.elemento))].slice(0, 6).join('; ') || 'ninguno'}`, ok: sinIndicador.length === 0 })
  const saltar = /saltar|ir al contenido/i.test(pasos[0]?.elemento ?? '')
  casos.push({ caso: 'Enlace "saltar al contenido"', esperado: 'Primer Tab', obtenido: pasos[0]?.elemento ?? '', ok: saltar })

  // Menú móvil.
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const menu = page.getByRole('button', { name: 'Abrir menú' })
  await menu.focus()
  await page.keyboard.press('Enter')
  const abierto = await page.getByRole('button', { name: 'Cerrar menú' }).getAttribute('aria-expanded')
  casos.push({ caso: 'Abrir menú móvil con Enter', esperado: 'aria-expanded=true', obtenido: String(abierto), ok: abierto === 'true' })
  axe['menú móvil abierto'] = await revisarAxe(page)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Abrir menú' }).waitFor()
  const trasMenu = await foco(page)
  casos.push({ caso: 'Cerrar menú con Esc', esperado: 'Cierra y el foco vuelve al botón', obtenido: trasMenu.elemento, ok: /menú/i.test(trasMenu.elemento) })

  // Chat.
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/contacto')
  await page.waitForLoadState('networkidle')
  const fab = page.getByRole('button', { name: /Abrir chat/ })
  await fab.focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(500)
  const enChat = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
  casos.push({ caso: 'Abrir chat con Enter', esperado: 'Foco en el campo de texto', obtenido: String(enChat), ok: enChat === 'Escribe tu consulta' })
  axe['chat abierto'] = await revisarAxe(page)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  const trasChat = await foco(page)
  const cerrado = await page.getByRole('button', { name: /Abrir chat/ }).count()
  casos.push({ caso: 'Cerrar chat con Esc', esperado: 'Cierra y el foco vuelve al botón', obtenido: `cerrado=${cerrado === 1}, foco: ${trasChat.elemento}`, ok: cerrado === 1 && /chat/i.test(trasChat.elemento) })

  // Login de /admin.
  await page.goto('/admin')
  await page.getByPlaceholder('Ingresa la contraseña').waitFor({ timeout: 60_000 })
  axe['admin login'] = await revisarAxe(page)
  const conEtiqueta = await page.getByLabel('Contraseña').count()
  casos.push({ caso: 'Campo de contraseña con etiqueta asociada', esperado: 'label vinculado', obtenido: conEtiqueta ? 'vinculado' : 'label sin htmlFor', ok: conEtiqueta > 0 })

  guardar('accesibilidad-interactiva', { casos, axe })
})
