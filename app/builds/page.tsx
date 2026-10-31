import type { Metadata } from 'next'
import Image from 'next/image'
import { BLUR_DARK } from '@/lib/imageBlur'
import { ArrowRight, Cpu, MonitorPlay, MemoryStick, HardDrive, CircuitBoard, Zap, Wind, Box, CheckCircle2, XCircle, Gamepad2 } from 'lucide-react'
import { getBuilds } from '@/lib/builds'
import { YoutubeEmbed } from '@/components/builds/YoutubeEmbed'
import { WA } from '@/lib/whatsapp'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

export const metadata: Metadata = {
  title: 'PC Gamer a Pedido',
  description: 'Builds de PC Gamer armados por TECKWARE en La Serena. Ryzen, Intel, RTX, RX — specs completas, rendimiento estimado y precios en pesos chilenos.',
  alternates: { canonical: '/builds' },
}

const TAG_STYLES: Record<string, string> = {
  cyan:   'bg-brand/15 text-brand-bright border-brand-bright/30',
  purple: 'bg-gamer/15 text-gamer-bright border-gamer/30',
  green:  'bg-success/15 text-success border-success/30',
  orange: 'bg-warning/15 text-warning border-warning/30',
}

const SPEC_ICONS = {
  cpu:         Cpu,
  gpu:         MonitorPlay,
  ram:         MemoryStick,
  storage:     HardDrive,
  motherboard: CircuitBoard,
  psu:         Zap,
  cooling:     Wind,
  case:        Box,
}

const SPEC_LABELS: Record<string, string> = {
  cpu:         'Procesador',
  gpu:         'Tarjeta de video',
  ram:         'Memoria RAM',
  storage:     'Almacenamiento',
  motherboard: 'Placa madre',
  psu:         'Fuente de poder',
  cooling:     'Refrigeración',
  case:        'Gabinete',
}

const GAMES = [
  { key: 'fortnite',  label: 'Fortnite'       },
  { key: 'warzone',   label: 'Warzone'         },
  { key: 'valorant',  label: 'Valorant'        },
  { key: 'cyberpunk', label: 'Cyberpunk 2077'  },
  { key: 'gta5',      label: 'GTA V'           },
]

function formatCLP(precio: number): string {
  return `$${precio.toLocaleString('es-CL')}`
}

export const revalidate = 30

export default async function BuildsPage() {
  const builds = await getBuilds()

  return (
    <div className="min-h-screen bg-ink-900">

      {/* Header */}
      <section className="relative bg-ink-950 pt-44 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background image — RGB Corsair build interior */}
        <div className="absolute inset-0">
          <Image
            src="/images/revendo-TN0dhAnylPI-unsplash.jpg"
            alt="PC Gamer GIGABYTE Z790 con RTX y RAM XPG RGB — TECKWARE Builds"
            fill
            className="object-cover object-center opacity-22"
            priority
            quality={60}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DARK}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/50 to-ink-950" />
        </div>
        <CircuitBackground variant="hex-mesh" palette="gamer" density={1} opacity={0.7} />
        <div className="glow-gamer w-96 h-96 -top-32 right-0 opacity-25" />
        <div className="glow-brand w-64 h-64 bottom-0 left-0 opacity-15" />
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-gamer/25 bg-gamer/8 text-gamer-bright text-xs font-semibold tracking-widest uppercase">
            <Gamepad2 size={12} />
            PC Gamer a Pedido
          </span>
          <h1 className="text-fg mb-4 max-w-2xl">
            Builds armados con{' '}
            <span className="gradient-text">criterio y precisión.</span>
          </h1>
          <p className="text-fg-muted text-lg max-w-2xl leading-relaxed mb-8">
            Cada PC Gamer pasa por pruebas de estrés, cable management profesional
            y verificación de temperaturas. Garantía de 30 días en el armado.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Cable management incluido', 'Pruebas de estrés','Pasta térmica premium', 'Garantía 30 días'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-fg-muted border border-white/10 px-3 py-1.5 rounded-full bg-white/3">
                <CheckCircle2 size={12} className="text-gamer-bright" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Builds grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {builds.length === 0 ? (
          <div className="text-center py-20 text-fg-subtle">Próximamente builds disponibles. Consulta por WhatsApp.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {builds.map((build) => (
              <article key={build.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">

                {/* YouTube / Benchmark */}
                <YoutubeEmbed videoId={build.youtubeId} title={build.nombre} />

                <div className="p-7 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 text-xs font-bold tracking-widest uppercase rounded-full border ${TAG_STYLES[build.tagColor] ?? TAG_STYLES.cyan}`}>
                          {build.tag}
                        </span>
                        {build.disponible ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            Disponible
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-fg-subtle">
                            <XCircle size={10} />
                            Bajo pedido
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-black text-fg tracking-tight">{build.nombre}</h2>
                      <p className="text-sm text-fg-muted mt-1 leading-relaxed">{build.descripcion}</p>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <div className="text-3xl font-black text-fg price">{formatCLP(build.precio)}</div>
                      <div className="text-xs text-fg-subtle">Armado incluido</div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="mb-5">
                    <div className="text-xs font-bold text-fg-subtle tracking-widest uppercase mb-3">Especificaciones completas</div>
                    <div className="grid grid-cols-1 gap-0">
                      {(Object.keys(SPEC_ICONS) as Array<keyof typeof SPEC_ICONS>).map((key) => {
                        const Icon = SPEC_ICONS[key]
                        const value = build.specs[key as keyof typeof build.specs]
                        if (!value) return null
                        return (
                          <div key={key} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                            <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-white/5">
                              <Icon size={13} className="text-brand-bright" />
                            </div>
                            <span className="text-xs text-fg-subtle w-24 shrink-0">{SPEC_LABELS[key]}</span>
                            <span className="text-xs font-semibold text-fg flex-1">{value}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* FPS */}
                  {Object.values(build.fps).some(Boolean) && (
                    <div className="mb-6">
                      <div className="text-xs font-bold text-fg-subtle tracking-widest uppercase mb-3">
                        Rendimiento estimado — 1080p High/Ultra
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {GAMES.map(({ key, label }) => {
                          const fps = build.fps[key as keyof typeof build.fps]
                          if (!fps) return null
                          return (
                            <div key={key} className="bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2.5">
                              <div className="text-xs text-fg-subtle mb-0.5">{label}</div>
                              <div className="text-sm font-black text-brand-bright tabular-nums">{fps}</div>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-xs text-fg-subtle mt-2">* FPS estimados según benchmarks públicos. Pueden variar.</p>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="flex gap-3 mt-auto pt-2">
                    <a
                      href={WA.build(build.nombre)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors min-h-[48px]"
                    >
                      {build.disponible ? 'Consultar' : 'Hacer pedido'}
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </a>
                    <a
                      href={WA.general()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 border border-white/15 text-fg-muted font-medium rounded-xl hover:border-white/30 hover:text-fg transition-all min-h-[48px] flex items-center text-sm"
                    >
                      Personalizar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA personalizado */}
      <section className="bg-ink-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-fg mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-fg-muted mb-8 text-lg">
            Diseñamos tu build según tu presupuesto y uso. Cotizamos gratis.
          </p>
          <a
            href={WA.servicio('Build PC Gamer personalizado')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors text-lg min-h-[56px]"
          >
            Cotizar build personalizado
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </div>
      </section>

    </div>
  )
}
