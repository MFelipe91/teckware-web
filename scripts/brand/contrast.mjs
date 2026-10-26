// Verifica el contraste WCAG de los pares de tokens de app/globals.css.
// Uso: node scripts/brand/contrast.mjs  (sale con código 1 si algún par no cumple)
import { readFileSync } from 'node:fs'
import path from 'node:path'

const css = readFileSync(path.resolve(import.meta.dirname, '../../app/globals.css'), 'utf8')
const token = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`))
  if (!m) throw new Error(`Falta el token --color-${name}`)
  return m[1]
}

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [texto, fondo, mínimo]: 4.5 texto normal, 3 texto grande o componentes de UI.
const pairs = [
  ...['ink-950', 'ink-900', 'ink-800', 'ink-700'].flatMap((bg) => [
    ['fg', bg, 4.5], ['fg-muted', bg, 4.5], ['fg-subtle', bg, 4.5],
    ['brand-bright', bg, 4.5], ['silver', bg, 4.5], ['gamer-bright', bg, 4.5],
    ['whatsapp', bg, 4.5], ['danger', bg, 4.5],
  ]),
  ['white', 'brand', 4.5], ['white', 'brand-hover', 4.5], ['white', 'whatsapp-solid', 4.5],
  ['brand', 'ink-900', 3],
]

const tokens = (n) => (n === 'white' ? '#FFFFFF' : token(n))
let fail = 0
for (const [fg, bg, min] of pairs) {
  const r = ratio(tokens(fg), tokens(bg))
  const ok = r >= min
  if (!ok) fail++
  console.log(`${ok ? 'ok ' : 'NO '} ${fg.padEnd(14)} sobre ${bg.padEnd(14)} ${r.toFixed(2)} (mín ${min})`)
}
process.exit(fail ? 1 : 0)
