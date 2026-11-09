import type { Metadata } from 'next'
import Image from 'next/image'
import { Cpu, ClipboardList, PackageCheck, Gauge, MessageCircle } from 'lucide-react'
import { CotizacionForm } from '@/components/builds/CotizacionForm'
import { BandaCta } from '@/components/shared/BandaCta'
import { HeroInterior } from '@/components/shared/HeroInterior'
import { NIVELES_PC, NOTA_PC, PLAZO, precioNivelPC, precioServicio } from '@/lib/constants'
import { STOCK } from '@/lib/fotos'
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
  { icon: ClipboardList, titulo: 'Nos cuentas qué necesitas', texto: 'Completas el formulario con tu presupuesto, tus juegos o programas y lo que ya tienes.' },
  { icon: Cpu, titulo: 'Te proponemos una configuración', texto: 'Revisamos compatibilidad, stock y precios del momento, y te enviamos la propuesta por WhatsApp.' },
  { icon: PackageCheck, titulo: 'Compramos y armamos', texto: `Con tu aprobación armamos el equipo. Una vez con los componentes, el armado estándar toma ${PLAZO}.` },
  { icon: Gauge, titulo: 'Lo probamos y lo retiras', texto: 'Pruebas de estrés y control de temperaturas. Con boleta y garantía de 30 días en el armado.' },
]

// Foto por nivel: la de mayor gama, más iluminación.
const FOTO_NIVEL = { starter: STOCK.pcGamer, mid: STOCK.armado, ultra: STOCK.hero } as const

export default function BuildsPage() {
  return (
    <div className="min-h-svh bg-ink-900">
      <HeroInterior
        antetitulo="PC Gamer a pedido"
        titulo={<>Tu PC gamer, <span className="acento">armado a tu medida</span></>}
        bajada="No vendemos equipos en stock: armamos cada PC según tu presupuesto y lo que vas a jugar o hacer. Cable management, pruebas de estrés y garantía."
        foto={STOCK.armado}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#cotizar" className="btn btn-cian w-full sm:w-auto">Cotizar mi PC</a>
          <a href={WA.servicio('PC Gamer a pedido')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto max-sm:hidden">
            <MessageCircle size={18} aria-hidden="true" />
            Escríbenos por WhatsApp
          </a>
        </div>
      </HeroInterior>

      <section aria-labelledby="niveles" className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-[76rem] mx-auto">
          <div className="text-center">
            <p className="antetitulo">Niveles de referencia</p>
            <h2 id="niveles" className="mt-3 text-fg">Elige tu punto de <span className="acento">partida</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-fg-muted">
              Son una guía: ajustamos cada componente a tu presupuesto. Si ya tienes piezas, cobramos solo el armado ({precioServicio('armado-estandar')}).
            </p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {NIVELES_PC.map((n, i) => (
              <li key={n.id} className={`tarjeta flex flex-col ${i === 1 ? 'border-brand-bright/50' : ''}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={FOTO_NIVEL[n.id as keyof typeof FOTO_NIVEL].src} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 to-transparent" aria-hidden="true" />
                  {i === 1 && <span className="absolute left-4 top-4 rounded-full bg-cian px-3 py-1 font-display text-sm font-bold text-ink-950">Recomendado</span>}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-3xl text-fg">{n.nombre}</h3>
                  <p className="mt-1 text-fg-muted">{n.para}</p>
                  <ul className="mt-4 space-y-2">
                    {n.referencia.map((r) => (
                      <li key={r} className="flex items-center gap-2.5 text-fg">
                        <span className="hex" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-6 price text-3xl text-fg">{precioNivelPC(n.desde)}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-fg-subtle">{NOTA_PC}</p>
        </div>
      </section>

      <section id="cotizar" aria-labelledby="titulo-cotizar" className="bg-ink-950 border-y border-white/10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20 scroll-mt-16">
        <div className="max-w-[76rem] mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="antetitulo">Cotización sin costo</p>
            <h2 id="titulo-cotizar" className="mt-3 text-fg">Cotiza tu <span className="acento">PC</span></h2>
            <p className="mt-4 text-fg-muted leading-relaxed">
              Con estos datos te proponemos una configuración real, con precios del momento. Te respondemos por WhatsApp.
            </p>
          </div>
          <div className="tarjeta p-5 sm:p-8">
            <CotizacionForm />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="como-se-arma">
        <div className="max-w-[76rem] mx-auto">
          <div className="text-center">
            <p className="antetitulo">Paso a paso</p>
            <h2 id="como-se-arma" className="mt-3 text-fg">Cómo se arma</h2>
          </div>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map(({ icon: Icon, titulo, texto }, i) => (
              <li key={titulo} className="tarjeta p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-bright/50 font-display text-xl font-bold text-brand-bright">{i + 1}</span>
                  <Icon size={26} strokeWidth={1.75} className="text-cian" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-fg">{titulo}</h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BandaCta
        titulo="¿Prefieres conversarlo?"
        texto="Escríbenos por WhatsApp con tu presupuesto y lo que quieres jugar o hacer. Te orientamos sin compromiso."
        waHref={WA.servicio('PC Gamer a pedido')}
      />
    </div>
  )
}
