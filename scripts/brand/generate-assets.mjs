// Genera los recursos de marca a partir de public/images/logo-principal-2026.png y del
// isotipo plano public/brand/isotipo-app.svg.
// Uso: node scripts/brand/generate-assets.mjs [--sample]
import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
const SRC = path.join(ROOT, 'public/images/logo-principal-2026.png')
const ISO = path.join(ROOT, 'public/brand/isotipo-app.svg')
const OUT = path.join(ROOT, 'public/brand')
// El master transparente pesa ~1 MB: queda fuera de public/ para no publicarlo.
const MASTER = path.join(ROOT, 'design/brand/logo-2026-transparent.png')

const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()

async function load() {
  const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, w: info.width, h: info.height }
}

function patchMean({ data, w }, x, y, r = 6) {
  const acc = [0, 0, 0]
  let n = 0
  for (let j = y - r; j <= y + r; j++)
    for (let i = x - r; i <= x + r; i++) {
      const k = (j * w + i) * 3
      acc[0] += data[k]; acc[1] += data[k + 1]; acc[2] += data[k + 2]; n++
    }
  return acc.map((v) => v / n)
}

// Color de fondo: mediana de las cuatro esquinas.
function background(img) {
  const s = 40
  const pts = [[s, s], [img.w - s, s], [s, img.h - s], [img.w - s, img.h - s]]
  const samples = pts.map(([x, y]) => patchMean(img, x, y, 20))
  return [0, 1, 2].map((c) => samples.map((p) => p[c]).sort((a, b) => a - b)[1])
}

// El fondo del PNG tiene viñeta y grano: se estima un campo de fondo suave tomando, por
// bloques, la mediana (tope: navy de las esquinas + 14, para que el logo no se cuele como
// fondo) e interpolando. Solo cuenta lo más claro que el fondo, así que las sombras internas
// quedan transparentes: el resultado es para fondos oscuros.
function backgroundField(img, block = 64) {
  const cap = background(img).map((v) => v + 14)
  const bw = Math.ceil(img.w / block), bh = Math.ceil(img.h / block)
  const grid = []
  for (let by = 0; by < bh; by++)
    for (let bx = 0; bx < bw; bx++) {
      const px = []
      for (let y = by * block; y < Math.min(img.h, (by + 1) * block); y++)
        for (let x = bx * block; x < Math.min(img.w, (bx + 1) * block); x++) {
          const k = (y * img.w + x) * 3
          px.push([img.data[k], img.data[k + 1], img.data[k + 2]])
        }
      px.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]))
      grid.push(px[Math.floor(px.length * 0.5)].map((v, c) => Math.min(v, cap[c])))
    }
  const at = (x, y) => {
    const gx = Math.min(bw - 1, Math.max(0, x / block - 0.5)), gy = Math.min(bh - 1, Math.max(0, y / block - 0.5))
    const x0 = Math.floor(gx), y0 = Math.floor(gy), x1 = Math.min(bw - 1, x0 + 1), y1 = Math.min(bh - 1, y0 + 1)
    const fx = gx - x0, fy = gy - y0
    const g = (i, j) => grid[j * bw + i]
    return [0, 1, 2].map((c) =>
      (g(x0, y0)[c] * (1 - fx) + g(x1, y0)[c] * fx) * (1 - fy) + (g(x0, y1)[c] * (1 - fx) + g(x1, y1)[c] * fx) * fy)
  }
  return at
}

