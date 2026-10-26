import Link from 'next/link'
import { MessageCircle, CalendarCheck, MapPin } from 'lucide-react'
import { EMPRESA, PLAZO } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export function CTABanner() {
  return (
    <section className="bg-ink-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-4xl mx-auto overflow-hidden rounded-3xl border border-brand-bright/20 bg-ink-950 text-center">
        <div className="glow-brand w-96 h-72 -top-32 left-1/2 -translate-x-1/2 opacity-50" aria-hidden="true" />
        <div className="absolute top-0 inset-x-0 signature-line opacity-70" aria-hidden="true" />

        <div className="relative py-16 px-6 sm:px-12">
          <h2 className="text-fg text-balance">
            Tu equipo tiene solución.{' '}
            <span className="gradient-text">Nosotros la encontramos.</span>
          </h2>

          <p className="mt-4 text-fg-muted max-w-lg mx-auto">
            Cuéntanos por WhatsApp qué le pasa. Te orientamos, te damos el precio y coordinamos
            una hora para recibirlo. Entrega en {PLAZO}, con informe técnico.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors min-h-[52px]"
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

          <p className="mt-8 inline-flex items-center gap-2 text-sm text-fg-subtle">
            <MapPin size={15} className="text-brand-bright" aria-hidden="true" />
            {EMPRESA.direccion} · {EMPRESA.horario}
          </p>
        </div>
      </div>
    </section>
  )
}
