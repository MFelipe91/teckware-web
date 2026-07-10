'use client'

import { motion } from 'framer-motion'
import { PROCESO } from '@/lib/constants'
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

export function Proceso() {
  return (
    <section className="bg-[#080B14] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-[#00D4FF] border border-[#00D4FF]/25 rounded-full bg-[#00D4FF]/8">
            Cómo funciona
          </span>
          <h2 className="text-[#F1F5F9] mb-4">
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
            className="hidden lg:block absolute top-10 left-[calc(12.5%+2px)] right-[calc(12.5%+2px)] h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"
            aria-hidden="true"
          />

          {PROCESO.map((paso, i) => (
            <motion.div
              key={paso.numero}
              variants={staggerItem}
              className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              {/* Número */}
              <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#00D4FF]/40 bg-[#080B14] mb-5 shrink-0">
                <span className="price text-sm font-bold text-[#00D4FF]">{paso.numero}</span>
              </div>

              <h3 className="text-base font-bold text-[#F1F5F9] mb-2">{paso.titulo}</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{paso.descripcion}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
