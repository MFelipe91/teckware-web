import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MessageCircle, Check, ChevronDown, Receipt } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BLUR_DARK } from '@/lib/imageBlur'
import { IVA_NOTA } from '@/lib/constants'
import { faqLd } from '@/lib/structured-data'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

export type LandingFeature = { icon: LucideIcon; titulo: string; desc: string }
export type LandingPrecio = { nombre: string; precio: string; tiempo: string; href: string }
export type LandingFaq = { q: string; a: string }

export type ServiceLandingProps = {
  eyebrow: string
  titulo: string
  tituloAccent: string
  subtitle: string
  intro: string[]
  heroImage: string
  heroAlt: string
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
    eyebrow, titulo, tituloAccent, subtitle, intro, heroImage, heroAlt,
    featuresTitle, features, marcasTitle, marcas, precios, faqs, waHref, ctaTitle, ctaText,
  } = props

  return (
    <div className="min-h-screen bg-[#080B14] pt-24">
      {/* JSON-LD FAQ → rich snippet en Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }}
      />

      {/* HERO */}
      <section className="relative bg-[#020307] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            className="object-cover object-center opacity-10"
            priority
            quality={50}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DARK}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020307]/80 via-[#020307]/60 to-[#020307]" />
        </div>
        <CircuitBackground variant="circuit" palette="mixed" density={1} opacity={0.5} />
        <div className="glow-cyan w-80 h-80 -top-20 right-0 opacity-30" />
        <div className="glow-red w-64 h-64 bottom-0 left-0 opacity-30" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #E61E32 30%, #00D4FF 70%, transparent)' }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] uppercase text-[#00D4FF] border border-[#00D4FF]/20 rounded-sm bg-[#00D4FF]/6">
            {eyebrow}
          </span>
          <h1 className="text-[#F1F5F9] mb-4">
            {titulo}{' '}
            <span className="gradient-text">{tituloAccent}</span>
          </h1>
          <p className="text-[#8B9DB5] max-w-xl mx-auto mb-8">{subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/agendar"
              className="flex items-center gap-2 px-6 py-3 bg-[#00D4FF] text-[#020307] font-extrabold rounded-sm hover:bg-[#00B8D9] transition-colors min-h-[48px] shadow-[0_0_20px_rgba(0,212,255,0.25)]"
            >
              Agendar ahora
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-[#22C55E]/40 text-[#22C55E] font-bold rounded-sm hover:bg-[#22C55E]/10 transition-colors min-h-[48px]"
            >
              <MessageCircle size={16} />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* INTRO SEO */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {intro.map((p, i) => (
            <p key={i} className="text-[#8B9DB5] leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      <div className="tech-line mx-8" />

      {/* FEATURES — qué incluye */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-[#F1F5F9] mb-2 text-center">{featuresTitle}</h2>
        <p className="text-[#8B9DB5] mb-12 text-center">Trabajo profesional, transparente y con garantía.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="glass-card rounded-sm p-7 border border-white/8 card-hover">
              <div className="w-12 h-12 mb-5 flex items-center justify-center rounded-sm bg-[#00D4FF]/8 border border-[#00D4FF]/20">
                <Icon size={22} className="text-[#00D4FF]" />
              </div>
              <h3 className="text-base font-bold text-[#F1F5F9] mb-2 leading-snug">{titulo}</h3>
              <p className="text-sm text-[#8B9DB5] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARCAS / EQUIPOS */}
      {marcas && marcas.length > 0 && (
        <section className="bg-[#050810] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-[#F1F5F9] mb-8">{marcasTitle ?? 'Marcas que atendemos'}</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {marcas.map((m) => (
                <span
                  key={m}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm bg-white/[0.03] border border-white/8 text-sm text-[#8B9DB5]"
                >
                  <Check size={13} className="text-[#00D4FF]" />
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRECIOS */}
      {precios && precios.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-[#F1F5F9] mb-2 text-center">Precios de referencia</h2>
          <p className="text-[#8B9DB5] mb-12 text-center">Valores con IVA incluido. Se emite boleta.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {precios.map((p) => (
              <div key={p.nombre} className="glass-card rounded-sm p-7 border border-white/8 card-hover flex flex-col">
                <h3 className="text-base font-bold text-[#F1F5F9] mb-3">{p.nombre}</h3>
                <div className="mb-5">
                  {p.precio.includes('cotizar') ? (
                    <span className="text-xl font-bold text-[#A855F7]">{p.precio}</span>
                  ) : (
                    <span className="price text-3xl font-black text-[#00D4FF]">{p.precio}</span>
                  )}
                  <span className="ml-2 text-xs text-[#475569]">{p.tiempo}</span>
                </div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00D4FF] text-[#020307] text-sm font-extrabold rounded-sm hover:bg-[#00B8D9] transition-colors min-h-[40px]"
                >
                  Solicitar
                  <ArrowRight size={14} strokeWidth={2.5} />
                </a>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-10 text-xs text-[#475569]">
            <Receipt size={13} />
            <span>{IVA_NOTA}</span>
          </div>
        </section>
      )}

      <div className="tech-line mx-8" />

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-[#F1F5F9] mb-10 text-center">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group glass-card rounded-sm border border-white/8 overflow-hidden">
              <summary className="flex items-center justify-between gap-4 cursor-pointer p-5 text-sm font-semibold text-[#F1F5F9] list-none">
                {f.q}
                <ChevronDown size={16} className="text-[#00D4FF] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm text-[#8B9DB5] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto text-center p-10 sm:p-14 rounded-sm border border-[#00D4FF]/15 bg-[#00D4FF]/5 relative overflow-hidden">
          <CircuitBackground variant="hex-mesh" palette="cyan" density={0.8} opacity={0.35} />
          <div className="glow-cyan w-72 h-72 -top-20 left-1/2 -translate-x-1/2 opacity-20" />
          <div className="relative">
            <h2 className="text-[#F1F5F9] mb-3">{ctaTitle}</h2>
            <p className="text-[#8B9DB5] mb-8 max-w-lg mx-auto">{ctaText}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/agendar"
                className="flex items-center gap-2 px-7 py-3.5 bg-[#00D4FF] text-[#020307] font-extrabold rounded-sm hover:bg-[#00B8D9] transition-colors min-h-[52px] shadow-[0_0_24px_rgba(0,212,255,0.3)]"
              >
                Agendar servicio
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-3.5 border border-[#22C55E]/40 text-[#22C55E] font-bold rounded-sm hover:bg-[#22C55E]/10 transition-colors min-h-[52px]"
              >
                <MessageCircle size={16} />
                WhatsApp directo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
