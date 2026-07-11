'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Shield, Clock, Star, Gamepad2, Receipt } from 'lucide-react'
import { WA } from '@/lib/whatsapp'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { BLUR_DARK } from '@/lib/imageBlur'

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center bg-[#020307] overflow-hidden"
      aria-label="Inicio"
    >
      {/* Tech dot grid background */}
      <div className="absolute inset-0 bg-dot-grid opacity-30" />
      {/* Subtle line grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-25" />

      {/* AMD/ROG red glow — bottom left */}
      <div className="glow-red w-[600px] h-[600px] -bottom-40 -left-40 opacity-60" />
      {/* NVIDIA cyan glow — top center */}
      <div className="glow-cyan w-[700px] h-[500px] -top-48 left-1/4 opacity-35" />
      {/* ROG purple glow — mid right */}
      <div className="glow-purple w-[400px] h-[400px] top-1/3 right-0 opacity-40" />

      {/* Top accent bar — sliding AMD/ROG gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #E61E32 20%, #00D4FF 50%, #A855F7 80%, transparent 100%)',
        }}
      />

      {/* Hero image — desktop right panel with scan-line overlay */}
      <div className="absolute inset-y-0 right-0 w-[54%] hidden lg:block pointer-events-none">
        <div className="relative w-full h-full scan-line">
          <Image
            src="/images/gpubkn.jpg"
            alt="GPU gaming — PC Gamer TECKWARE La Serena"
            fill
            className="object-cover object-center"
            priority
            fetchPriority="high"
            quality={85}
            sizes="(max-width: 1024px) 0vw, 54vw"
            placeholder="blur"
            blurDataURL={BLUR_DARK}
          />
          {/* Strong left fade into dark bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020307] via-[#020307]/70 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020307]/90 via-transparent to-[#020307]/40" />
          {/* ROG-style diagonal cut on left edge */}
          <div
            className="absolute top-0 left-0 w-32 h-full"
            style={{
              background: 'linear-gradient(110deg, #020307 0%, #020307 40%, transparent 100%)',
            }}
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-xl lg:max-w-2xl">

          {/* AMD/ROG-style angular badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-7"
          >
            {/* Red accent block — AMD/ROG signature */}
            <span className="w-1 h-5 bg-[#E61E32] rounded-full" />
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#00D4FF]/20 bg-[#00D4FF]/6 rounded-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E61E32] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#00D4FF]">
                Disponible ahora · La Serena, Chile
              </span>
            </div>
          </motion.div>

          {/* H1 — ultra bold, NVIDIA-scale typography */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-black text-[#F1F5F9] mb-5 text-wrap-balance"
          >
            Tu equipo vuelve{' '}
            <br className="hidden sm:block" />
            a la vida.{' '}
            <span className="gradient-text neon-text">Garantizado.</span>
          </motion.h1>

          {/* Decorative tech line — MSI/ROG separator */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="tech-line mb-6 origin-left"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#8B9DB5] mb-8 leading-relaxed"
          >
            Reparamos notebooks, MacBook, PC Gamer y consolas en La Serena.
            Diagnóstico honesto, precios fijos, entrega en 24–48 horas.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            {/* Primary CTA — NVIDIA green-button style but in cyan */}
            <Link
              href="/agendar"
              className="group flex items-center justify-center gap-2 px-7 py-4 bg-[#00D4FF] text-[#020307] font-extrabold rounded-sm hover:bg-[#00B8D9] transition-all duration-150 min-h-[52px] text-base tracking-wide shadow-[0_0_30px_rgba(0,212,255,0.25)] hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]"
            >
              Agendar servicio
              <ArrowRight size={18} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
            {/* Secondary — dark glass */}
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/4 border border-white/10 text-[#F1F5F9] font-semibold rounded-sm hover:bg-white/8 hover:border-[#00D4FF]/30 transition-all duration-150 min-h-[52px]"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            {/* Tertiary — ROG purple/PC Gamer */}
            <Link
              href="/builds"
              className="flex items-center justify-center gap-2 px-6 py-4 border border-[#A855F7]/30 text-[#A855F7] font-semibold rounded-sm hover:bg-[#A855F7]/10 hover:border-[#A855F7]/50 transition-all duration-150 min-h-[52px]"
            >
              <Gamepad2 size={17} />
              PC Gamer
            </Link>
          </motion.div>

          {/* Trust badges — angular ROG style */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-wrap gap-2"
          >
            {[
              { icon: Shield, label: 'Sin cobros ocultos' },
              { icon: Clock, label: 'Respuesta en 2 horas' },
              { icon: Star, label: 'Garantía 30 días' },
              { icon: Receipt, label: 'Se emite boleta' },
            ].map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="flex items-center gap-2 px-3 py-2 rounded-sm bg-white/3 border border-white/7 text-sm text-[#8B9DB5] backdrop-blur-sm hover:border-[#00D4FF]/20 hover:text-[#F1F5F9] transition-colors"
              >
                <Icon size={12} className="text-[#00D4FF] shrink-0" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080B14] to-transparent pointer-events-none" />
    </section>
  )
}
