import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { IVA_NOTA } from '@/lib/constants'
import { LANDINGS } from '@/lib/landings'
import { faqLd, serviceLd } from '@/lib/structured-data'
import { BandaCta } from '@/components/shared/BandaCta'
import { CtaPair } from '@/components/shared/CtaPair'
import { ListaFaq } from '@/components/shared/ListaFaq'
import { PageHeader } from '@/components/shared/PageHeader'

export type LandingFeature = { icon: LucideIcon; titulo: string; desc: string }
export type LandingPrecio = { nombre: string; precio: string; tiempo: string; href: string }
export type LandingFaq = { q: string; a: string }

export type ServiceLandingProps = {
  /** Ruta de la página (ej. '/formateo-pc-la-serena'): JSON-LD y "Otros servicios". */
  path: string
  eyebrow: string
  titulo: string
  tituloAccent: string
  subtitle: string
  intro: string[]
  /** Reservadas para la foto real de cada landing (plan maestro, 6.8). */
  heroImage?: string
  heroAlt?: string
  featuresTitle: string
  features: LandingFeature[]
  marcasTitle?: string
  marcas?: string[]
  precios?: LandingPrecio[]
  faqs: LandingFaq[]
  waHref: string
  ctaTitle: string
  ctaText: string
}

export function ServiceLanding(props: ServiceLandingProps) {
  const {
    path, titulo, tituloAccent, subtitle, intro,
    featuresTitle, features, marcasTitle, marcas, precios, faqs, waHref, ctaTitle, ctaText,
  } = props
  const otros = LANDINGS.filter((l) => l.href !== path)
  const nombre = `${titulo} ${tituloAccent}`

  return (
    <div className="min-h-svh bg-ink-900">
      {/* JSON-LD FAQ → rich snippet en Google */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }} />
      {/* JSON-LD Service → vincula este servicio al negocio local */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd({ name: nombre, description: subtitle, path })) }}
      />

      <PageHeader titulo={nombre} bajada={subtitle}>
        <CtaPair waHref={waHref} />
      </PageHeader>

      {/* Texto a la izquierda, lo que incluye a la derecha */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid gap-10 lg:gap-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-4">
          {intro.map((p, i) => <p key={i} className="text-fg-muted leading-relaxed">{p}</p>)}
        </div>
        <div>
          <h2 className="text-fg text-3xl sm:text-4xl mb-6">{featuresTitle}</h2>
          <ul className="border-t border-white/10">
            {features.map(({ icon: Icon, titulo, desc }) => (
              <li key={titulo} className="grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 py-4 border-b border-white/10">
                <Icon size={20} className="text-brand-bright mt-1" aria-hidden="true" />
                <div>
                  <h3 className="text-[1.125rem] text-fg">{titulo}</h3>
                  <p className="mt-1 text-sm text-fg-muted leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {precios && precios.length > 0 && (
        <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-[76rem] mx-auto grid gap-8 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
            <div>
              <h2 className="text-fg">Precios de referencia</h2>
              <p className="mt-4 text-sm text-fg-muted">{IVA_NOTA}</p>
            </div>
            <ul className="border-t border-white/10">
              {precios.map((p) => (
                <li key={p.nombre} className="py-4 border-b border-white/10 grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 items-baseline">
                  <h3 className="text-fg">{p.nombre}</h3>
                  <span className="price text-xl text-fg text-right">{p.precio}</span>
                  <span className="text-sm text-fg-subtle">{p.tiempo}</span>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="btn btn-terciario justify-self-end" aria-label={`Solicitar ${p.nombre}`}>
                    Solicitar
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {marcas && marcas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <h2 className="text-fg text-3xl sm:text-4xl mb-5">{marcasTitle ?? 'Marcas que atendemos'}</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-display text-lg text-fg-muted">
            {marcas.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </section>
      )}

      <ListaFaq faqs={faqs} />

      {/* Enlazado interno entre landings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <h2 className="text-fg text-3xl sm:text-4xl mb-6">Otros servicios en La Serena y Coquimbo</h2>
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 border-t border-white/10">
          {otros.map((l) => (
            <li key={l.href} className="border-b border-white/10">
              <Link href={l.href} className="block py-3 text-fg-muted hover:text-brand-bright transition-colors">{l.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <BandaCta titulo={ctaTitle} texto={ctaText} waHref={waHref} />
    </div>
  )
}
