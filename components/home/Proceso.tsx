import { PROCESO } from '@/lib/constants'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

export function Proceso() {
  return (
    <section className="relative bg-ink-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <CircuitBackground variant="circuit" palette="brand" density={0.7} opacity={0.4} />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-bright">Cómo funciona</p>
          <h2 className="mt-3 text-fg">
            Simple, claro y <span className="gradient-text">sin sorpresas</span>
          </h2>
        </div>

        <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Línea conectora — solo desktop */}
          <div
            className="hidden lg:block absolute top-6 left-[calc(12.5%+2px)] right-[calc(12.5%+2px)] h-px bg-gradient-to-r from-transparent via-brand-bright/30 to-transparent"
            aria-hidden="true"
          />
          {PROCESO.map((paso) => (
            <li key={paso.numero} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 border-brand-bright/40 bg-ink-900 mb-5 shrink-0">
                <span className="font-display text-sm font-semibold text-brand-bright">{paso.numero}</span>
              </div>
              <h3 className="text-base font-semibold text-fg mb-2">{paso.titulo}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{paso.descripcion}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
