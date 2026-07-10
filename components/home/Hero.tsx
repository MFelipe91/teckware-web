'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Shield, Clock, Star } from 'lucide-react'
import { WA } from '@/lib/whatsapp'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center bg-[#03040A] overflow-hidden"
      aria-label="Inicio"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Glow blobs */}
      <div className="glow-cyan w-[500px] h-[500px] -top-32 -right-32 opacity-60" />
      <div className="glow-purple w-[400px] h-[400px] bottom-0 -left-20 opacity-40" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: 'rgba(0,212,255,0.04)', filter: 'blur(120px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-[#00D4FF]/25 bg-[#00D4FF]/8 text-[#00D4FF] text-xs font-semibold tracking-widest uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            Disponible ahora — La Serena, Chile
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black text-[#F1F5F9] mb-6"
          >
            Tu equipo vuelve a la vida.{' '}
            <span className="gradient-text">Garantizado.</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-[#94A3B8] mb-8 max-w-2xl leading-relaxed"
          >
            Reparamos notebooks, MacBook, PC Gamer y consolas en La Serena.
            Diagnóstico honesto, precios fijos, entrega en 24–48 horas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-14"
          >
            <Link
              href="/solicitar"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors duration-150 min-h-[52px] w-full sm:w-auto"
            >
              Solicitar servicio
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-[#F1F5F9] font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-150 min-h-[52px] w-full sm:w-auto"
            >
              <MessageCircle size={18} />
              Cotizar por WhatsApp
            </a>
            <Link
              href="/builds"
              className="flex items-center justify-center gap-2 px-6 py-3.5 border border-[#A855F7]/30 text-[#A855F7] font-semibold rounded-xl hover:bg-[#A855F7]/10 transition-all duration-150 min-h-[52px] w-full sm:w-auto"
            >
              Ver PC Gamer
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: Shield, label: 'Sin cobros ocultos' },
              { icon: Clock, label: 'Respuesta en 2 horas' },
              { icon: Star, label: 'Garantía 30 días' },
            ].map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#94A3B8]"
              >
                <Icon size={14} className="text-[#00D4FF]" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080B14] to-transparent pointer-events-none" />
    </section>
  )
}