// "Color a alfa": separa cada píxel en fondo + primer plano con el alfa mínimo. El rango
// [lo, hi] descarta el grano del fondo y suaviza el borde del brillo.
function colorToAlpha(img, bgAt, lo = 0.07, hi = 0.85) {
  const out = Buffer.alloc(img.w * img.h * 4)
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const p = y * img.w + x
      const bg = bgAt(x, y)
      const c = [img.data[p * 3], img.data[p * 3 + 1], img.data[p * 3 + 2]]
      let raw = 0
      for (let k = 0; k < 3; k++) {
        const d = c[k] - bg[k]
        const t = d > 0 ? d / (255 - bg[k]) : 0
        if (t > raw) raw = t
      }
      const a = Math.min(1, Math.max(0, (raw - lo) / (hi - lo)))
      for (let k = 0; k < 3; k++)
        out[p * 4 + k] = a > 0 ? Math.min(255, Math.max(0, bg[k] + (c[k] - bg[k]) / Math.max(a, raw))) : 0
      out[p * 4 + 3] = Math.round(a * 255)
    }
  return out
}

async function sample(img) {
  const bg = background(img)
  const spots = {
    'navy fondo': bg,
    'T plata': patchMean(img, 470, 380),
    'T plata (luz)': patchMean(img, 330, 360),
    'W azul': patchMean(img, 700, 600),
    'W azul brillante': patchMean(img, 760, 470, 3),
    'hexágono azul': patchMean(img, 940, 640),
    'wordmark WARE': patchMean(img, 1100, 1030, 3),
    'wordmark TECK': patchMean(img, 230, 1030, 3),
  }
  for (const [k, v] of Object.entries(spots)) console.log(k.padEnd(18), hex(v))
}

async function main() {
  const img = await load()
  if (process.argv.includes('--sample')) return sample(img)

  await mkdir(OUT, { recursive: true })
  const rgba = colorToAlpha(img, backgroundField(img))
  // Mediana 3×3 sobre el alfa para quitar puntos sueltos de grano.
  const alpha = await sharp(rgba, { raw: { width: img.w, height: img.h, channels: 4 } })
    .extractChannel(3).median(3).raw().toBuffer()
  for (let p = 0; p < img.w * img.h; p++) rgba[p * 4 + 3] = alpha[p]
  const png = await sharp(rgba, { raw: { width: img.w, height: img.h, channels: 4 } }).png().toBuffer()
  // Recorta al contenido visible.
  const master = await sharp(png).trim({ threshold: 10 }).png({ compressionLevel: 9 }).toBuffer()
  await mkdir(path.dirname(MASTER), { recursive: true })
  await writeFile(MASTER, master)
  console.log('→ design/brand/logo-2026-transparent.png')

  await derivatives(master)
  await icons()
  await ogImage(master)
}

// Franjas del logo recortado (en px del master): emblema, wordmark "TECKWARE" y subtítulo.
const BANDS = { emblem: [0, 840], wordmark: [895, 995] }

async function band(master, [top, bottom]) {
  const { width } = await sharp(master).metadata()
  return sharp(master).extract({ left: 0, top, width, height: bottom - top }).trim({ threshold: 10 }).png().toBuffer()
}

async function derivatives(master) {
  const emblem = await band(master, BANDS.emblem)
  const wordmark = await band(master, BANDS.wordmark)

  // Navbar: emblema + wordmark en una línea, 80 px de alto (40 px CSS @2x).
  const H = 80, GAP = 18
  const e = await sharp(emblem).resize({ height: H }).toBuffer()
  const w = await sharp(wordmark).resize({ height: 30 }).toBuffer()
  const [em, wm] = await Promise.all([sharp(e).metadata(), sharp(w).metadata()])
  await sharp({ create: { width: em.width + GAP + wm.width, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: e, left: 0, top: 0 }, { input: w, left: em.width + GAP, top: Math.round((H - wm.height) / 2) }])
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(path.join(OUT, 'logo-horizontal.webp'))

  // Hero: emblema solo, 560 px (unos 280–360 px CSS en escritorio).
  await sharp(emblem).resize({ width: 560 }).webp({ quality: 80, alphaQuality: 90 }).toFile(path.join(OUT, 'emblem.webp'))

  // Footer y usos grandes: logo completo a 480 px de ancho (240 px CSS @2x).
  await sharp(master).resize({ width: 480 }).webp({ quality: 80, alphaQuality: 90 }).toFile(path.join(OUT, 'logo-stack.webp'))
  console.log('→ public/brand/logo-horizontal.webp, logo-stack.webp')
}

