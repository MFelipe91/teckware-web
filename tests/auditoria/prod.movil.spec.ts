import fs from 'node:fs'
import path from 'node:path'
import { test, type Browser, type Page } from '@playwright/test'
import { ANALITICA, bloquearAnalitica } from './comun'
import { LANDINGS } from '../../lib/landings'
import { POSTS } from '../../lib/blog'

// Diagnóstico móvil, SOLO LECTURA sobre producción: abre páginas, mide el DOM y captura.
// Las únicas interacciones son abrir el menú móvil y el chat (sin escribir ni enviar nada).
// Uso: npx playwright test prod.movil   (AUDIT_BASE_URL, AUDIT_ETAPA=despues opcionales)

const ETAPA = process.env.AUDIT_ETAPA === 'despues' ? 'despues' : 'antes'
const DIR_CAPTURAS = path.join(process.cwd(), 'docs', 'movil', ETAPA)
const DIR_DATOS = path.join(process.cwd(), 'docs', 'movil', 'datos', ETAPA)

const RUTA_404 = '/pagina-inexistente-auditoria'
const RUTAS = [
  '/', '/mantencion', '/servicios', '/empresas', '/builds', '/agendar', '/solicitar', '/contacto',
  '/nosotros', '/blog', `/blog/${POSTS[0].slug}`, '/web-qa', '/ciberseguridad', RUTA_404,
  ...LANDINGS.map((l) => l.href),
]
const VISTAS = [
  { ancho: 360, alto: 780, movil: true },
  { ancho: 375, alto: 812, movil: true },
  { ancho: 390, alto: 844, movil: true },
  { ancho: 412, alto: 915, movil: true },
  { ancho: 768, alto: 1024, movil: true },
  { ancho: 1440, alto: 900, movil: false },
]

const nombreArchivo = (ruta: string) =>
  ruta === '/' ? 'home' : ruta === RUTA_404 ? '404' : ruta.slice(1).replaceAll('/', '_')

