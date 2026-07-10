'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { WA } from '@/lib/whatsapp'
import { fadeInUp, viewportConfig } from '@/lib/animations'

export function CTABanner() {
  return (
    <section className="bg-[#080B14] py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={viewportConfig}
        className="max-w-4xl mx-auto text-center relative"
      >
        {/* Fondo gradient */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.08) 100%)',
              border: '1px solid rgba(0,212,255,0.15)',
            }}
          />
          <div className="glow-cyan w-64 h-64 -top-16 -right-16 opacity-40" />
          <div className="glow-purple w-48 h-48 -bottom-8 -left-8 opacity-30" />
        </div>

        <div className="relative py-16 px-6 sm:px-12">
          <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold tracking-widest uppercase text-[#00D4FF] border border-[#00D4FF]/25 rounded-full bg-[#00D4FF]/8">
            ¿Listo para empezar?
          </span>

          <h2 className="text-[#F1F5F9] mb-4">
            Tu equipo tiene solución.{' '}
            <span className="gradient-text">Nosotros la encontramos.</span>
          </h2>

          <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">
            Escríbenos por WhatsApp y te cotizamos en minutos. Sin compromiso,
            sin letra chica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#22C55E] text-white font-bold rounded-xl hover:bg-[#16A34A] transition-colors duration-150 min-h-[52px]"
            >
              <MessageCircle size={18} strokeWidth={2.5} />
              Escribir por WhatsApp
            </a>
            <Link
              href="/solicitar"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors duration-150 min-h-[52px]"
            >
              Solicitar servicio
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
