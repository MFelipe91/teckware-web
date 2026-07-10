'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Search, RefreshCw, Wrench, Cpu, Package, ArrowRight, Briefcase,
  HardDrive, Zap, Gamepad2, MapPin, Receipt,
} from 'lucide-react'
import { SERVICIOS, IVA_NOTA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations'
import { BLUR_DARK } from '@/lib/imageBlur'

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'search': Search,
  'refresh-cw': RefreshCw,
  'tool': Wrench,
  'briefcase': Briefcase,
  'cpu': Cpu,
  'package': Package,
  'hard-drive': HardDrive,
  'zap': Zap,
  'gamepad': Gamepad2,
  'map-pin': MapPin,
}

const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  diagnostico: {
    src: '/images/pexels-zeleboba-20860011.jpg',
    alt: 'Técnico reparando MacBook con destornillador — Diagnóstico TECKWARE',
  },
  'mantencion-logica': {
    src: '/images/daniel-shapiro-WROdXvr9omQ-unsplash.jpg',
    alt: 'Motherboard laptop con slot M.2 — Mantención Lógica y Formateo',
  },
  'mantencion-full': {
    src: '/images/pexels-anete-lusina-31854227.jpg',
    alt: 'Limpieza de PC con soplador de aire — Mantención Full TECKWARE',
  },
  'recuperacion-datos': {
    src: '/images/pexels-zeleboba-19892557.jpg',
    alt: 'Interior notebook con Samsung 990 PRO M.2 — Recuperación de Datos',
  },
  'mantencion-gpu': {
    src: '/images/pexels-david-bares-42311-424436.jpg',
    alt: 'NZXT Kraken RGB + MSI GPU + ROG — Mantención GPU TECKWARE',
  },
  'armado-estandar': {
    src: '/images/pexels-muhammad-faheem-hayat-2157171429-38181602.jpg',
    alt: 'PC Gamer en gabinete de vidrio con GeForce RTX — Armado PC Gamer TECKWARE',
  },
}

const FEATURED = SERVICIOS.filter((s) => s.featured)

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
          {FEATURED.map((servicio) => {
            const Icon = ICONS[servicio.icono] ?? Package
            const image = SERVICE_IMAGES[servicio.id]
            const waLink = typeof WA[servicio.whatsappKey as keyof typeof WA] === 'function'
              ? (WA[servicio.whatsappKey as keyof typeof WA] as () => string)()
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={72}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_DARK}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent" />
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

        {/* IVA nota */}
        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-[#475569]">
          <Receipt size={13} className="text-[#475569]" />
          <span>{IVA_NOTA}</span>
        </div>

        <div className="text-center mt-6">
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
