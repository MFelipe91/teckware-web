import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, RefreshCw, Wrench, Cpu, Package, ArrowRight,
  Laptop, Monitor, Gamepad2, Tablet, Apple, Briefcase,
  HardDrive, Zap, MapPin, Receipt,
} from 'lucide-react'
import { SERVICIOS, SERVICIOS_ADICIONALES, EQUIPOS, IVA_NOTA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { BLUR_DARK } from '@/lib/imageBlur'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Diagnóstico, formateo, mantención física, GPU, consolas y armado PC Gamer en La Serena. Precios con IVA incluido. Se emite boleta.',
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'search': Search,
  'refresh-cw': RefreshCw,
  'tool': Wrench,
  'cpu': Cpu,
  'package': Package,
  'briefcase': Briefcase,
  'hard-drive': HardDrive,
  'zap': Zap,
  'gamepad': Gamepad2,
  'map-pin': MapPin,
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
      <section className="relative bg-[#020307] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Foto de fondo — limpieza de fans PC */}
        <div className="absolute inset-0">
          <Image
            src="/images/pexels-anete-lusina-31854230.jpg"
            alt="Técnico limpiando fans de PC — Servicios TECKWARE"
            fill
            className="object-cover object-center opacity-10"
            priority
            quality={50}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DARK}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020307]/80 via-[#020307]/60 to-[#020307]" />
        </div>
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="glow-cyan w-80 h-80 -top-20 right-0 opacity-30" />
        <div className="glow-red w-64 h-64 bottom-0 left-0 opacity-30" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #E61E32 30%, #00D4FF 70%, transparent)' }}
        />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] uppercase text-[#00D4FF] border border-[#00D4FF]/20 rounded-sm bg-[#00D4FF]/6">
            Servicios
          </span>
          <h1 className="text-[#F1F5F9] mb-4">
            Todo lo que{' '}
            <span className="gradient-text">reparamos</span>
          </h1>
          <p className="text-[#8B9DB5] max-w-xl mx-auto">
            Precios fijos y transparentes. Sin sorpresas al final.
          </p>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICIOS.map((servicio) => {
            const Icon = ICONS[servicio.icono] ?? Package
            const waLink = typeof WA[servicio.whatsappKey as keyof typeof WA] === 'function'
              ? (WA[servicio.whatsappKey as keyof typeof WA] as () => string)()
              : WA.servicio(servicio.nombre)
            return (
              <div
                key={servicio.id}
                className="glass-card rounded-sm p-7 border border-white/8 card-hover"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-sm bg-[#00D4FF]/8 border border-[#00D4FF]/20">
                    <Icon size={22} className="text-[#00D4FF]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#F1F5F9] mb-2 leading-snug">{servicio.nombre}</h2>
                    <p className="text-sm text-[#8B9DB5] mb-5 leading-relaxed">{servicio.descripcion}</p>
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
                        className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#020307] text-sm font-extrabold rounded-sm hover:bg-[#00B8D9] transition-colors min-h-[40px] shadow-[0_0_16px_rgba(0,212,255,0.2)]"
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

        {/* IVA nota */}
        <div className="flex items-center justify-center gap-2 mt-10 text-xs text-[#475569]">
          <Receipt size={13} />
          <span>{IVA_NOTA}</span>
        </div>
      </section>

      {/* Tech line separator */}
      <div className="tech-line mx-8" />

      {/* Servicios adicionales */}
      <section className="bg-[#050810] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[#F1F5F9] mb-2">Servicios adicionales</h2>
          <p className="text-[#8B9DB5] mb-10">Precio a cotizar según requerimiento.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICIOS_ADICIONALES.map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 px-4 py-3 rounded-sm bg-white/[0.03] border border-white/8 hover:border-[#00D4FF]/20 transition-colors"
              >
                <span className="w-1 h-4 rounded-full bg-[#E61E32]/70 shrink-0" />
                <span className="text-sm text-[#8B9DB5]">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D4FF] text-[#020307] font-extrabold rounded-sm hover:bg-[#00B8D9] transition-colors min-h-[48px] shadow-[0_0_20px_rgba(0,212,255,0.2)]"
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
        <p className="text-[#8B9DB5] mb-10">Si tu equipo no está aquí, escríbenos igual.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {EQUIPOS.map((equipo) => {
            const Icon = EQUIPO_ICONS[equipo.icono] ?? Monitor
            return (
              <div
                key={equipo.nombre}
                className="flex flex-col items-center gap-3 p-5 rounded-sm bg-white/[0.03] border border-white/8 hover:border-[#00D4FF]/25 hover:bg-[#00D4FF]/4 transition-all"
              >
                <Icon size={28} className="text-[#00D4FF]" />
                <span className="text-xs font-medium text-[#8B9DB5] text-center">{equipo.nombre}</span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