/** Mide en el navegador todo lo que el informe necesita. Corre dentro de la página. */
function medir() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const visible = (el: Element) => {
    const s = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0 && r.width > 0 && r.height > 0
  }
  const sel = (el: Element) => {
    const id = el.id ? `#${el.id}` : ''
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''
    const texto = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
    return `${el.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ''}${texto ? ` «${texto}»` : ''}`
  }
  const recortadoPorAncestro = (el: Element) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p)
      if (/(hidden|clip)/.test(s.overflowX) || /(hidden|clip)/.test(s.overflow)) {
        const r = p.getBoundingClientRect()
        if (r.right <= vw + 1 && r.left >= -1) return true
      }
    }
    return false
  }
  const scrollY = window.scrollY

  // 1. Desborde horizontal
  const desbordes: string[] = []
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue
    const r = el.getBoundingClientRect()
    if ((r.right > vw + 1 || r.left < -1) && !recortadoPorAncestro(el)) desbordes.push(`${sel(el)} [${Math.round(r.left)}→${Math.round(r.right)}]`)
  }

  // 2. Texto
  const textoChico: Record<string, number> = {}
  const ejemplosTextoChico: string[] = []
  for (const el of document.querySelectorAll('main p, main li, main span, main a, main td, main dd, main small, footer p, footer a, footer li')) {
    if (!visible(el)) continue
    const propio = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent ?? '').join('').trim()
    if (propio.length < 15) continue
    const fs = parseFloat(getComputedStyle(el).fontSize)
    if (fs < 16) {
      const k = `${fs}px`
      textoChico[k] = (textoChico[k] ?? 0) + 1
      if (ejemplosTextoChico.length < 6) ejemplosTextoChico.push(`${k} ${sel(el)}`)
    }
  }
  const titulosCortados: string[] = []
  for (const el of document.querySelectorAll('h1, h2, h3')) {
    if (visible(el) && el.scrollWidth > el.clientWidth + 1) titulosCortados.push(sel(el))
  }
  const tamTitulos = [...document.querySelectorAll('h1, h2')].filter(visible).slice(0, 4).map((h) => ({
    tag: h.tagName, px: parseFloat(getComputedStyle(h).fontSize), lineas: Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight || '1')),
  }))

  // 3. Áreas táctiles
  const objetivos = [...document.querySelectorAll('a[href], button, [role="button"], input:not([type=hidden]), select, textarea, summary')]
    .filter(visible)
    .map((el) => {
      const r = el.getBoundingClientRect()
      const enTexto = getComputedStyle(el).display === 'inline' && !!el.closest('p, li') && (el.closest('p, li')?.textContent ?? '').trim().length > (el.textContent ?? '').trim().length + 10
      return { el, r: { x: r.left, y: r.top + scrollY, w: r.width, h: r.height }, enTexto }
    })
  const chicos = objetivos.filter((o) => !o.enTexto && (o.r.w < 44 || o.r.h < 44))
  const gap = (a: typeof objetivos[number]['r'], b: typeof objetivos[number]['r']) => {
    const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w))
    const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h))
    return Math.max(dx, dy)
  }
  const juntos: string[] = []
  for (const o of chicos) {
    for (const p of objetivos) {
      if (p === o || p.el.contains(o.el) || o.el.contains(p.el)) continue
      if (gap(o.r, p.r) < 8) { juntos.push(`${sel(o.el)} ↔ ${sel(p.el)}`); break }
    }
  }

  // 4. Elementos fijos
  const fijos = [...document.querySelectorAll('header, .fab')].filter(visible).map((el) => {
    const r = el.getBoundingClientRect()
    return { cual: sel(el), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
  })
  const choques: string[] = []
  for (let i = 0; i < fijos.length; i++) for (let j = i + 1; j < fijos.length; j++) {
    const a = fijos[i], b = fijos[j]
    if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) choques.push(`${a.cual} ↔ ${b.cual}`)
  }
  const altoBarraInferior = Math.max(0, ...fijos.filter((f) => f.y + f.h >= vh - 1 && f.y > vh / 2).map((f) => vh - f.y))
  const body = getComputedStyle(document.body)
  const espacioInferior = parseFloat(body.paddingBottom) + parseFloat(getComputedStyle(document.documentElement).paddingBottom)

  // 5. Hero
  const h1 = document.querySelector('h1')
  const header = document.querySelector('header')
  const hero = h1?.closest('section')
  const rh1 = h1?.getBoundingClientRect()
  const heroInfo = h1 && rh1 ? {
    h1Texto: (h1.textContent ?? '').trim().slice(0, 90),
    h1Px: parseFloat(getComputedStyle(h1).fontSize),
    h1Arriba: Math.round(rh1.top + scrollY),
    h1Abajo: Math.round(rh1.bottom + scrollY),
    h1CompletoEnPantalla: rh1.bottom + scrollY <= vh - altoBarraInferior,
    altoHero: hero ? Math.round(hero.getBoundingClientRect().height) : null,
    altoHeader: header ? Math.round(header.getBoundingClientRect().height) : null,
    primerCtaVisible: (() => {
      const cta = hero?.querySelector('a.btn, a[href*="wa.me"], a[href="/agendar"]')
      if (!cta) return null
      const r = cta.getBoundingClientRect()
      return r.bottom + scrollY <= vh - altoBarraInferior
    })(),
  } : null

  // 6. Formularios
  const campos = [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter(visible).map((el) => {
    const i = el as HTMLInputElement
    const etiqueta = (i.id && document.querySelector(`label[for="${i.id}"]`)) || i.closest('label') || i.getAttribute('aria-label')
    return {
      nombre: i.name || i.id || sel(el),
      tipo: i.type || el.tagName.toLowerCase(),
      inputmode: i.getAttribute('inputmode'),
      autocomplete: i.getAttribute('autocomplete'),
      px: parseFloat(getComputedStyle(el).fontSize),
      etiqueta: !!etiqueta,
      alto: Math.round(el.getBoundingClientRect().height),
    }
  })

  // 7. Imágenes
  const dpr = window.devicePixelRatio
  const recursos = new Map(performance.getEntriesByType('resource').map((e) => [e.name, e as PerformanceResourceTiming]))
  const imagenes = [...document.images].filter((im) => im.complete && im.naturalWidth > 0 && visible(im)).map((im) => {
    const r = im.getBoundingClientRect()
    const res = recursos.get(im.currentSrc)
    return {
      src: im.currentSrc.replace(location.origin, '').slice(0, 140),
      mostrada: `${Math.round(r.width)}x${Math.round(r.height)}`,
      natural: `${im.naturalWidth}x${im.naturalHeight}`,
      sobredimension: Number((im.naturalWidth / Math.max(1, r.width * dpr)).toFixed(1)),
      sizes: im.getAttribute('sizes'),
      kb: res ? Math.round((res.encodedBodySize || res.transferSize) / 1024) : null,
      sinDimensiones: !im.getAttribute('width') && !im.getAttribute('height') && getComputedStyle(im).aspectRatio === 'auto' && getComputedStyle(im).position !== 'absolute',
      encima: r.top + scrollY < vh,
    }
  })

  return {
    vw, vh,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHorizontal: document.documentElement.scrollWidth > vw,
    desbordes: desbordes.slice(0, 12),
    totalDesbordes: desbordes.length,
    textoChico, ejemplosTextoChico, titulosCortados, tamTitulos,
    tactilesChicos: chicos.length,
    ejemplosTactilesChicos: chicos.slice(0, 8).map((o) => `${sel(o.el)} ${Math.round(o.r.w)}x${Math.round(o.r.h)}`),
    tactilesJuntos: juntos.length,
    ejemplosJuntos: juntos.slice(0, 6),
    fijos, choques, altoBarraInferior, espacioInferior,
    hero: heroInfo,
    campos, imagenes,
    altoPagina: document.documentElement.scrollHeight,
  }
}

