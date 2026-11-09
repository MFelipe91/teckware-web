// Verifica las metas del Bloque 2 (docs/superpowers/specs/2026-11-06-movil-design.md) sobre los
// datos de la auditoría móvil. Sale con código 1 si alguna no se cumple.
// Uso: node tests/auditoria/criterios-movil.mjs [antes|despues]
import fs from 'node:fs'
import path from 'node:path'

const ETAPA = ['antes', 'rediseno'].includes(process.argv[2]) ? process.argv[2] : 'despues'
const DIR = path.join(process.cwd(), 'docs', 'movil', 'datos', ETAPA)
const ANCHOS = [360, 375, 390, 412, 768, 1440]
const CELULAR = (w) => w <= 412
// Rediseño Gaming Premium (2026-11): las fotos ocupan espacio, la portada puede llegar a 9.
const LARGO_MAX = { '/': ETAPA === 'rediseno' ? 9 : 8, '/servicios': 10 }

const fallas = []
const falla = (criterio, ruta, ancho, detalle) => fallas.push(`${criterio.padEnd(20)} ${String(ancho).padEnd(5)} ${ruta}  ${detalle}`)

for (const ancho of ANCHOS) {
  const paginas = JSON.parse(fs.readFileSync(path.join(DIR, `${ancho}.json`), 'utf8'))
  for (const p of paginas) {
    if (p.scrollHorizontal) falla('sinScrollHorizontal', p.ruta, ancho, `scrollWidth ${p.scrollWidth}`)
    if (p.cls.valor >= 0.1) falla('cls', p.ruta, ancho, p.cls.valor.toFixed(3))
    if (p.hero && !p.hero.h1CompletoEnPantalla) falla('h1', p.ruta, ancho, `H1 termina en ${p.hero.h1Abajo}px`)
    if (!CELULAR(ancho)) continue

    const chicos = Object.entries(p.textoChico).filter(([px]) => parseFloat(px) < 16)
    if (chicos.length) falla('textoMinimo', p.ruta, ancho, chicos.map(([px, n]) => `${n}×${px}`).join(' ') + ` · ${p.ejemplosTextoChico[0] ?? ''}`)
    if (p.tactilesChicos) falla('tactiles', p.ruta, ancho, `${p.tactilesChicos} bajo 44px · ${p.ejemplosTactilesChicos[0] ?? ''}`)
    if (p.tactilesJuntos) falla('tactilesJuntos', p.ruta, ancho, `${p.tactilesJuntos} a menos de 8px · ${p.ejemplosJuntos[0] ?? ''}`)
    if (ancho === 360 && LARGO_MAX[p.ruta]) {
      const pantallas = p.altoPagina / p.vh
      if (pantallas > LARGO_MAX[p.ruta]) falla('largo', p.ruta, ancho, `${pantallas.toFixed(1)} pantallas (máx. ${LARGO_MAX[p.ruta]})`)
    }
  }
}

const porCriterio = Object.groupBy(fallas, (f) => f.split(' ')[0])
for (const [criterio, lista] of Object.entries(porCriterio)) {
  console.log(`\n✗ ${criterio}: ${lista.length}`)
  for (const l of lista.slice(0, 6)) console.log('  ' + l)
  if (lista.length > 6) console.log(`  … y ${lista.length - 6} más`)
}
console.log(fallas.length ? `\nFALLA: ${fallas.length} incumplimientos (${ETAPA})` : `\nPASA: todos los criterios móviles (${ETAPA})`)
process.exit(fallas.length ? 1 : 0)
