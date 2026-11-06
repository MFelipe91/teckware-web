import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Laptop, Monitor, Gamepad2, Tablet, Apple, Receipt, Check, Info, ShieldCheck,
} from 'lucide-react'
import {
  SERVICIOS_ADICIONALES, EQUIPOS, IVA_NOTA,
  CONDICIONES_GENERALES, SERVICIO_CONDICIONES,
} from '@/lib/constants'
import { getServices } from '@/lib/services'
import { WA } from '@/lib/whatsapp'
import { BLUR_DARK } from '@/lib/imageBlur'
import { ogPagina } from '@/lib/seo'

// Revalida cada 30s para reflejar cambios de precios/servicios del panel admin
export const revalidate = 30

export const metadata: Metadata = {
  title: 'Servicios y Precios',
  description:
    'Diagnóstico, formateo, mantención física, GPU, consolas y armado PC Gamer en La Serena. Precios con IVA incluido. Se emite boleta.',
  alternates: { canonical: '/servicios' },
  openGraph: ogPagina('/servicios'),
}

const EQUIPO_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'laptop': Laptop,
  'apple': Apple,
  'monitor': Monitor,
  'monitor-smartphone': Monitor,
  'gamepad-2': Gamepad2,
  'tablet-smartphone': Tablet,
}

// Foto por servicio (por id). Fallback si alguno no tiene.
const SERVICE_IMAGES: Record<string, string> = {
  'diagnostico': '/images/diagnostico_tester.jpg',
  'mantencion-logica': '/images/Formateo_windows11.jpg',
  'mantencion-full': '/images/mantenimiento.jpg',
  'recuperacion-datos': '/images/recuperacion-datos.jpg',
  'mantencion-gpu': '/images/GPU001.jpg',
  'armado-estandar': '/images/pcgamer01.jpg',
  'armado-alta-gama': '/images/pc-montaje.jpg',
  'consola-ps4': '/images/ps5-consola.jpg',
  'consola-ps5': '/images/ps5-metal-liquido.jpg',
  'upgrade': '/images/upgraderamssd.jpg',
  'domicilio': '/images/mantencionpc2.jpg',
  'workstation': '/images/developer01.jpg',
}
const FALLBACK_IMG = '/images/hardware-amd.jpg'

export default async function ServiciosPage() {
  const SERVICIOS = await getServices()
  return (
    <div className="min-h-svh bg-ink-900">
      {/* Header */}
      <section className="relative bg-ink-950 pt-32 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[76rem] mx-auto">
          <h1 className="mb-4">
            Servicios y precios en La Serena y Coquimbo
          </h1>
          <p className="text-fg-muted max-w-xl">
            Precios con IVA incluido. Sabes el costo antes de que empecemos.
          </p>
        </div>
      </section>

      {/* Servicios principales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="border-t border-white/10">
          {SERVICIOS.map((servicio) => {
            const img = SERVICE_IMAGES[servicio.id] ?? FALLBACK_IMG
            const cond = SERVICIO_CONDICIONES[servicio.id]
            const waLink = typeof WA[servicio.whatsappKey as keyof typeof WA] === 'function'
              ? (WA[servicio.whatsappKey as keyof typeof WA] as () => string)()
              : WA.servicio(servicio.nombre)
            return (
              <article
                key={servicio.id}
                className="py-7 border-b border-white/10 grid gap-5 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_200px] lg:gap-10"
              >
                <div className="relative h-44 md:h-36 overflow-hidden rounded-sm">
                  <Image
                    src={img}
                    alt={`${servicio.nombre} — TECKWARE La Serena`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 240px, (min-width: 768px) 200px, 100vw"
                    quality={72}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DARK}
                  />
                  </div>

                <div className="min-w-0">
                  <h2 className="text-2xl text-fg mb-2">{servicio.nombre}</h2>
                  <p className="text-sm text-fg-muted mb-4 leading-relaxed">{servicio.descripcion}</p>

                  {/* Qué incluye */}
                  {cond?.incluye && (
                    <ul className="space-y-1.5 mb-4">
                      {cond.incluye.map((linea) => (
                        <li key={linea} className="flex items-start gap-2 text-sm text-fg-muted leading-snug">
                          <Check size={14} className="text-brand-bright shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{linea}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Nota / condición específica */}
                  {cond?.nota && (
                    <p className="flex items-start gap-2 text-sm text-fg-subtle leading-relaxed mb-5 pt-3 border-t border-white/5">
                      <Info size={13} className="text-fg-subtle shrink-0 mt-0.5" />
                      <span>{cond.nota}</span>
                    </p>
                  )}

                  </div>

                <div className="flex items-center justify-between gap-4 md:col-start-2 lg:col-start-3 lg:flex-col lg:items-end lg:justify-start">
                    <div className="lg:text-right">
                      {servicio.precio === 'A cotizar' ? (
                        <span className="price text-xl text-fg block">A cotizar</span>
                      ) : (
                        <span className="price text-2xl text-fg block">{servicio.precio}</span>
                      )}
                      <span className="text-sm text-fg-subtle">{servicio.tiempo}</span>
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primario"
                    >
                      Solicitar
                    </a>
                </div>
              </article>
            )
          })}
        </div>

        {/* Condiciones generales */}
        <div className="panel-corte mt-14 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={18} className="text-brand-bright" />
            <h2 className="text-base font-bold text-fg">Condiciones generales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {CONDICIONES_GENERALES.map((c) => (
              <div key={c} className="flex items-start gap-2.5 text-sm text-fg-muted leading-snug">
                <Check size={15} className="text-brand-bright shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* IVA nota */}
        <div className="flex items-center gap-2 mt-6 text-sm text-fg-subtle">
          <Receipt size={13} />
          <span>{IVA_NOTA}</span>
        </div>
      </section>

      {/* Tech line separator */}
      
      {/* Servicios adicionales */}
      <section className="relative bg-ink-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[76rem] mx-auto">
          <h2 className="text-fg mb-2">Servicios adicionales</h2>
          <p className="text-fg-muted mb-10">Precio a cotizar según requerimiento.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {SERVICIOS_ADICIONALES.map((s) => (
              <div key={s} className="flex items-baseline gap-3 text-fg-muted">
                <span className="hex" aria-hidden="true" />
                {s}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primario"
            >
              Consultar precio
            </a>
          </div>
        </div>
      </section>

      {/* Equipos atendidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div>
          <h2 className="text-fg mb-2">Equipos que atendemos</h2>
          <p className="text-fg-muted mb-10">Si tu equipo no está aquí, escríbenos igual.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5">
            {EQUIPOS.map((equipo) => {
              const Icon = EQUIPO_ICONS[equipo.icono] ?? Monitor
              return (
                <div
                  key={equipo.nombre}
                  className="flex items-center gap-3"
                >
                  <Icon size={20} className="text-brand-bright shrink-0" aria-hidden="true" />
                  <span className="text-sm text-fg-muted">{equipo.nombre}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
