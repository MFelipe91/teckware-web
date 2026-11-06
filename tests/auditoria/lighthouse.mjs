// Punto 6: Lighthouse móvil, 3 corridas por página y mediana. Bloquea la analítica para no sumar
// visitas falsas a GA4/Vercel; el peso de gtag.js se mide aparte, porque Lighthouse no lo verá.
// Uso: node tests/auditoria/lighthouse.mjs   (AUDIT_BASE_URL, AUDIT_ETAPA opcionales)
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { chromium } from '@playwright/test'

const BASE = (process.env.AUDIT_BASE_URL ?? 'https://www.teckware.cl').replace(/\/$/, '')
const ETAPA = process.env.AUDIT_ETAPA === 'despues' ? 'despues' : 'antes'
const PAGINAS = process.env.AUDIT_PAGINAS?.split(',') ?? ['/', '/mantencion', '/agendar', '/builds', '/mantencion-pc-gamer']
const CORRIDAS = 3
const BLOQUEADAS = ['*googletagmanager.com*', '*google-analytics.com*', '*analytics.google.com*', '*/_vercel/*', '*vercel-insights.com*']

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lh-'))
const mediana = (v) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)]

function correr(ruta, n) {
  const salida = path.join(tmp, `${ruta.replace(/\W/g, '_')}-${n}.json`)
  const args = [
    '--yes', 'lighthouse@13', `${BASE}${ruta}`,
    '--quiet', '--output=json', `--output-path=${salida}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    ...BLOQUEADAS.map((b) => `--blocked-url-patterns=${b}`),
  ]
  // En Windows, Lighthouse suele terminar con EPERM al borrar su carpeta temporal: lo que vale es el JSON.
  const r = spawnSync('npx', args, {
    shell: true,
    encoding: 'utf8',
    timeout: 240_000,
    env: { ...process.env, CHROME_PATH: chromium.executablePath() },
  })
  if (!fs.existsSync(salida)) throw new Error(`Lighthouse sin resultado en ${ruta}: ${(r.stderr ?? '').slice(-400)}`)
  const lhr = JSON.parse(fs.readFileSync(salida, 'utf8'))
  const peticiones = lhr.audits['network-requests']?.details?.items ?? []
  const fugas = peticiones.filter((i) => /googletagmanager|google-analytics|\/_vercel\//.test(i.url) && i.statusCode > 0)
  const js = peticiones.filter((i) => i.resourceType === 'Script')
  return {
    rendimiento: Math.round(lhr.categories.performance.score * 100),
    accesibilidad: Math.round(lhr.categories.accessibility.score * 100),
    buenasPracticas: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    lcpMs: Math.round(lhr.audits['largest-contentful-paint'].numericValue),
    cls: Number(lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3)),
    tbtMs: Math.round(lhr.audits['total-blocking-time'].numericValue),
    fcpMs: Math.round(lhr.audits['first-contentful-paint'].numericValue),
    jsKbGzip: Math.round(js.reduce((s, i) => s + (i.transferSize ?? 0), 0) / 1024),
    pesoTotalKb: Math.round(lhr.audits['total-byte-weight'].numericValue / 1024),
    fugasAnalitica: fugas.length,
  }
}

const resultados = []
for (const ruta of PAGINAS) {
  const corridas = []
  for (let n = 0; n < CORRIDAS; n++) {
    corridas.push(correr(ruta, n))
    console.log(ruta, n + 1, JSON.stringify(corridas.at(-1)))
  }
  const med = Object.fromEntries(Object.keys(corridas[0]).map((k) => [k, mediana(corridas.map((c) => c[k]))]))
  resultados.push({ ruta, mediana: med, corridas })
}

// gtag.js se descarga sin ejecutarlo: bajar el archivo no registra ninguna visita en GA4.
const gtag = await fetch('https://www.googletagmanager.com/gtag/js?id=G-SY6YXTBH09')
const gtagBytes = Buffer.from(await gtag.arrayBuffer())
const salida = {
  base: BASE,
  fecha: new Date().toISOString(),
  paginas: resultados,
  gtagKbGzipAprox: Math.round(zlib.gzipSync(gtagBytes).length / 1024),
}
const dir = process.env.AUDIT_DIR_DATOS ?? path.join(process.cwd(), 'docs', 'auditoria', 'datos', ETAPA)
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(path.join(dir, 'lighthouse.json'), JSON.stringify(salida, null, 2))
console.log('gtag KB gzip aprox:', salida.gtagKbGzipAprox)
fs.rmSync(tmp, { recursive: true, force: true })
