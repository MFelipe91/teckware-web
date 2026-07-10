import type { Metadata } from 'next'
import {
  Search, Layout, Building2, ClipboardCheck, Bot, Lightbulb,
  ArrowRight, CheckCircle2, Code2, Zap, Shield, BarChart3,
} from 'lucide-react'
import { WEB_QA_SERVICIOS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Consultoría Web & QA',
  description:
    'Desarrollo web profesional, auditorías de sitios y QA para empresas en Chile. Landing pages, sitios corporativos, testing manual y automatizado.',
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'search': Search,
  'layout': Layout,
  'building': Building2,
  'clipboard-check': ClipboardCheck,
  'bot': Bot,
  'lightbulb': Lightbulb,
}

const BADGE_COLORS: Record<string, string> = {
  'Más solicitado': 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30',
  'Nuevo': 'bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/30',
}

const DIFERENCIADORES = [
  {
    icono: Code2,
    titulo: 'Stack moderno',
    descripcion: 'Next.js, TypeScript, Tailwind — construimos rápido, escalable y con buenas prácticas.',
  },
  {
    icono: Zap,
    titulo: 'Performance primero',
    descripcion: 'Core Web Vitals optimizados. Tu sitio carga en menos de 2 segundos o lo revisamos.',
  },
  {
    icono: Shield,
    titulo: 'Seguridad incluida',
    descripcion: 'Security headers, sanitización de inputs y protección básica ante vulnerabilidades web.',
  },
  {
    icono: BarChart3,
    titulo: 'Entregables claros',
    descripcion: 'Informes ejecutivos y técnicos. Sabes exactamente qué encontramos y qué hacer.',
  },
]

const PROCESO_WEB = [
  { paso: '01', titulo: 'Briefing', desc: 'Reunión de 30 min por WhatsApp para entender tu proyecto, objetivos y plazos.' },
  { paso: '02', titulo: 'Propuesta', desc: 'Presupuesto detallado con alcance, entregables y cronograma en 24 horas.' },
  { paso: '03', titulo: 'Ejecución', desc: 'Desarrollo o auditoría con actualizaciones de avance cada 2 días.' },
  { paso: '04', titulo: 'Entrega', desc: 'Deploy en producción o informe final con soporte post-entrega de 15 días.' },
]

export default function WebQAPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">

      {/* Hero */}
      <section className="relative bg-[#03040A] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="glow-cyan w-96 h-96 -top-32 left-1/3 opacity-30" />
        <div className="glow-purple w-64 h-64 bottom-0 right-0 opacity-25" />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest uppercase text-[#A855F7] border border-[#A855F7]/25 rounded-full bg-[#A855F7]/8">
              Web & QA
            </span>
            <h1 className="text-[#F1F5F9] mb-6">
              Tu presencia web,{' '}
              <span className="gradient-text">hecha con criterio.</span>
            </h1>
            <p className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-2xl">
              Construimos sitios que convierten, auditamos los que ya tienes y aseguramos la calidad
              de tus aplicaciones con pruebas manuales y automatizadas.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={WA.webQA()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#A855F7] text-white font-bold rounded-xl hover:bg-[#9333EA] transition-colors min-h-[48px]"
              >
                Solicitar cotización
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <a
                href="#servicios"
                className="flex items-center gap-2 px-6 py-3 border border-white/15 text-[#94A3B8] font-medium rounded-xl hover:border-white/30 hover:text-[#F1F5F9] transition-all min-h-[48px]"
              >
                Ver servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12">
          <h2 className="text-[#F1F5F9] mb-3">Servicios disponibles</h2>
          <p className="text-[#94A3B8] max-w-xl">
            Desde una auditoría de una tarde hasta la construcción completa de tu plataforma digital.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WEB_QA_SERVICIOS.map((s) => {
            const Icon = ICONS[s.icono] ?? Code2
            return (
              <div
                key={s.id}
                className="relative glass-card rounded-2xl p-7 border border-white/10 card-hover"
              >
                {s.badge && (
                  <span className={`absolute top-5 right-5 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full border ${BADGE_COLORS[s.badge] ?? 'bg-white/10 text-[#94A3B8] border-white/20'}`}>
                    {s.badge}
                  </span>
                )}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20">
                    <Icon size={22} className="text-[#A855F7]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#F1F5F9] mb-2">{s.nombre}</h3>
                    <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed">{s.descripcion}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <span className="text-xl font-black text-[#A855F7]">{s.precio}</span>
                        <span className="ml-2 text-xs text-[#475569]">{s.tiempo}</span>
                      </div>
                      <a
                        href={WA.webQA(s.nombre)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#A855F7] text-white text-sm font-bold rounded-lg hover:bg-[#9333EA] transition-colors min-h-[40px]"
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

      {/* Diferenciadores */}
      <section className="bg-[#0D1120] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[#F1F5F9] mb-3">Cómo trabajamos</h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">
              Criterio técnico + comunicación directa + entregables concretos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIFERENCIADORES.map(({ icono: Icon, titulo, descripcion }) => (
              <div key={titulo} className="glass-card rounded-2xl p-6 border border-white/10">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 mb-4">
                  <Icon size={20} className="text-[#A855F7]" />
                </div>
                <h3 className="text-base font-bold text-[#F1F5F9] mb-2">{titulo}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-[#F1F5F9] mb-3">El proceso</h2>
          <p className="text-[#94A3B8]">Desde el primer mensaje hasta la entrega final.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESO_WEB.map(({ paso, titulo, desc }) => (
            <div key={paso} className="relative glass-card rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-black text-[#A855F7]/15 mb-3 font-mono">{paso}</div>
              <h3 className="text-base font-bold text-[#F1F5F9] mb-2">{titulo}</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Incluye */}
      <section className="bg-[#0D1120] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[#F1F5F9] mb-8 text-center">Todo proyecto incluye</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Comunicación directa por WhatsApp',
              'Actualizaciones de avance regulares',
              'Entregables documentados',
              'Código limpio y comentado',
              'Optimización SEO técnico base',
              'Responsive mobile-first',
              'Soporte post-entrega 15 días',
              'Sin costos ocultos',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10">
                <CheckCircle2 size={16} className="text-[#A855F7] shrink-0" />
                <span className="text-sm text-[#94A3B8]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="glow-purple w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-[#F1F5F9] mb-4">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-[#94A3B8] mb-8 text-lg">
            Cuéntanos qué necesitas. Respondemos con una propuesta en menos de 24 horas.
          </p>
          <a
            href={WA.webQA()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#A855F7] text-white font-bold rounded-xl hover:bg-[#9333EA] transition-colors text-lg min-h-[56px]"
          >
            Iniciar conversación
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </div>
      </section>

    </div>
  )
}
