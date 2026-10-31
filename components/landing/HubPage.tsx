import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { IVA_NOTA } from '@/lib/constants'
import { faqLd, serviceLd } from '@/lib/structured-data'
import { Proceso } from '@/components/home/Proceso'
import { BandaCta } from '@/components/shared/BandaCta'
import { CtaPair } from '@/components/shared/CtaPair'
import { ListaFaq } from '@/components/shared/ListaFaq'
import { PageHeader } from '@/components/shared/PageHeader'

// Plantilla de los hubs de categoría (/mantencion, /empresas): agrupan servicios y
// enlazan a sus landings, así el menú apunta a una página que posiciona la categoría.

export type HubCard = {
  icon: LucideIcon
  titulo: string
  desc: string
  /** Precio "desde" o "A cotizar". Si se omite, la fila no muestra precio. */
  precio?: string
  /** Ruta interna o enlace de WhatsApp (los externos abren en otra pestaña). */
  href: string
  cta: string
}
export type HubPunto = { icon: LucideIcon; titulo: string; desc: string }
export type HubFaq = { q: string; a: string }
export type HubLink = { href: string; label: string }

export type HubPageProps = {
  path: string
  eyebrow: string
  titulo: string
  tituloAccent: string
  subtitle: string
  intro: string[]
  cardsTitle: string
  cards: HubCard[]
  puntosTitle: string
  puntos: HubPunto[]
  faqs: HubFaq[]
  /** Enlaces internos extra (guías del blog, landings relacionadas). */
  linksTitle?: string
  links?: HubLink[]
  waHref: string
  ctaTitle: string
  ctaText: string
}

const isExternal = (href: string) => href.startsWith('http')

export function HubPage(props: HubPageProps) {
  const {
    path, titulo, tituloAccent, subtitle, intro, cardsTitle, cards,
    puntosTitle, puntos, faqs, linksTitle, links, waHref, ctaTitle, ctaText,
  } = props
  const nombre = `${titulo} ${tituloAccent}`

  return (
    <div className="min-h-screen bg-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd({ name: nombre, description: subtitle, path })) }}
      />

      <PageHeader titulo={nombre} bajada={subtitle}>
        <CtaPair waHref={waHref} />
      </PageHeader>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid gap-10 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <h2 className="text-fg text-3xl sm:text-4xl">{cardsTitle}</h2>
          <div className="mt-5 space-y-4">
            {intro.map((p, i) => <p key={i} className="text-sm text-fg-muted leading-relaxed">{p}</p>)}
          </div>
          <p className="mt-5 text-sm text-fg-subtle">{IVA_NOTA}</p>
        </div>
        <ul className="border-t border-white/10">
          {cards.map(({ titulo, desc, precio, href, cta }) => {
            const clase = 'btn btn-terciario justify-self-end self-start'
            return (
              <li key={titulo} className="py-5 border-b border-white/10 grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2">
                <h3 className="text-fg">{titulo}</h3>
                <span className="price text-xl text-fg text-right">{precio}</span>
                <p className="text-sm text-fg-muted leading-relaxed">{desc}</p>
                {isExternal(href) ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>{cta}</a>
                ) : (
                  <Link href={href} className={clase}>{cta}</Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="bg-ink-800 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-[76rem] mx-auto">
          <h2 className="text-fg mb-8 sm:mb-10">{puntosTitle}</h2>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 border-t border-white/10">
            {puntos.map(({ titulo, desc }) => (
              <li key={titulo} className="py-5 border-b border-white/10">
                <h3 className="text-[1.125rem] text-fg">{titulo}</h3>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Proceso />

      <ListaFaq faqs={faqs} />

      {links && links.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <h2 className="text-fg text-3xl sm:text-4xl mb-6">{linksTitle}</h2>
          <ul className="grid gap-x-10 sm:grid-cols-2 border-t border-white/10">
            {links.map((l) => (
              <li key={l.href} className="border-b border-white/10">
                <Link href={l.href} className="block py-3 text-fg-muted hover:text-brand-bright transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <BandaCta titulo={ctaTitle} texto={ctaText} waHref={waHref} />
    </div>
  )
}
