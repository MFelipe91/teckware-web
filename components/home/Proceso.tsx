'use client'

import { motion } from 'framer-motion'
import { PROCESO } from '@/lib/constants'
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

export function Proceso() {
  return (
    <section className="relative bg-ink-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <CircuitBackground variant="circuit" palette="brand" density={0.7} opacity={0.4} />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-brand-bright border border-brand-bright/25 rounded-full bg-brand/8">
            Cómo funciona
          </span>
          <h2 className="text-fg mb-4">
            4 pasos hacia un{' '}
            <span className="gradient-text">equipo perfecto</span>
          </h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {/* Línea conectora — solo desktop */}
          <div
            className="hidden lg:block absolute top-10 left-[calc(12.5%+2px)] right-[calc(12.5%+2px)] h-px bg-gradient-to-r from-transparent via-brand-bright/30 to-transparent"
            aria-hidden="true"
          />

          {PROCESO.map((paso, i) => (
            <motion.div
              key={paso.numero}
              variants={staggerItem}
              className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              {/* Número */}
              <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 border-brand-bright/40 bg-ink-900 mb-5 shrink-0">
                <span className="price text-sm font-bold text-brand-bright">{paso.numero}</span>
              </div>

              <h3 className="text-base font-bold text-fg mb-2">{paso.titulo}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{paso.descripcion}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
