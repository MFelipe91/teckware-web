import { ShieldCheck, Receipt, Timer, FileText, Wallet } from 'lucide-react'
import { PLAZO } from '@/lib/constants'

// Franja de confianza bajo el hero: solo compromisos que siempre se cumplen.
const ITEMS = [
  { icon: Timer, label: `Entrega en ${PLAZO}` },
  { icon: FileText, label: 'Informe técnico de cada trabajo' },
  { icon: ShieldCheck, label: 'Garantía 30 días' },
  { icon: Receipt, label: 'Boleta · TECKWARE SpA' },
  { icon: Wallet, label: 'Pagas al retirar' },
]

export function TrustStrip() {
  return (
    <section aria-label="Nuestros compromisos" className="border-y border-white/8 bg-ink-900">
      <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:justify-between">
        {ITEMS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-sm text-fg-muted">
            <Icon size={17} className="text-brand-bright shrink-0" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}
