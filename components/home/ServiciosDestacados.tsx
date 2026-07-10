'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search, RefreshCw, Wrench, Cpu, Package, ArrowRight, Briefcase
} from 'lucide-react'
import { SERVICIOS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'search': Search,
  'refresh-cw': RefreshCw,
  'tool': Wrench,
  'briefcase': Briefcase,
  'cpu': Cpu,
  'package': Package,
}

export function ServiciosDestacados() {
  return (
    <section className="bg-[#080B14] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-[#00D4FF] border border-[#00D4FF]/25 rounded-full bg-[#00D4FF]/8">
            Servicios
          </span>
          <h2 className="text-[#F1F5F9] mb-4">
            Lo que hacemos{' '}
            <span className="gradient-text">mejor</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Precios fijos, sin sorpresas. Sabes el costo antes de que empecemos.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SERVICIOS.map((servicio) => {
            const Icon = ICONS[servicio.icono] ?? Package
            const waLink = servicio.id === 'diagnostico'
              ? WA.diagnostico()
              : servicio.id === 'formateo'
              ? WA.formateo()
              : servicio.id === 'mantenimiento'
              ? WA.mantenimiento()
              : WA.servicio(servicio.nombre)

            return (
              <motion.div
                key={servicio.id}
                variants={staggerItem}
                className="group relative glass-card rounded-2xl p-6 card-hover border border-white/10"
              >
                {/* Icon */}
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 mb-4">
                  <Icon size={20} className="text-[#00D4FF]" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-[#F1F5F9] mb-2 leading-snug">
                  {servicio.nombre}
                </h3>
                <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed">
                  {servicio.descripcion}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    {servicio.precio === 'A cotizar' ? (
                      <span className="text-sm font-semibold text-[#A855F7]">A cotizar</span>
                    ) : (
                      <span className="price text-xl font-bold text-[#F1F5F9]">
                        {servicio.precio}
                      </span>
                    )}
                    <span className="ml-2 text-xs text-[#475569]">{servicio.tiempo}</span>
                  </div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#00D4FF] border border-[#00D4FF]/30 rounded-lg hover:bg-[#00D4FF]/10 transition-all min-h-[36px]"
                  >
                    Cotizar
                    <ArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
          >
            Ver todos los servicios
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
