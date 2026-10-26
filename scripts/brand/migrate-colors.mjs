// Migración única: colores hex escritos a mano → tokens de marca (app/globals.css).
// Uso: node scripts/brand/migrate-colors.mjs [--dry]
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
const DIRS = ['app', 'components']

const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = path.join(d, f)
  return statSync(p).isDirectory() ? walk(p) : /\.(tsx|ts)$/.test(f) ? [p] : []
})

// Clases Tailwind: [regex, reemplazo]. El orden importa (lo específico primero).
const H = (hex) => `\\[#${hex}\\]`
const classRules = [
  // Botones cian con texto oscuro → azul de marca con texto blanco
  [new RegExp(`text-(${H('03040A')}|${H('020307')})`, 'g'), 'text-white'],
  [new RegExp(`bg-(${H('00A8CC')}|${H('00B8D9')})`, 'g'), 'bg-brand-hover'],
  [new RegExp(`bg-${H('00D4FF')}`, 'g'), 'bg-brand'],
  [new RegExp(`(text|fill|accent|ring|border|shadow|from|via|to|placeholder)-(${H('00D4FF')}|${H('00A8CC')})`, 'g'), '$1-brand-bright'],
  // WhatsApp
  [new RegExp(`bg-${H('22C55E')}(?![/\\w])`, 'g'), 'bg-whatsapp-solid'],
  [new RegExp(`bg-${H('16A34A')}`, 'g'), 'bg-whatsapp-hover'],
  [new RegExp(`-${H('22C55E')}`, 'g'), '-whatsapp'],
  // Estados
  [new RegExp(`-${H('EF4444')}`, 'g'), '-danger'],
  // Rojo AMD y rojo YouTube: fuera de la marca
  [new RegExp(`-(${H('E61E32')}|${H('FF0000')})`, 'g'), '-brand'],
  // Morado: acento PC Gamer (texto en su variante legible)
  [new RegExp(`text-(${H('A855F7')}|${H('9333EA')})`, 'g'), 'text-gamer-bright'],
  [new RegExp(`-(${H('A855F7')}|${H('9333EA')})`, 'g'), '-gamer'],
  // Neutros
  [new RegExp(`-${H('F1F5F9')}`, 'g'), '-fg'],
  [new RegExp(`-(${H('94A3B8')}|${H('8B9DB5')}|${H('C7D2E0')})`, 'g'), '-fg-muted'],
  [new RegExp(`-(${H('475569')}|${H('64748B')}|${H('334155')})`, 'g'), '-fg-subtle'],
  [new RegExp(`-(${H('03040A')}|${H('020307')}|${H('050810')})`, 'g'), '-ink-950'],
  [new RegExp(`-${H('080B14')}`, 'g'), '-ink-900'],
  [new RegExp(`-(${H('0D1120')}|${H('0D1117')})`, 'g'), '-ink-800'],
  [new RegExp(`-${H('111827')}`, 'g'), '-ink-700'],
  // Brillos de neón cian: la marca nueva es sobria, se quitan
  [/\s?(hover:)?(drop-)?shadow-\[[^\]\s]*rgba\(0,212,255[^\]\s]*\]/g, ''],
]

// Colores en estilos en línea / strings JS.
const pct = (a) => `${Math.round(parseFloat(a) * 100)}%`
const mix = (token, a) => `color-mix(in oklab, var(--color-${token}) ${pct(a)}, transparent)`
const styleRules = [
  [/rgba\(\s*0\s*,\s*212\s*,\s*255\s*,\s*([\d.]+)\s*\)/g, (_, a) => mix('brand-bright', a)],
  [/rgba\(\s*168\s*,\s*85\s*,\s*247\s*,\s*([\d.]+)\s*\)/g, (_, a) => mix('gamer', a)],
  [/rgba\(\s*230\s*,\s*30\s*,\s*50\s*,\s*([\d.]+)\s*\)/g, (_, a) => mix('silver', a)],
  [/rgba\(\s*34\s*,\s*197\s*,\s*94\s*,\s*([\d.]+)\s*\)/g, (_, a) => mix('whatsapp', a)],
  // Firma RGB (rojo → cian → morado) → plata → azul
  [/linear-gradient\(90deg, transparent(?: 0%)?, #E61E32 \d+%, #00D4FF \d+%(?:, #A855F7 \d+%)?, transparent(?: 100%)?\)/g, 'var(--gradient-signature)'],
  [/'#00D4FF'/gi, "'var(--color-brand-bright)'"],
  [/'#A855F7'/gi, "'var(--color-gamer)'"],
  [/'#E61E32'/gi, "'var(--color-silver)'"],
  [/'#F1F5F9'/gi, "'var(--color-fg)'"],
  [/'#94A3B8'/gi, "'var(--color-fg-muted)'"],
  [/'#03040A'/gi, "'var(--color-ink-950)'"],
  [/'#080B14'/gi, "'var(--color-ink-900)'"],
  [/'#0D1120'/gi, "'var(--color-ink-800)'"],
]

// Utilidades renombradas en globals.css
const utilRules = [
  [/\bglow-cyan\b/g, 'glow-brand'],
  [/\bglow-red\b/g, 'glow-silver'],
  [/\bgradient-text-red\b/g, 'gradient-text'],
  [/\s?\bneon-text\b/g, ''],
  [/\s?\bscan-line\b/g, ''],
]

const dry = process.argv.includes('--dry')
let changed = 0
for (const file of DIRS.flatMap((d) => walk(path.join(ROOT, d)))) {
  const before = readFileSync(file, 'utf8')
  let s = before
  for (const [re, to] of [...classRules, ...styleRules, ...utilRules]) s = s.replace(re, to)
  if (s !== before) {
    changed++
    if (!dry) writeFileSync(file, s)
    console.log((dry ? '[dry] ' : '') + path.relative(ROOT, file))
  }
}
console.log(`${changed} archivos`)
