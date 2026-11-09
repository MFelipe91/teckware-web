import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { IVA_NOTA } from '@/lib/constants'
import { faqLd, serviceLd } from '@/lib/structured-data'
import { Proceso } from '@/components/home/Proceso'
import { BandaCta } from '@/components/shared/BandaCta'
import { CtaPair } from '@/components/shared/CtaPair'
import { ListaFaq } from '@/components/shared/ListaFaq'
import { HeroInterior } from '@/components/shared/HeroInterior'
import { STOCK, type Foto } from '@/lib/fotos'

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
  /** Foto del hero (stock o real). */
  foto?: Foto
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
    path, eyebrow, foto = STOCK.tecnico, titulo, tituloAccent, subtitle, intro, cardsTitle, cards,
    puntosTitle, puntos, faqs, linksTitle, links, waHref, ctaTitle, ctaText,
  } = props
  const nombre = `${titulo} ${tituloAccent}`

  return (
    <div className="min-h-svh bg-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd({ name: nombre, description: subtitle, path })) }}
      />

      <HeroInterior antetitulo={eyebrow} titulo={<>{titulo} <span className="acento">{tituloAccent}</span></>} bajada={subtitle} foto={foto}>
        <CtaPair waHref={waHref} />
      </HeroInterior>

      <section className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="hub-cards">
        <div className="max-w-[76rem] mx-auto">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
            <h2 id="hub-cards" className="text-fg">{cardsTitle}</h2>
            <div className="space-y-4">
              {intro.map((p, i) => <p key={i} className="text-fg-muted leading-relaxed">{p}</p>)}
            </div>
          </div>
          <ul className="mt-10 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ icon: Icon, titulo, desc, precio, href, cta }) => {
              const contenido = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <Icon size={30} strokeWidth={1.6} className="text-cian shrink-0" aria-hidden="true" />
                    {precio && <span className="price text-lg text-fg text-right">{precio}</span>}
                  </div>
                  <h3 className="mt-4 text-fg">{titulo}</h3>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">{desc}</p>
                  <span className="mt-auto pt-4 font-display font-bold text-brand-bright">{cta} →</span>
                </>
              )
              const clase = 'tarjeta tarjeta-enlace flex h-full flex-col p-5 sm:p-6'
              return (
                <li key={titulo}>
                  {isExternal(href) ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>{contenido}</a>
                  ) : (
                    <Link href={href} className={clase}>{contenido}</Link>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-sm text-fg-subtle">{IVA_NOTA}</p>
        </div>
      </section>

      <section className="bg-ink-950 border-y border-white/10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="hub-puntos">
        <div className="max-w-[76rem] mx-auto">
          <p className="antetitulo">{eyebrow}</p>
          <h2 id="hub-puntos" className="mt-3 text-fg mb-8 sm:mb-10">{puntosTitle}</h2>
          <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {puntos.map(({ icon: Icon, titulo, desc }) => (
              <li key={titulo} className="tarjeta flex gap-4 p-5">
                <Icon size={26} strokeWidth={1.6} className="text-brand-bright shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-lg text-fg">{titulo}</h3>
                  <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{desc}</p>
                </div>
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
