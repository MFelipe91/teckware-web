import { ClipboardCheck, Clock, MapPin, ShieldCheck } from 'lucide-react'
import { PLAZO } from '@/lib/constants'

// Señales de confianza bajo el hero: solo afirmaciones que el negocio cumple (reglas del dueño).
const SENALES = [
  { icon: ClipboardCheck, titulo: 'Diagnóstico real', detalle: 'Con informe técnico' },
  { icon: ShieldCheck, titulo: 'Garantía de 30 días', detalle: 'En todos los trabajos' },
  { icon: Clock, titulo: `Entrega en ${PLAZO}`, detalle: 'Hora coordinada por WhatsApp' },
  { icon: MapPin, titulo: 'La Serena y Coquimbo', detalle: 'Taller en La Serena' },
]

export function TrustBar() {
  return (
    <section aria-label="Por qué confiar en TECKWARE" className="border-y border-white/10 bg-ink-900/80">
      <ul className="max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
        {SENALES.map(({ icon: Icon, titulo, detalle }) => (
          <li key={titulo} className="flex items-start gap-3">
            <Icon size={26} strokeWidth={1.75} className="text-brand-bright shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              <span className="block font-display text-lg font-bold leading-tight text-fg">{titulo}</span>
              <span className="block text-sm text-fg-muted">{detalle}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
