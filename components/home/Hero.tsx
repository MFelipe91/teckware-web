'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Shield, Clock, Star, Gamepad2 } from 'lucide-react'
import { WA } from '@/lib/whatsapp'
import { staggerContainer, staggerItem } from '@/lib/animations'

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center bg-[#03040A] overflow-hidden"
      aria-label="Inicio"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Glow blobs */}
      <div className="glow-cyan w-[500px] h-[500px] -top-32 -right-32 opacity-40" />
      <div className="glow-purple w-[400px] h-[400px] bottom-0 -left-20 opacity-30" />

      {/* Hero image — desktop right panel */}
      <div className="absolute inset-y-0 right-0 w-[52%] hidden lg:block pointer-events-none">
        <div className="relative w-full h-full">
          <Image
            src="/images/back2gaming-bXSC9GGir_A-unsplash.jpg"
            alt="GeForce RTX — PC Gamer TECKWARE"
            fill
            className="object-cover object-center"
            priority
            sizes="52vw"
          />
          {/* Left fade into dark bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#03040A] via-[#03040A]/60 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03040A]/80 via-transparent to-[#03040A]/30" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-xl lg:max-w-2xl">
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
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-black text-[#F1F5F9] mb-6 text-wrap-balance"
          >
            Tu equipo vuelve a la vida.{' '}
            <span className="gradient-text">Garantizado.</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#94A3B8] mb-8 leading-relaxed"
          >
            Reparamos notebooks, MacBook, PC Gamer y consolas en La Serena.
            Diagnóstico honesto, precios fijos, entrega en 24–48 horas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-14"
          >
            <Link
              href="/agendar"
              className="flex items-center justify-center gap-2 px-7 py-4 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00B8D9] transition-colors duration-150 min-h-[52px] text-base"
            >
              Agendar servicio
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/12 text-[#F1F5F9] font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-150 min-h-[52px]"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <Link
              href="/builds"
              className="flex items-center justify-center gap-2 px-6 py-4 border border-[#A855F7]/35 text-[#A855F7] font-semibold rounded-xl hover:bg-[#A855F7]/10 transition-all duration-150 min-h-[52px]"
            >
              <Gamepad2 size={17} />
              PC Gamer
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: Shield, label: 'Sin cobros ocultos' },
              { icon: Clock, label: 'Respuesta en 2 horas' },
              { icon: Star, label: 'Garantía 30 días' },
            ].map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 border border-white/8 text-sm text-[#94A3B8] backdrop-blur-sm"
              >
                <Icon size={13} className="text-[#00D4FF]" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080B14] to-transparent pointer-events-none" />
    </section>
  )
}
