'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wrench, Cpu, HardDrive, MonitorSmartphone, ArrowRight, CalendarCheck } from 'lucide-react'

const SERVICES = [
  {
    icon: Wrench,
    label: 'Reparación',
    desc: 'Notebook, PC, MacBook',
    query: 'Reparación de equipo',
    accent: '#00D4FF',
  },
  {
    icon: HardDrive,
    label: 'Formateo & Limpieza',
    desc: 'Windows limpio, 35.000',
    query: 'Formateo e instalación',
    accent: '#A855F7',
  },
  {
    icon: Cpu,
    label: 'Armado PC Gamer',
    desc: 'Desde 899.000 CLP',
    query: 'Armado PC Gamer',
    accent: '#00D4FF',
  },
  {
    icon: MonitorSmartphone,
    label: 'Diagnóstico',
    desc: 'Revisión electrónica',
    query: 'Diagnóstico / Revisión',
    accent: '#A855F7',
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
    <section className="bg-[#080B14] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/6 text-[#00D4FF] text-[10px] font-bold tracking-widest uppercase">
              <CalendarCheck size={10} />
              Agendamiento rápido
            </span>
            <h2 className="text-[#F1F5F9] text-2xl sm:text-3xl font-black">
              ¿Qué necesitas hoy?
            </h2>
            <p className="text-[#94A3B8] text-sm mt-1">Selecciona un servicio y agendamos en 2 minutos.</p>
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
                  className="group flex flex-col gap-4 p-6 glass-card rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${svc.accent}18`, border: `1px solid ${svc.accent}30` }}
                  >
                    <Icon size={20} style={{ color: svc.accent }} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#F1F5F9] mb-0.5">{svc.label}</div>
                    <div className="text-[11px] text-[#475569]">{svc.desc}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#94A3B8] group-hover:text-[#00D4FF] transition-colors">
                    Agendar
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
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
