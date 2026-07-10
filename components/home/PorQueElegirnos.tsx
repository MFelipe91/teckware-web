'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheck, Award, Zap, RefreshCw, Lock, UserCheck
} from 'lucide-react'
import { POR_QUE_ELEGIRNOS } from '@/lib/constants'
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

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
    <section className="bg-[#0D1120] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="glow-cyan w-96 h-96 -top-20 right-0 opacity-30" />
      <div className="glow-purple w-80 h-80 bottom-0 left-0 opacity-20" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-[#A855F7] border border-[#A855F7]/25 rounded-full bg-[#A855F7]/8">
            Por qué elegirnos
          </span>
          <h2 className="text-[#F1F5F9] mb-4">
            No somos un servicio técnico{' '}
            <span className="gradient-text">más</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Ingeniero en Informática con especialización en Ciberseguridad al frente de cada reparación.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {POR_QUE_ELEGIRNOS.map((item) => {
            const Icon = ICONS[item.icono] ?? ShieldCheck
            return (
              <motion.div
                key={item.titulo}
                variants={staggerItem}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20">
                  <Icon size={18} className="text-[#A855F7]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">{item.titulo}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{item.descripcion}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
