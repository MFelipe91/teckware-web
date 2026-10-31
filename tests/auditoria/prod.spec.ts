import fs from 'node:fs'
import path from 'node:path'
import { test, type APIRequestContext, type Browser } from '@playwright/test'
import { ANALITICA, DIR_CAPTURAS, bloquearAnalitica, contrasteSinResolver, guardar, revisarAxe } from './comun'

// SOLO LECTURA: abre páginas, mide y lee atributos. No hace clic, no envía formularios, no abre
// el chat y no visita /admin.

const AGENTE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'
const RUTA_404 = '/pagina-inexistente-auditoria'
const EXTRA = ['/solicitar', '/privacidad', '/terminos', RUTA_404]
const CAPTURAS = new Set([
  '/', '/mantencion', '/servicios', '/empresas', '/builds', '/blog', '/contacto', '/nosotros',
  '/agendar', '/solicitar', '/mantencion-pc-gamer', RUTA_404,
])
const VISTAS = [
  { nombre: 'movil-375', width: 375, height: 812, isMobile: true },
  { nombre: 'escritorio-1440', width: 1440, height: 900, isMobile: false },
]

type Enlace = { href: string; destino: string; texto: string; rel: string }

async function rutasDelSitemap(request: APIRequestContext, base: string) {
  const xml = await (await request.get(`${base}/sitemap.xml`)).text()
  const rutas = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  return [...new Set(rutas)]
}

/** Páginas que existen en app/ y deberían estar en el sitemap (se excluyen las dinámicas). */
function rutasEnDisco(dir = 'app', prefijo = ''): string[] {
  const salida: string[] = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && !e.name.startsWith('[') && e.name !== 'api') {
      salida.push(...rutasEnDisco(path.join(dir, e.name), `${prefijo}/${e.name}`))
    }
    if (e.isFile() && e.name === 'page.tsx') salida.push(prefijo || '/')
  }
  return salida
}

function archivosPesados(dir: string, limite: number): { archivo: string; kb: number }[] {
  const salida: { archivo: string; kb: number }[] = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, e.name)
    if (e.isDirectory()) salida.push(...archivosPesados(ruta, limite))
    else if (fs.statSync(ruta).size > limite) {
      salida.push({ archivo: ruta.replaceAll('\\', '/'), kb: Math.round(fs.statSync(ruta).size / 1024) })
    }
  }
  return salida
}

async function recorrer(browser: Browser, base: string, rutas: string[], vista: (typeof VISTAS)[number]) {
  const context = await browser.newContext({
    baseURL: base,
    viewport: { width: vista.width, height: vista.height },
    isMobile: vista.isMobile,
    hasTouch: vista.isMobile,
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
  })
  await bloquearAnalitica(context)
  const resultados = []

  for (const ruta of rutas) {
    const page = await context.newPage()
    const consola: string[] = []
    const fallidas: string[] = []
    const imagenes: { url: string; estado: number; kb: number; tipo: string }[] = []
    const lecturas: Promise<void>[] = []

    page.on('console', (m) => {
      if (m.type() === 'error' && !ANALITICA.test(m.location().url)) consola.push(m.text().slice(0, 300))
    })
    page.on('pageerror', (e) => consola.push(`pageerror: ${e.message.slice(0, 300)}`))
    page.on('requestfailed', (r) => {
      if (!ANALITICA.test(r.url())) fallidas.push(`${r.url().slice(0, 200)} (${r.failure()?.errorText})`)
    })
    page.on('response', (r) => {
      if (r.status() >= 400 && !ANALITICA.test(r.url()) && new URL(r.url()).pathname !== ruta) {
        fallidas.push(`${r.status()} ${r.url().slice(0, 200)}`)
      }
      if (r.request().resourceType() === 'image') {
        lecturas.push(
          r.body()
            .then((b) => {
              imagenes.push({
                url: r.url().replace(base, '').slice(0, 200),
                estado: r.status(),
                kb: Math.round(b.length / 1024),
                tipo: r.headers()['content-type'] ?? '',
              })
            })
            .catch(() => {}),
        )
      }
    })

    const respuesta = await page.goto(ruta, { waitUntil: 'load', timeout: 60_000 })
    await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})

    // Recorre la página para que carguen las imágenes diferidas.
    await page.evaluate(async () => {
      const paso = window.innerHeight
      for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 120))
      }
      // Espera a que terminen de cargar y decodificarse: si no, la captura sale sin esas imágenes.
      await Promise.all(
        [...document.images].map((i) => {
          i.loading = 'eager'
          return i.decode().catch(() => {})
        }),
      )
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {})
    await Promise.all(lecturas)

    const datos = await page.evaluate(() => {
      const ancho = document.documentElement.clientWidth
      const meta = (sel: string) => document.querySelector(sel)?.getAttribute('content') ?? null
      const desbordan = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.right > ancho + 1 && getComputedStyle(el).position !== 'fixed'
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') ?? '').slice(0, 60)}`)
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: ancho,
        desbordan,
        imagenesRotas: [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
        sinAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
        lang: document.documentElement.lang,
        seo: {
          title: document.title,
          description: meta('meta[name="description"]'),
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
          robots: meta('meta[name="robots"]'),
          ogTitle: meta('meta[property="og:title"]'),
          ogDescription: meta('meta[property="og:description"]'),
          ogImage: meta('meta[property="og:image"]'),
          ogUrl: meta('meta[property="og:url"]'),
          h1: [...document.querySelectorAll('h1')].map((h) => (h.textContent ?? '').trim().slice(0, 160)),
        },
        jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
          try {
            const j = JSON.parse(s.textContent ?? '{}') as { '@type'?: unknown }
            return String(j['@type'] ?? '?')
          } catch {
            return 'JSON inválido'
          }
        }),
        enlaces: [...document.querySelectorAll('a')].map((a) => ({
          href: a.getAttribute('href') ?? '',
          destino: a.href,
          texto: (a.getAttribute('aria-label') ?? a.textContent ?? '').trim().slice(0, 60),
          rel: a.target === '_blank' ? a.rel : 'no-aplica',
        })),
        domicilioVisible: /Col[oó]n\s*352/i.test(document.documentElement.outerHTML),
      }
    })

    const axe = await revisarAxe(page)
    const contrasteDudoso = await contrasteSinResolver(page)

    if (CAPTURAS.has(ruta)) {
      const dir = path.join(DIR_CAPTURAS, vista.nombre)
      fs.mkdirSync(dir, { recursive: true })
      const nombre = ruta === '/' ? 'home' : ruta === RUTA_404 ? '404' : ruta.slice(1).replaceAll('/', '-')
      await page.screenshot({ path: path.join(dir, `${nombre}.jpg`), fullPage: true, type: 'jpeg', quality: 62 })
    }

    resultados.push({ ruta, vista: vista.nombre, estado: respuesta?.status() ?? 0, consola, fallidas, imagenes, axe, contrasteDudoso, ...datos })
    await page.close()
  }
  await context.close()
  return resultados
}

