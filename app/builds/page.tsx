import type { Metadata } from 'next'
import { CotizacionForm } from '@/components/builds/CotizacionForm'
import { BandaCta } from '@/components/shared/BandaCta'
import { PageHeader } from '@/components/shared/PageHeader'
import { NIVELES_PC, NOTA_PC, PLAZO, precioNivelPC } from '@/lib/constants'
import { ogPagina } from '@/lib/seo'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'PC Gamer a Pedido',
  description:
    'PC Gamer armado a pedido en La Serena: niveles Starter, Mid y Ultra como guía, con cable management y pruebas de estrés. Cotiza según tu presupuesto y uso.',
  alternates: { canonical: '/builds' },
  openGraph: ogPagina('/builds'),
}

const PASOS = [
  { titulo: 'Nos cuentas qué necesitas', texto: 'Completas el formulario con tu presupuesto, tus juegos o programas y lo que ya tienes.' },
  { titulo: 'Te proponemos una configuración', texto: 'Revisamos compatibilidad, stock y precios del momento, y te enviamos la propuesta por WhatsApp.' },
  { titulo: 'Compramos y armamos', texto: `Con tu aprobación armamos el equipo. Una vez con los componentes, el armado estándar toma ${PLAZO}.` },
  { titulo: 'Lo probamos y lo retiras', texto: 'Hacemos pruebas de estrés y control de temperaturas. Incluye boleta y garantía de 30 días en el armado.' },
]

export default function BuildsPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <PageHeader
        titulo="PC Gamer a pedido"
        bajada="No vendemos equipos en stock: armamos cada PC según tu presupuesto y lo que vas a usar. Estos niveles son una guía para partir."
      >
        <a href="#cotizar" className="btn btn-primario w-full sm:w-auto">Cotizar mi PC</a>
      </PageHeader>

      <section aria-labelledby="niveles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 id="niveles" className="text-fg mb-8">Niveles de referencia</h2>
        <ul className="border-t border-white/10">
          {NIVELES_PC.map((n) => (
            <li key={n.id} className="py-6 border-b border-white/10 grid gap-x-10 gap-y-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,6fr)_auto] lg:items-baseline">
              <div>
                <h3 className="text-3xl text-fg">{n.nombre}</h3>
                <p className="mt-1 text-fg-muted">{n.para}</p>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-fg-muted">
                {n.referencia.map((r) => (
                  <li key={r} className="flex items-baseline gap-2">
                    <span className="hex" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
              <span className="price text-2xl text-fg lg:text-right whitespace-nowrap">{precioNivelPC(n.desde)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-fg-muted leading-relaxed">{NOTA_PC}</p>
      </section>

      <section id="cotizar" aria-labelledby="titulo-cotizar" className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-mt-16">
        <div className="max-w-[76rem] mx-auto grid gap-10 lg:gap-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="titulo-cotizar" className="text-fg">Cotiza tu PC</h2>
            <p className="mt-4 text-fg-muted leading-relaxed">
              Con estos datos te proponemos una configuración real, con precios del momento.
            </p>
          </div>
          <CotizacionForm />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-fg mb-10">Cómo se arma</h2>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="pt-4 border-t-2 border-brand-bright">
              <span className="price text-sm text-brand-bright">Paso {i + 1}</span>
              <h3 className="mt-2 text-fg">{p.titulo}</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <BandaCta
        titulo="¿Prefieres conversarlo?"
        texto="Escríbenos por WhatsApp con tu presupuesto y lo que quieres jugar o hacer."
        waHref={WA.servicio('PC Gamer a pedido')}
      />
    </div>
  )
}
