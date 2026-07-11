import type { Metadata } from 'next'
import Image from 'next/image'
import { BLUR_DARK } from '@/lib/imageBlur'
import {
  ShieldAlert, Lock, GraduationCap, FileCheck2, AlertTriangle, Activity,
  ArrowRight, CheckCircle2, Eye, UserX, Database, Wifi,
} from 'lucide-react'
import { CIBER_SERVICIOS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Ciberseguridad para Empresas',
  description:
    'Auditorías de ciberseguridad, hardening de sistemas, capacitación y respuesta a incidentes para PYMEs y empresas en Chile. La Serena y región.',
}

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'shield-alert': ShieldAlert,
  'lock': Lock,
  'graduation-cap': GraduationCap,
  'file-shield': FileCheck2,
  'alert-triangle': AlertTriangle,
  'activity': Activity,
}

const BADGE_COLORS: Record<string, string> = {
  'Recomendado PYMEs': 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30',
  'Urgente': 'bg-red-500/15 text-red-400 border-red-500/30',
}

const AMENAZAS = [
  {
    icono: UserX,
    titulo: 'Phishing & Ingeniería Social',
    descripcion: 'El 90% de los ataques comienzan con un correo o mensaje engañoso. ¿Tu equipo sabría reconocerlo?',
  },
  {
    icono: Database,
    titulo: 'Ransomware',
    descripcion: 'Cifrado malicioso de datos que paraliza empresas. Sin backups correctos, la recuperación es imposible.',
  },
  {
    icono: Eye,
    titulo: 'Acceso No Autorizado',
    descripcion: 'Contraseñas débiles o reutilizadas exponen cuentas críticas. Una sola filtración puede costarte todo.',
  },
  {
    icono: Wifi,
    titulo: 'Redes Inseguras',
    descripcion: 'Routers sin configurar, WiFi abierta y equipos sin segmentar son puertas de entrada invisibles.',
  },
]

const PARA_QUIEN = [
  { label: 'PYMEs (1–50 empleados)', desc: 'Plan base de auditoría + hardening + capacitación.' },
  { label: 'Empresas medianas', desc: 'Auditoría avanzada + políticas formales + monitoreo.' },
  { label: 'Comercios y locales', desc: 'Hardening de terminales y protección de datos de clientes.' },
  { label: 'Profesionales independientes', desc: 'Protección personal y de datos de clientes.' },
]