test('recorrido completo en solo lectura', async ({ browser, request, baseURL }) => {
  test.setTimeout(45 * 60_000)
  const base = (baseURL ?? '').replace(/\/$/, '')

  const delSitemap = await rutasDelSitemap(request, base)
  const rutas = [...new Set([...delSitemap, ...EXTRA])].filter((r) => r !== '/admin')

  const paginas = []
  for (const vista of VISTAS) paginas.push(...(await recorrer(browser, base, rutas, vista)))
  guardar('paginas', paginas)

  // Punto 1: enlaces, una sola vez cada uno.
  const origenes = new Map<string, { enlace: Enlace; paginas: Set<string> }>()
  for (const p of paginas) {
    for (const e of p.enlaces) {
      const clave = e.destino.startsWith('https://wa.me/') ? e.destino.split('?')[0] : e.destino.split('#')[0]
      const actual = origenes.get(clave) ?? { enlace: e, paginas: new Set<string>() }
      actual.paginas.add(p.ruta)
      origenes.set(clave, actual)
    }
  }

  const enlaces = []
  for (const [destino, { enlace, paginas: desde }] of origenes) {
    const fila = {
      destino,
      texto: enlace.texto,
      desde: [...desde].slice(0, 4),
      totalPaginas: desde.size,
      tipo: 'externo',
      estado: 0,
      redirige: '',
      error: '',
    }
    if (/^(tel|mailto):/.test(destino)) {
      enlaces.push({ ...fila, tipo: destino.split(':')[0] })
      continue
    }
    const interno = destino.startsWith(base)
    fila.tipo = interno ? 'interno' : 'externo'
    if (destino === `${base}/admin`) {
      enlaces.push({ ...fila, error: 'no se visita en producción' })
      continue
    }
    try {
      const r = await request.get(destino, { maxRedirects: 0, timeout: 25_000, headers: { 'User-Agent': AGENTE } })
      fila.estado = r.status()
      fila.redirige = r.headers().location ?? ''
    } catch (e) {
      fila.error = e instanceof Error ? e.message.split('\n')[0].slice(0, 160) : 'error'
    }
    enlaces.push(fila)
  }
  guardar('enlaces', enlaces)

  // Punto 7: imagen de Open Graph e infraestructura de rastreo.
  const ogImagenes = [...new Set(paginas.map((p) => p.seo.ogImage).filter((u): u is string => !!u))]
  const og = []
  for (const url of ogImagenes) {
    const r = await request.get(url).catch(() => null)
    og.push({ url, estado: r?.status() ?? 0, kb: r ? Math.round((await r.body()).length / 1024) : 0, tipo: r?.headers()['content-type'] ?? '' })
  }
  const robots = await (await request.get(`${base}/robots.txt`)).text()
  const apex = await request.get('https://teckware.cl/', { maxRedirects: 0 }).catch(() => null)
  const enDisco = rutasEnDisco().filter((r) => r !== '/admin')
  guardar('rastreo', {
    og,
    robots,
    apex: apex ? { estado: apex.status(), destino: apex.headers().location } : null,
    rutasEnSitemap: delSitemap,
    enDiscoSinSitemap: enDisco.filter((r) => !delSitemap.includes(r)),
    sitemapSinDisco: delSitemap.filter((r) => !r.startsWith('/blog/') && !enDisco.includes(r)),
  })

  // Punto 8: originales pesados en public/ (más de 200 KB).
  guardar('public-pesados', archivosPesados('public', 200 * 1024))
})
