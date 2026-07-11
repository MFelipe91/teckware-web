'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Wrench, Cpu, HardDrive, MonitorSmartphone, ArrowRight, CalendarCheck } from 'lucide-react'
import { BLUR_DARK } from '@/lib/imageBlur'

const SERVICES = [
  {
    icon: Wrench,
    label: 'Diagnóstico',
    desc: 'Revisión completa · $30.000 c/IVA',
    query: 'Diagnóstico Electrónico',
    accent: '#00D4FF',
    image: '/images/diagnostico_tester.jpg',
    imageAlt: 'Técnico realizando diagnóstico electrónico',
  },
  {
    icon: HardDrive,
    label: 'Mantención Full',
    desc: 'Limpieza + formateo + Office · $75.000',
    query: 'Mantención Full',
    accent: '#A855F7',
    image: '/images/mantencionpc2.jpg',
    imageAlt: 'Mantención física completa de PC',
  },
  {
    icon: Cpu,
    label: 'Armado PC Gamer',
    desc: 'Estándar $75.000 · Alta Gama $90.000',
    query: 'Armado PC Gamer',
    accent: '#00D4FF',
    image: '/images/pcgamer01.jpg',
    imageAlt: 'PC Gamer armada con cable management profesional',
  },
  {
    icon: MonitorSmartphone,
    label: 'Consolas PS4/PS5',
    desc: 'PS4 $55.000 · PS5 $80.000 c/IVA',
    query: 'Mantención Consola',
    accent: '#A855F7',
    image: '/images/pexels-david-bares-42311-424436.jpg',
    imageAlt: 'Mantención de consolas PlayStation',
  },
]

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
}

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export function BookingStrip() {
  return (
    <section className="bg-[#050810] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="glow-red w-64 h-64 -bottom-16 -right-16 opacity-30" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-sm border border-[#00D4FF]/20 bg-[#00D4FF]/5 text-[#00D4FF] text-[10px] font-bold tracking-[0.2em] uppercase">
              <CalendarCheck size={10} />
              Agendamiento rápido
            </span>
            <h2 className="text-[#F1F5F9] text-2xl sm:text-3xl font-black">
              ¿Qué necesitas hoy?
            </h2>
            <p className="text-[#8B9DB5] text-sm mt-1">Selecciona un servicio y agendamos en 2 minutos.</p>
          </div>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00D4FF] hover:text-[#F1F5F9] transition-colors group shrink-0"
          >
            Ver todos los servicios
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Service tiles */}
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {SERVICES.map((svc) => {
            const Icon = svc.icon
            return (
              <motion.div key={svc.label} variants={item} transition={{ duration: 0.4, ease: 'easeOut' }}>
                <Link
                  href={`/agendar?servicio=${encodeURIComponent(svc.query)}`}
                  className="group relative flex flex-col justify-end rounded-sm overflow-hidden border border-white/8 hover:border-[#00D4FF]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] h-52"
                >
                  {/* Photo */}
                  <Image
                    src={svc.image}
                    alt={svc.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    quality={65}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DARK}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020307]/95 via-[#020307]/50 to-[#020307]/10" />

                  {/* Content */}
                  <div className="relative z-10 p-5">
                    <div
                      className="w-9 h-9 rounded-sm flex items-center justify-center mb-3"
                      style={{ background: `${svc.accent}18`, border: `1px solid ${svc.accent}35` }}
                    >
                      <Icon size={17} style={{ color: svc.accent }} strokeWidth={1.75} />
                    </div>
                    <div className="text-sm font-bold text-[#F1F5F9] mb-0.5">{svc.label}</div>
                    <div className="text-[11px] text-[#8B9DB5] leading-relaxed mb-3">{svc.desc}</div>
                    <div className="flex items-center gap-1 text-[11px] font-bold tracking-wide" style={{ color: svc.accent }}>
                      Agendar
                      <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
