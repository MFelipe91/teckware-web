import { MapPin } from 'lucide-react'
import { EMPRESA, PLAZO } from '@/lib/constants'
import { CtaPair } from '@/components/shared/CtaPair'

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

          <div className="mt-8">
            <CtaPair />
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