// Variantes del isotipo: `radius` es el redondeo del fondo navy y `scale` el tamaño del
// emblema dentro del cuadro (los íconos "maskable" necesitan margen de seguridad).
async function isoPng(size, { radius = 14, scale = 0.84 } = {}) {
  const svg = (await readFile(ISO, 'utf8'))
    .replace('rx="14"', `rx="${radius}"`)
    .replace('scale(.84)', `scale(${scale})`)
  return sharp(Buffer.from(svg), { density: Math.ceil((72 * size) / 64) * 2 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
}

// .ico con PNG embebidos (formato válido desde Windows Vista y en todos los navegadores).
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length)
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4)
  let offset = header.length
  pngs.forEach(({ size, buf }, i) => {
    const e = 6 + 16 * i
    header.writeUInt8(size >= 256 ? 0 : size, e); header.writeUInt8(size >= 256 ? 0 : size, e + 1)
    header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6)
    header.writeUInt32LE(buf.length, e + 8); header.writeUInt32LE(offset, e + 12)
    offset += buf.length
  })
  return Buffer.concat([header, ...pngs.map((p) => p.buf)])
}

async function icons() {
  const app = path.join(ROOT, 'app')
  const fav = await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await isoPng(size) })))
  await writeFile(path.join(app, 'favicon.ico'), ico(fav))
  await writeFile(path.join(app, 'icon.svg'), await readFile(ISO))
  // iOS recorta las esquinas solo: fondo a sangre.
  await writeFile(path.join(app, 'apple-icon.png'), await isoPng(180, { radius: 0, scale: 0.78 }))
  await writeFile(path.join(ROOT, 'public/icon-192.png'), await isoPng(192, { radius: 0 }))
  await writeFile(path.join(ROOT, 'public/icon-512.png'), await isoPng(512, { radius: 0 }))
  await writeFile(path.join(ROOT, 'public/icon-maskable-512.png'), await isoPng(512, { radius: 0, scale: 0.66 }))
  console.log('→ app/favicon.ico, app/icon.svg, app/apple-icon.png, public/icon-*.png')
}

// Imagen para compartir (WhatsApp, redes): 1200×630.
async function ogImage(master) {
  const W = 1200, H = 630
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="g" cx="0.82" cy="0" r="0.9">
        <stop offset="0" stop-color="#0B6BCB" stop-opacity=".35"/>
        <stop offset="1" stop-color="#0B6BCB" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="s" x1="0" x2="1">
        <stop offset="0" stop-color="#CCCFD5" stop-opacity="0"/>
        <stop offset=".35" stop-color="#CCCFD5"/>
        <stop offset=".75" stop-color="#0B6BCB"/>
        <stop offset="1" stop-color="#0B6BCB" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="#060B19"/>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <g font-family="Segoe UI, Helvetica, Arial, sans-serif">
      <text x="520" y="250" font-size="54" font-weight="700" fill="#F1F5F9">Mantención y</text>
      <text x="520" y="315" font-size="54" font-weight="700" fill="#F1F5F9">servicio técnico</text>
      <text x="520" y="385" font-size="34" font-weight="600" fill="#3D9BFF">La Serena y Coquimbo</text>
      <text x="520" y="445" font-size="24" fill="#A3AEC2">A domicilio · Garantía 30 días · Boleta</text>
    </g>
    <rect x="520" y="482" width="560" height="2" fill="url(#s)"/>
  </svg>`)
  const logo = await sharp(master).resize({ height: 420 }).toBuffer()
  await sharp(bg)
    .composite([{ input: logo, left: 70, top: Math.round((H - 420) / 2) }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(path.join(ROOT, 'public/og-image.png'))
  console.log('→ public/og-image.png')
}

main()
