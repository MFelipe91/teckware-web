import Link from 'next/link'
import { NIVELES_PC, precioNivelPC } from '@/lib/constants'

// Armado de PC gamer primero: es uno de los servicios principales. Empresas, a su página.
export function Segmentos() {
  return (
    <section className="bg-ink-900 px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <div className="max-w-[76rem] mx-auto grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="panel-corte p-5 sm:p-10">
          <h2 className="text-fg">PC Gamer armado a pedido</h2>
          <p className="mt-4 max-w-xl text-fg-muted leading-relaxed">
            Lo armamos según tu presupuesto y lo que juegas, con cable management y pruebas de estrés.
            {' '}{precioNivelPC(NIVELES_PC[0].desde)}, a cotizar según el precio de los componentes.
          </p>
          <Link href="/builds" className="btn btn-terciario mt-6">Ver niveles y cotizar</Link>
        </div>
        <div className="p-5 sm:p-10 border border-white/10">
          <h2 className="text-fg text-3xl sm:text-4xl">Soporte para tu pyme</h2>
          <p className="mt-4 text-fg-muted leading-relaxed">
            Mantención de los equipos de tu oficina, asesoría y automatización, con plan por escrito y boleta.
          </p>
          <Link href="/empresas" className="btn btn-terciario mt-6">Ver soluciones para empresas</Link>
        </div>
      </div>
    </section>
  )
}
