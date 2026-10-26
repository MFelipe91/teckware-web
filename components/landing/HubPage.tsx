import Link from 'next/link'
import { ArrowRight, MessageCircle, CalendarCheck, ChevronDown, Receipt } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { IVA_NOTA, PROCESO } from '@/lib/constants'
import { faqLd, serviceLd } from '@/lib/structured-data'

// Plantilla de los hubs de categoría (/mantencion, /empresas): agrupan servicios y
// enlazan a sus landings, así el menú apunta a una página que posiciona la categoría.

export type HubCard = {
  icon: LucideIcon
  titulo: string
  desc: string
  /** Precio "desde" o "A cotizar". Si se omite, la tarjeta no muestra precio. */
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
    path, eyebrow, titulo, tituloAccent, subtitle, intro, cardsTitle, cards,
    puntosTitle, puntos, faqs, linksTitle, links, waHref, ctaTitle, ctaText,
  } = props

  return (
    <div className="min-h-screen bg-ink-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceLd({ name: `${titulo} ${tituloAccent}`, description: subtitle, path })),
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950 px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
        <div className="glow-brand w-[600px] h-[420px] -top-48 right-[-10%] opacity-60" aria-hidden="true" />
        <div className="absolute top-0 inset-x-0 signature-line opacity-70" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-brand-bright/25 bg-brand/10 text-xs font-semibold tracking-wide text-brand-bright">
            {eyebrow}
          </p>
          <h1 className="text-fg text-balance">
            {titulo} <span className="gradient-text sm:whitespace-nowrap">{tituloAccent}</span>
          </h1>
          <p className="mt-5 text-lg text-fg-muted max-w-2xl mx-auto">{subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors min-h-[48px]"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Escríbenos por WhatsApp
            </a>
            <Link
              href="/agendar"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-silver/30 text-fg font-semibold hover:border-silver/60 hover:bg-white/5 transition-colors min-h-[48px]"
            >
              <CalendarCheck size={18} aria-hidden="true" />
              Agendar servicio
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4">
        {intro.map((p, i) => (
          <p key={i} className="text-fg-muted leading-relaxed">{p}</p>
        ))}
      </section>

      {/* SERVICIOS DE LA CATEGORÍA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-fg mb-10 text-center">{cardsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ icon: Icon, titulo, desc, precio, href, cta }) => {
            const body = (
              <>
                <div className="w-11 h-11 mb-5 flex items-center justify-center rounded-lg bg-brand/10 border border-brand-bright/20">
                  <Icon size={20} className="text-brand-bright" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">{titulo}</h3>
                <p className="text-sm text-fg-muted leading-relaxed mb-5">{desc}</p>
                <div className="mt-auto flex items-end justify-between gap-3">
                  {precio ? (
                    <span className="price text-lg font-semibold text-silver">{precio}</span>
                  ) : <span />}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-bright">
                    {cta}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </>
            )
            const className = 'group flex flex-col h-full p-6 rounded-xl glass-card card-hover'
            return isExternal(href) ? (
              <a key={titulo} href={href} target="_blank" rel="noopener noreferrer" className={className}>{body}</a>
            ) : (
              <Link key={titulo} href={href} className={className}>{body}</Link>
            )
          })}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-fg-subtle text-center">
          <Receipt size={13} aria-hidden="true" />
          {IVA_NOTA}
        </p>
      </section>

      {/* POR QUÉ */}
      <section className="bg-ink-800/60 border-y border-white/5 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-fg mb-10 text-center">{puntosTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {puntos.map(({ icon: Icon, titulo, desc }) => (
              <div key={titulo} className="flex gap-4">
                <Icon size={22} className="text-brand-bright shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-fg mb-1.5">{titulo}</h3>
                  <p className="text-sm text-fg-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-fg mb-10 text-center">Cómo funciona</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESO.map((p) => (
            <li key={p.numero} className="p-6 rounded-xl border border-white/8 bg-ink-800/50">
              <span className="font-display text-sm font-semibold text-brand-bright">{p.numero}</span>
              <h3 className="mt-2 text-base font-semibold text-fg">{p.titulo}</h3>
              <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{p.descripcion}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-fg mb-8 text-center">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group rounded-xl border border-white/8 bg-ink-800/50 open:border-brand-bright/25">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-fg">
                {q}
                <ChevronDown size={16} className="shrink-0 text-fg-subtle transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-sm text-fg-muted leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ENLACES RELACIONADOS */}
      {links && links.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-fg mb-8 text-center text-2xl sm:text-3xl">{linksTitle}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl border border-white/8 bg-ink-800/40 text-sm text-fg-muted hover:text-fg hover:border-brand-bright/30 transition-colors"
                >
                  {l.label}
                  <ArrowRight size={15} className="shrink-0 text-brand-bright" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative max-w-4xl mx-auto overflow-hidden rounded-2xl border border-brand-bright/20 bg-ink-950 px-6 py-14 text-center">
          <div className="glow-brand w-96 h-72 -top-32 left-1/2 -translate-x-1/2 opacity-50" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-fg text-balance">{ctaTitle}</h2>
            <p className="mt-4 text-fg-muted max-w-xl mx-auto">{ctaText}</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors min-h-[48px]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Escríbenos por WhatsApp
              </a>
              <Link
                href="/agendar"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-silver/30 text-fg font-semibold hover:border-silver/60 hover:bg-white/5 transition-colors min-h-[48px]"
              >
                <CalendarCheck size={18} aria-hidden="true" />
                Agendar servicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
