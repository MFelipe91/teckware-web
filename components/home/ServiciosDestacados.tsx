'use client'

import Link from 'next/link'
import Image from 'next/image'
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

const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  diagnostico: {
    src: '/images/pexels-bertellifotografia-34552805.jpg',
    alt: 'Monitor de temperatura NZXT — Diagnóstico PC',
  },
  formateo: {
    src: '/images/samsung-memory-uevjOXJQzmU-unsplash.jpg',
    alt: 'Instalación SSD Samsung en notebook — Formateo limpio',
  },
  mantenimiento: {
    src: '/images/pexels-elias-gamez-2002621-10558600.jpg',
    alt: 'Aplicando pasta térmica en laptop — Mantenimiento físico',
  },
  armado: {
    src: '/images/martin-katler-7wCxlBfGMdk-unsplash.jpg',
    alt: 'Componentes Intel i9, MSI GPU y HyperX RAM — Armado PC Gamer',
  },
  'cotizacion-build': {
    src: '/images/onur-binay-z3MP5DDiEME-unsplash.jpg',
    alt: 'PC Gamer RTX TUF Gaming build completo — Cotización a medida',
  },
  workstation: {
    src: '/images/fotis-fotopoulos-DuHKoV44prg-unsplash.jpg',
    alt: 'Workstation dual monitor con código — Servicio empresarial',
  },
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
            const image = SERVICE_IMAGES[servicio.id]
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
                className="group relative glass-card rounded-2xl overflow-hidden border border-white/10 card-hover flex flex-col"
              >
                {/* Card image */}
                {image && (
                  <div className="relative h-44 overflow-hidden shrink-0">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Bottom fade so the image bleeds into card body */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
                    {/* Icon badge over image */}
                    <div className="absolute bottom-3 left-4 w-9 h-9 flex items-center justify-center rounded-xl bg-[#03040A]/80 border border-[#00D4FF]/30 backdrop-blur-sm">
                      <Icon size={17} className="text-[#00D4FF]" />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#F1F5F9] mb-2 leading-snug">
                    {servicio.nombre}
                  </h3>
                  <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed flex-1">
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
