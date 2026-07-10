import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Search, RefreshCw, Wrench, Cpu, Package, ArrowRight,
  Laptop, Monitor, Gamepad2, Tablet, Apple, Briefcase
} from 'lucide-react'
import { SERVICIOS, SERVICIOS_ADICIONALES, EQUIPOS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Diagnóstico, formateo, mantenimiento físico y armado de PC Gamer en La Serena. Precios fijos desde $25.000.',
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'search': Search,
  'refresh-cw': RefreshCw,
  'tool': Wrench,
  'cpu': Cpu,
  'package': Package,
  'briefcase': Briefcase,
}

const EQUIPO_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'laptop': Laptop,
  'apple': Apple,
  'monitor': Monitor,
  'monitor-smartphone': Monitor,
  'gamepad-2': Gamepad2,
  'tablet-smartphone': Tablet,
}

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">
      {/* Header */}
      <section className="relative bg-[#03040A] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="glow-cyan w-80 h-80 -top-20 right-0 opacity-40" />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-[#00D4FF] border border-[#00D4FF]/25 rounded-full bg-[#00D4FF]/8">
            Servicios
          </span>
          <h1 className="text-[#F1F5F9] mb-4">
            Todo lo que{' '}
            <span className="gradient-text">reparamos</span>
          </h1>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Precios fijos y transparentes. Sin sorpresas al final.
          </p>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICIOS.map((servicio) => {
            const Icon = ICONS[servicio.icono] ?? Package
            const waLink = WA.servicio(servicio.nombre)
            return (
              <div
                key={servicio.id}
                className="glass-card rounded-2xl p-7 border border-white/10 card-hover"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                    <Icon size={22} className="text-[#00D4FF]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#F1F5F9] mb-2">{servicio.nombre}</h2>
                    <p className="text-sm text-[#94A3B8] mb-4 leading-relaxed">{servicio.descripcion}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        {servicio.precio === 'A cotizar' ? (
                          <span className="text-base font-bold text-[#A855F7]">A cotizar</span>
                        ) : (
                          <span className="price text-2xl font-black text-[#00D4FF]">{servicio.precio}</span>
                        )}
                        <span className="ml-2 text-xs text-[#475569]">{servicio.tiempo}</span>
                      </div>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#03040A] text-sm font-bold rounded-lg hover:bg-[#00A8CC] transition-colors min-h-[40px]"
                      >
                        Solicitar
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Servicios adicionales */}
      <section className="bg-[#0D1120] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[#F1F5F9] mb-2">Servicios adicionales</h2>
          <p className="text-[#94A3B8] mb-10">Precio a cotizar según requerimiento.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICIOS_ADICIONALES.map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shrink-0" />
                <span className="text-sm text-[#94A3B8]">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors min-h-[48px]"
            >
              Consultar precio
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Equipos atendidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-[#F1F5F9] mb-2">Equipos que atendemos</h2>
        <p className="text-[#94A3B8] mb-10">Si tu equipo no está aquí, escríbenos igual.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {EQUIPOS.map((equipo) => {
            const Icon = EQUIPO_ICONS[equipo.icono] ?? Monitor
            return (
              <div
                key={equipo.nombre}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00D4FF]/30 transition-colors"
              >
                <Icon size={28} className="text-[#00D4FF]" />
                <span className="text-xs font-medium text-[#94A3B8] text-center">{equipo.nombre}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