export default function CiberseguridadPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">

      {/* Hero */}
      <section className="relative bg-[#03040A] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/devia.jpg"
            alt="Pantalla de código — Ciberseguridad TECKWARE"
            fill
            className="object-cover object-center opacity-15"
            priority
            quality={55}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DARK}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03040A]/70 via-[#03040A]/50 to-[#03040A]" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="glow-cyan w-96 h-96 -top-32 right-1/4 opacity-20" />
        <div className="glow-purple w-64 h-64 bottom-0 left-0 opacity-18" />
        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest uppercase text-[#00D4FF] border border-[#00D4FF]/25 rounded-full bg-[#00D4FF]/8">
              Ciberseguridad
            </span>
            <h1 className="text-[#F1F5F9] mb-6">
              Tu empresa protegida{' '}
              <span className="gradient-text">desde adentro.</span>
            </h1>
            <p className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-2xl">
              Las PYMEs son el blanco más frecuente de ciberataques en Latinoamérica — no por ser
              grandes, sino por estar desprotegidas. Nosotros cerramos esas brechas.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={WA.ciberseguridad()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors min-h-[48px]"
              >
                Solicitar auditoría
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <a
                href="#servicios"
                className="flex items-center gap-2 px-6 py-3 border border-white/15 text-[#94A3B8] font-medium rounded-xl hover:border-white/30 hover:text-[#F1F5F9] transition-all min-h-[48px]"
              >
                Ver servicios
              </a>
            </div>

            {/* Stats rápidos */}
            <div className="mt-12 flex flex-wrap gap-8">
              {[
                { valor: '43%', label: 'de ciberataques apuntan a PYMEs' },
                { valor: '200 días', label: 'tarda en promedio detectar una brecha' },
                { valor: '$4.5M USD', label: 'costo promedio de una filtración de datos' },
              ].map(({ valor, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-[#00D4FF] font-mono">{valor}</div>
                  <div className="text-xs text-[#475569] mt-0.5 max-w-[140px]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Amenazas comunes */}
      <section className="bg-[#0D1120] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#F1F5F9] mb-3">Las amenazas que ignoramos</h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">
              Hasta que ocurren. Y cuando ocurren, el daño ya está hecho.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AMENAZAS.map(({ icono: Icon, titulo, descripcion }) => (
              <div key={titulo} className="glass-card rounded-2xl p-6 border border-red-500/15 bg-red-950/10">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                  <Icon size={20} className="text-red-400" />
                </div>
                <h3 className="text-base font-bold text-[#F1F5F9] mb-2">{titulo}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-12">
          <h2 className="text-[#F1F5F9] mb-3">Servicios de ciberseguridad</h2>
          <p className="text-[#94A3B8] max-w-xl">
            Soluciones prácticas adaptadas al tamaño y presupuesto de tu organización.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CIBER_SERVICIOS.map((s) => {
            const Icon = ICONS[s.icono] ?? ShieldAlert
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
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                    <Icon size={22} className="text-[#00D4FF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#F1F5F9] mb-2">{s.nombre}</h3>
                    <p className="text-sm text-[#94A3B8] mb-5 leading-relaxed">{s.descripcion}</p>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <span className="text-base font-bold text-[#00D4FF]">{s.precio}</span>
                        <span className="ml-2 text-xs text-[#475569]">{s.tiempo}</span>
                      </div>
                      <a
                        href={WA.ciberseguridad(s.nombre)}
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

      {/* ¿Para quién? */}
      <section className="bg-[#0D1120] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[#F1F5F9] mb-4">¿Para quién es este servicio?</h2>
              <p className="text-[#94A3B8] mb-8 leading-relaxed">
                No necesitas ser una gran empresa para tener buenas prácticas de seguridad.
                Trabajamos con organizaciones de todos los tamaños, adaptando el alcance a tu realidad.
              </p>
              <div className="space-y-4">
                {PARA_QUIEN.map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#00D4FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-semibold text-[#F1F5F9]">{label}</span>
                      <span className="text-sm text-[#94A3B8]"> — {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 border border-[#00D4FF]/20">
              <h3 className="text-lg font-bold text-[#F1F5F9] mb-6">
                ¿Qué tan expuesta está tu empresa?
              </h3>
              <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
                Te hacemos una evaluación gratuita de 15 minutos para identificar los riesgos
                más críticos. Sin compromiso.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Revisión de contraseñas y cuentas',
                  'Estado de actualizaciones',
                  'Exposición de red',
                  'Prácticas del equipo',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={WA.ciberseguridad('Evaluación gratuita')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors min-h-[48px]"
              >
                Quiero mi evaluación gratuita
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Credenciales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-[#F1F5F9] mb-3">Respaldo profesional</h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            No improvisamos. Formación certificada y práctica real.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              titulo: 'Google Cybersecurity Certificate',
              org: 'Google / Coursera',
              desc: 'Fundamentos de ciberseguridad, SIEM, IDS y respuesta a incidentes.',
            },
            {
              titulo: 'Laboratorios Kali Linux',
              org: 'Práctica técnica',
              desc: 'Análisis de vulnerabilidades, pentesting básico y herramientas ofensivas/defensivas.',
            },
            {
              titulo: 'Ingeniería Informática',
              org: 'Formación universitaria',
              desc: 'Base sólida en redes, sistemas operativos y arquitectura de seguridad.',
            },
          ].map(({ titulo, org, desc }) => (
            <div key={titulo} className="glass-card rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 mx-auto mb-4">
                <CheckCircle2 size={20} className="text-[#00D4FF]" />
              </div>
              <div className="text-xs text-[#475569] font-semibold tracking-wider uppercase mb-1">{org}</div>
              <h3 className="text-sm font-bold text-[#F1F5F9] mb-2">{titulo}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative bg-[#03040A] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="glow-cyan w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-[#F1F5F9] mb-4">
            No esperes a que pase algo.
          </h2>
          <p className="text-[#94A3B8] mb-8 text-lg">
            La mayoría de las empresas actúa después de un incidente.
            Las que actúan antes, no lo sufren.
          </p>
          <a
            href={WA.ciberseguridad()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors text-lg min-h-[56px]"
          >
            Proteger mi empresa ahora
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </div>
      </section>

    </div>
  )
}
