import type { Metadata } from 'next'
import { ArrowRight, Cpu, MonitorPlay, MemoryStick, HardDrive, CircuitBoard, Zap, Wind, Box, CheckCircle2, XCircle } from 'lucide-react'
import { getBuilds } from '@/lib/builds'
import { YoutubeEmbed } from '@/components/builds/YoutubeEmbed'
import { WA } from '@/lib/whatsapp'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'PC Gamer a Pedido',
  description: 'Builds de PC Gamer armados por TECKWARE en La Serena. Ryzen, Intel, RTX, RX — specs completas, rendimiento estimado y precios en pesos chilenos.',
  alternates: { canonical: '/builds' },
  openGraph: ogPagina('/builds'),
}

const TAG_STYLES: Record<string, string> = {
  cyan:   'bg-brand/15 text-brand-bright border-brand-bright/30',
  purple: 'bg-brand/15 text-brand-bright border-brand-bright/30',
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
      <section className="relative bg-ink-950 pt-32 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[76rem] mx-auto">
          <h1 className="mb-4 max-w-2xl">
            Builds armados con{' '}
            criterio y precisión.
          </h1>
          <p className="text-fg-muted text-lg max-w-2xl leading-relaxed mb-8">
            Cada PC Gamer pasa por pruebas de estrés, cable management profesional
            y verificación de temperaturas. Garantía de 30 días en el armado.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Cable management incluido', 'Pruebas de estrés','Pasta térmica premium', 'Garantía 30 días'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-fg-muted border border-white/10 px-3 py-1.5 rounded-full bg-white/3">
                <CheckCircle2 size={12} className="text-brand-bright" />
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
              <article key={build.id} className="panel rounded-sm border border-white/10 overflow-hidden flex flex-col">

                {/* YouTube / Benchmark */}
                <YoutubeEmbed videoId={build.youtubeId} title={build.nombre} />

                <div className="p-7 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${TAG_STYLES[build.tagColor] ?? TAG_STYLES.cyan}`}>
                          {build.tag}
                        </span>
                        {build.disponible ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
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
                    <div className="text-xs font-bold text-fg-subtle mb-3">Especificaciones completas</div>
                    <div className="grid grid-cols-1 gap-0">
                      {(Object.keys(SPEC_ICONS) as Array<keyof typeof SPEC_ICONS>).map((key) => {
                        const Icon = SPEC_ICONS[key]
                        const value = build.specs[key as keyof typeof build.specs]
                        if (!value) return null
                        return (
                          <div key={key} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                            <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-sm bg-white/5">
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
                      <div className="text-xs font-bold text-fg-subtle mb-3">
                        Rendimiento estimado — 1080p High/Ultra
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {GAMES.map(({ key, label }) => {
                          const fps = build.fps[key as keyof typeof build.fps]
                          if (!fps) return null
                          return (
                            <div key={key} className="bg-white/[0.03] border border-white/8 rounded-sm px-3 py-2.5">
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
                      className="btn btn-primario flex-1"
                    >
                      {build.disponible ? 'Consultar' : 'Hacer pedido'}
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </a>
                    <a
                      href={WA.general()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secundario"
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
            className="btn btn-primario"
          >
            Cotizar build personalizado
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </div>
      </section>

    </div>
  )
}
