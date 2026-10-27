import {
  ShieldCheck, Award, Zap, RefreshCw, Lock, UserCheck
} from 'lucide-react'
import { POR_QUE_ELEGIRNOS } from '@/lib/constants'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'shield-check': ShieldCheck,
  'award': Award,
  'zap': Zap,
  'refresh-cw': RefreshCw,
  'lock': Lock,
  'user-check': UserCheck,
}

export function PorQueElegirnos() {
  return (
    <section className="bg-ink-800 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <CircuitBackground variant="hex-mesh" palette="mixed" density={0.9} opacity={0.5} />
      <div className="glow-brand w-96 h-96 -top-20 right-0 opacity-30" />
      <div className="glow-silver w-80 h-80 bottom-0 left-0 opacity-20" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-brand-bright border border-brand/25 rounded-full bg-brand/8">
            Por qué elegirnos
          </span>
          <h2 className="text-fg mb-4">
            No somos un servicio técnico{' '}
            <span className="gradient-text">más</span>
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto">
            Un ingeniero informático con certificaciones en ciberseguridad al frente de cada trabajo.
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {POR_QUE_ELEGIRNOS.map((item) => {
            const Icon = ICONS[item.icono] ?? ShieldCheck
            return (
              <div
                key={item.titulo}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                  <Icon size={18} className="text-brand-bright" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-fg mb-1">{item.titulo}</h3>
                  <p className="text-sm text-fg-muted leading-relaxed">{item.descripcion}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