async function pieTapado(page: Page) {
  // ¿El último contenido del pie queda debajo de la barra fija al llegar al final?
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(300)
  return page.evaluate(() => {
    const vh = window.innerHeight
    const fabs = [...document.querySelectorAll('.fab')].map((f) => f.getBoundingClientRect()).filter((r) => r.height > 0)
    const topeBarra = Math.min(vh, ...fabs.filter((r) => r.bottom >= vh - 1).map((r) => r.top))
    const ultimos = [...document.querySelectorAll('footer a, footer p')].filter((e) => e.getBoundingClientRect().height > 0)
    const ultimo = ultimos.at(-1)
    if (!ultimo) return null
    const r = ultimo.getBoundingClientRect()
    return { ultimo: (ultimo.textContent ?? '').trim().slice(0, 40), abajo: Math.round(r.bottom), topeBarra: Math.round(topeBarra), tapado: r.bottom > topeBarra }
  })
}

async function cls(page: Page) {
  // Recorre la página para provocar cargas diferidas y suma los saltos de diseño.
  await page.evaluate(async () => {
    const paso = window.innerHeight * 0.8
    for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 300))
  })
  return page.evaluate(() => {
    const w = window as unknown as { __cls?: { valor: number; fuentes: string[] } }
    return w.__cls ?? { valor: 0, fuentes: [] }
  })
}

