import type { Metadata } from 'next'
import { Cpu, MemoryStick, HardDrive, Monitor, ArrowRight, Info } from 'lucide-react'
import { BUILDS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'PC Gamer',
  description:
    'Builds de PC Gamer armados a medida en La Serena. Ryzen, Intel, RTX, RX. Componentes verificados, cable management incluido.',
}

const ACCENT: Record<string, string> = {
  'tech-blue': '#2E86AB',
  'cyan': '#00D4FF',
  'purple': '#A855F7',
}

export default function BuildsPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">
      {/* Header */}
      <section className="relative bg-[#03040A] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="glow-purple w-80 h-80 -top-20 right-0 opacity-40" />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-[#A855F7] border border-[#A855F7]/25 rounded-full bg-[#A855F7]/8">
            PC Gamer
          </span>
          <h1 className="text-[#F1F5F9] mb-4">
            Builds armados{' '}
            <span className="gradient-text">a medida</span>
          </h1>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Stock limitado (~3 unidades). La mayoría son a pedido. Escríbenos y armamos el tuyo.
          </p>
        </div>
      </section>

      {/* Aviso */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-[#A855F7]/20 bg-[#A855F7]/5">
          <Info size={18} className="text-[#A855F7] shrink-0 mt-0.5" />
          <p className="text-sm text-[#94A3B8]">
            TECKWARE no compite con retail. Nuestro valor es el servicio técnico y el ensamblado profesional.
            Los precios dependen del stock actual — consulta antes de decidir.
          </p>
        </div>
      </div>

      {/* Builds grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BUILDS.map((build) => {
            const accent = ACCENT[build.color] ?? '#00D4FF'
            return (
              <div
                key={build.id}
                className="relative glass-card rounded-2xl p-7 border card-hover overflow-hidden"
                style={{ borderColor: `${accent}20` }}
              >
                {/* Tag */}
                <div
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mb-5"
                  style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                >
                  {build.tag}
                </div>

                <h2 className="text-xl font-black text-[#F1F5F9] mb-5">{build.nombre}</h2>

                {/* Specs */}
                <ul className="space-y-3 mb-7">
                  <li className="flex items-center gap-3 text-sm text-[#94A3B8]">
                    <Cpu size={15} style={{ color: accent }} />
                    <span><span className="text-[#F1F5F9] font-medium">CPU</span> {build.specs.cpu}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#94A3B8]">
                    <Monitor size={15} style={{ color: accent }} />
                    <span><span className="text-[#F1F5F9] font-medium">GPU</span> {build.specs.gpu}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#94A3B8]">
                    <MemoryStick size={15} style={{ color: accent }} />
                    <span><span className="text-[#F1F5F9] font-medium">RAM</span> {build.specs.ram}</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#94A3B8]">
                    <HardDrive size={15} style={{ color: accent }} />
                    <span><span className="text-[#F1F5F9] font-medium">SSD</span> {build.specs.storage}</span>
                  </li>
                </ul>

                {/* CTA */}
                <div className="space-y-3">
                  <p className="text-xs text-[#475569]">
                    {build.disponible ? 'Disponible — stock limitado' : 'A pedido'}
                  </p>
                  <a
                    href={WA.build(build.nombre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 font-bold rounded-xl transition-all min-h-[48px] text-sm"
                    style={{
                      background: `${accent}15`,
                      color: accent,
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    Consultar precio
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </a>
                </div>

                {/* Glow decorativo */}
                <div
                  className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: `${accent}08`, filter: 'blur(40px)' }}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Build a pedido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center p-12 rounded-3xl border border-white/10 bg-white/[0.02]">
          <h2 className="text-[#F1F5F9] mb-3">
            ¿No encontraste lo que buscas?
          </h2>
          <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">
            Dinos tu presupuesto y para qué usarás la PC. Te armamos el mejor build posible.
          </p>
          <a
            href={WA.servicio('Cotización Build PC Gamer a medida')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#A855F7] text-white font-bold rounded-xl hover:bg-[#9333EA] transition-colors min-h-[52px]"
          >
            Armar PC a medida
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </div>
      </section>
    </div>
  )
}
