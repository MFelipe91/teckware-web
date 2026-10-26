import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, CalendarCheck, ShieldCheck, Receipt, Home, Timer, Clock } from 'lucide-react'
import { EMPRESA, PLAZO } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

// Server Component: el texto llega visible en el HTML (sin opacity: 0 inicial) para que
// el H1 sea el LCP. Solo las decoraciones tienen animación, y respetan reduced-motion.

const SELLOS = [
  { icon: ShieldCheck, label: 'Garantía 30 días' },
  { icon: Receipt, label: 'Boleta · TECKWARE SpA' },
  { icon: Home, label: 'A domicilio' },
  { icon: Timer, label: `Entrega en ${PLAZO}` },
  { icon: Clock, label: EMPRESA.horario },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950" aria-label="Inicio">
      {/* Fondo: grilla técnica sutil y halos azul/plata */}
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
      <div className="glow-brand w-[720px] h-[520px] -top-56 right-[-10%] opacity-70" aria-hidden="true" />
      <div className="glow-silver w-[520px] h-[520px] -bottom-64 -left-40 opacity-60" aria-hidden="true" />
      <div className="absolute top-0 inset-x-0 signature-line opacity-70" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-brand-bright/25 bg-brand/10 text-xs font-semibold tracking-wide text-brand-bright">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-bright" aria-hidden="true" />
              Mantención preventiva · PC gamer, notebooks, consolas y empresas
            </p>

            <h1 className="text-fg text-balance text-[clamp(32px,4.6vw,58px)]">
              Mantención y servicio técnico de computadores en{' '}
              <span className="gradient-text sm:whitespace-nowrap">La Serena y Coquimbo</span>
            </h1>

            <p className="mt-5 font-display text-lg sm:text-xl font-semibold text-silver">
              Reparamos tu hardware. Construimos tu software. Somos TECKWARE.
            </p>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-fg-muted max-w-xl">
              Cuidamos tu equipo como si fuera nuestro: te explicamos qué tiene, cuánto cuesta y
              cómo evitar que vuelva a fallar. Para personas, gamers y pymes, a domicilio o
              coordinando por WhatsApp.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={WA.general()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-brand text-white font-semibold text-base hover:bg-brand-hover transition-colors min-h-[52px]"
              >
                <MessageCircle size={19} aria-hidden="true" />
                Escríbenos por WhatsApp
              </a>
              <Link
                href="/agendar"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl border border-silver/30 text-fg font-semibold hover:border-silver/60 hover:bg-white/5 transition-colors min-h-[52px]"
              >
                <CalendarCheck size={18} aria-hidden="true" />
                Agendar servicio
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-fg-muted">
              {SELLOS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon size={15} className="text-brand-bright shrink-0" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Emblema de la marca (decorativo; se reemplaza por una foto real cuando exista) */}
          <div className="relative hidden lg:flex items-center justify-center" aria-hidden="true">
            <div className="absolute inset-[12%] rounded-full bg-brand/25 blur-[80px]" />
            <Image
              src="/brand/emblem.webp"
              alt=""
              width={560}
              height={467}
              sizes="(min-width: 1280px) 440px, 380px"
              className="relative w-full h-auto motion-safe:animate-[hero-float_8s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ink-900 to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  )
}