async function recorrer(browser: Browser, base: string, vista: (typeof VISTAS)[number]) {
  const context = await browser.newContext({
    baseURL: base,
    viewport: { width: vista.ancho, height: vista.alto },
    deviceScaleFactor: vista.movil ? 2 : 1,
    isMobile: vista.movil,
    hasTouch: vista.movil,
    userAgent: vista.movil
      ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'
      : undefined,
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
  })
  await bloquearAnalitica(context)
  await context.addInitScript(() => {
    const w = window as unknown as { __cls: { valor: number; fuentes: string[] } }
    w.__cls = { valor: 0, fuentes: [] }
    new PerformanceObserver((lista) => {
      for (const e of lista.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: { node?: Node }[] })[]) {
        if (e.hadRecentInput) continue
        w.__cls.valor += e.value
        for (const s of e.sources ?? []) {
          const n = s.node as Element | undefined
          if (n && w.__cls.fuentes.length < 5) w.__cls.fuentes.push(`${n.nodeName?.toLowerCase()}.${(typeof n.className === 'string' ? n.className : '').split(' ').slice(0, 2).join('.')}`)
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })

  const resultados = []
  for (const ruta of RUTAS) {
    const page = await context.newPage()
    const errores: string[] = []
    page.on('pageerror', (e) => errores.push(e.message.slice(0, 200)))
    page.on('console', (m) => { if (m.type() === 'error' && !ANALITICA.test(m.location().url)) errores.push(m.text().slice(0, 200)) })
    const resp = await page.goto(ruta, { waitUntil: 'load', timeout: 90_000 })
    await page.waitForTimeout(1500)

    const archivo = `${nombreArchivo(ruta)}-${vista.ancho}`
    await page.screenshot({ path: path.join(DIR_CAPTURAS, 'pantalla', `${archivo}.jpg`), type: 'jpeg', quality: 72 })
    const datos = await page.evaluate(medir)
    const saltos = await cls(page)
    const pie = vista.movil ? await pieTapado(page) : null
    await page.screenshot({ path: path.join(DIR_CAPTURAS, 'completa', `${archivo}.jpg`), fullPage: true, type: 'jpeg', quality: 60 })

    // Menú móvil y chat abiertos: solo en la home y en los anchos de celular.
    let menu = null
    let chat = null
    if (ruta === '/' && vista.movil && vista.ancho < 768) {
      await page.evaluate(() => window.scrollTo(0, 0))
      const boton = page.getByRole('button', { name: 'Abrir menú' })
      if (await boton.isVisible()) {
        await boton.click()
        await page.waitForTimeout(400)
        await page.screenshot({ path: path.join(DIR_CAPTURAS, 'pantalla', `home-menu-${vista.ancho}.jpg`), type: 'jpeg', quality: 72 })
        menu = await page.evaluate(() => {
          const m = document.querySelector('.menu-movil')
          if (!m) return null
          const r = m.getBoundingClientRect()
          const fabs = [...document.querySelectorAll('.fab')].map((f) => f.getBoundingClientRect()).filter((x) => x.height > 0)
          return {
            alto: Math.round(r.height), abajo: Math.round(r.bottom), vh: window.innerHeight,
            cabe: r.bottom <= window.innerHeight,
            tapadoPorFab: fabs.some((f) => f.top < r.bottom && f.bottom > r.top),
            bloqueaScroll: getComputedStyle(document.body).overflow === 'hidden',
          }
        })
        await page.getByRole('button', { name: 'Cerrar menú' }).click()
      }
      const fab = page.getByRole('button', { name: /Abrir chat/ })
      if (await fab.isVisible()) {
        await fab.click()
        await page.waitForTimeout(500)
        await page.screenshot({ path: path.join(DIR_CAPTURAS, 'pantalla', `home-chat-${vista.ancho}.jpg`), type: 'jpeg', quality: 72 })
        chat = await page.evaluate(() => {
          const panel = document.querySelector('[aria-label^="Chat con Teck"]')
          if (!panel) return null
          const r = panel.getBoundingClientRect()
          const wa = document.querySelector('a.fab')?.getBoundingClientRect()
          const header = document.querySelector('header')?.getBoundingClientRect()
          return {
            panel: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`,
            vw: window.innerWidth, vh: window.innerHeight,
            cabe: r.top >= 0 && r.bottom <= window.innerHeight && r.left >= 0 && r.right <= window.innerWidth,
            chocaConWhatsApp: wa ? wa.top < r.bottom && wa.bottom > r.top && wa.left < r.right && wa.right > r.left : false,
            debajoDelHeader: header ? r.top < header.bottom : false,
          }
        })
      }
    }

    resultados.push({ ruta, estado: resp?.status(), errores: errores.slice(0, 5), cls: saltos, pie, menu, chat, ...datos })
    await page.close()
  }
  await context.close()
  return resultados
}

test.describe.configure({ mode: 'serial' })

for (const vista of VISTAS) {
  test(`diagnóstico móvil ${vista.ancho}px`, async ({ browser, baseURL }) => {
    test.setTimeout(1_800_000)
    for (const d of ['pantalla', 'completa']) fs.mkdirSync(path.join(DIR_CAPTURAS, d), { recursive: true })
    fs.mkdirSync(DIR_DATOS, { recursive: true })
    const resultados = await recorrer(browser, baseURL ?? 'https://www.teckware.cl', vista)
    fs.writeFileSync(path.join(DIR_DATOS, `${vista.ancho}.json`), JSON.stringify(resultados, null, 2))
  })
}
