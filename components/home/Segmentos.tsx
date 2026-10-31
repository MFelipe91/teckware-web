import Link from 'next/link'

// Los dos públicos además del cliente particular: pymes y gamers. Cada uno a su página.
export function Segmentos() {
  return (
    <section className="bg-ink-900 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-[76rem] mx-auto grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="panel-corte p-7 sm:p-10">
          <h2 className="text-fg">Soporte informático para tu pyme</h2>
          <p className="mt-4 max-w-xl text-fg-muted leading-relaxed">
            Mantención preventiva de los equipos de tu oficina, asesoría, automatización con IA,
            desarrollo web y ciberseguridad. Plan por escrito y boleta.
          </p>
          <Link href="/empresas" className="btn btn-terciario mt-6">Ver soluciones para empresas</Link>
        </div>
        <div className="p-7 sm:p-10 border border-white/10">
          <h2 className="text-fg text-3xl sm:text-4xl">PC Gamer a pedido</h2>
          <p className="mt-4 text-fg-muted leading-relaxed">
            Armamos tu equipo según tu presupuesto y lo que juegas, con cable management y pruebas de estrés.
          </p>
          <Link href="/builds" className="btn btn-terciario mt-6">Ver niveles y cotizar</Link>
        </div>
      </div>
    </section>
  )
}
