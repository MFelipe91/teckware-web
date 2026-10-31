import type { Metadata } from 'next'
import { CIBER_SERVICIOS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { BandaCta } from '@/components/shared/BandaCta'
import { PageHeader } from '@/components/shared/PageHeader'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Ciberseguridad para Empresas',
  description:
    'Auditorías de ciberseguridad, hardening de sistemas, capacitación y respuesta a incidentes para PYMEs y empresas en Chile. La Serena y región.',
  alternates: { canonical: '/ciberseguridad' },
  openGraph: ogPagina('/ciberseguridad'),
}

const AMENAZAS = [
  { titulo: 'Phishing e ingeniería social', descripcion: 'Correos o mensajes engañosos que buscan claves o pagos. ¿Tu equipo sabría reconocerlos?' },
  { titulo: 'Ransomware', descripcion: 'Cifrado malicioso de datos que paraliza empresas. Sin respaldos correctos, recuperar la información es muy difícil.' },
  { titulo: 'Acceso no autorizado', descripcion: 'Contraseñas débiles o reutilizadas exponen cuentas críticas de la empresa.' },
  { titulo: 'Redes inseguras', descripcion: 'Routers sin configurar, WiFi abierta y equipos sin segmentar son puertas de entrada.' },
]

const PARA_QUIEN = [
  { label: 'PYMEs (1 a 50 empleados)', desc: 'Plan base de auditoría, hardening y capacitación.' },
  { label: 'Empresas medianas', desc: 'Auditoría avanzada, políticas formales y monitoreo.' },
  { label: 'Comercios y locales', desc: 'Hardening de terminales y protección de datos de clientes.' },
  { label: 'Profesionales independientes', desc: 'Protección personal y de datos de clientes.' },
]

const EVALUACION = ['Revisión de contraseñas y cuentas', 'Estado de actualizaciones', 'Exposición de red', 'Prácticas del equipo']

const CREDENCIALES = [
  { titulo: 'Google Cybersecurity Certificate', org: 'Google / Coursera', desc: 'Fundamentos de ciberseguridad, SIEM, IDS y respuesta a incidentes.' },
  { titulo: 'Laboratorios Kali Linux', org: 'Práctica técnica', desc: 'Análisis de vulnerabilidades, pentesting básico y herramientas ofensivas y defensivas.' },
  { titulo: 'Ingeniería Informática', org: 'Formación universitaria', desc: 'Base en redes, sistemas operativos y arquitectura de seguridad.' },
]

export default function CiberseguridadPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <PageHeader
        titulo="Ciberseguridad para pymes y empresas"
        bajada="Revisamos cómo está protegida tu empresa, cerramos las brechas que encontramos y capacitamos a tu equipo."
      >
        <a href={WA.ciberseguridad()} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full sm:w-auto">
          Solicitar auditoría
        </a>
      </PageHeader>

      <section className="bg-ink-800 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-[76rem] mx-auto grid gap-8 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 className="text-fg">Los riesgos más comunes</h2>
          <ul className="grid gap-x-10 sm:grid-cols-2 border-t border-white/10">
            {AMENAZAS.map(({ titulo, descripcion }) => (
              <li key={titulo} className="py-5 border-b border-white/10">
                <h3 className="text-[1.125rem] text-fg">{titulo}</h3>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-fg mb-8">Servicios</h2>
        <ul className="border-t border-white/10">
          {CIBER_SERVICIOS.map((s) => (
            <li key={s.id} className="py-5 border-b border-white/10 grid gap-x-10 gap-y-2 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_auto] lg:items-baseline">
              <h3 className="text-fg">{s.nombre}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                {s.descripcion} <span className="text-fg-subtle">Plazo: {s.tiempo}.</span>
              </p>
              <div className="flex items-baseline justify-between gap-6 lg:flex-col lg:items-end lg:gap-1">
                <span className="price text-fg whitespace-nowrap">{s.precio}</span>
                <a href={WA.ciberseguridad(s.nombre)} target="_blank" rel="noopener noreferrer" className="btn btn-terciario" aria-label={`Solicitar ${s.nombre}`}>
                  Solicitar
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-[76rem] mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <h2 className="text-fg mb-4">¿Para quién es este servicio?</h2>
            <p className="mb-6 max-w-2xl text-fg-muted leading-relaxed">
              Adaptamos el alcance al tamaño de tu organización.
            </p>
            <ul className="border-t border-white/10">
              {PARA_QUIEN.map(({ label, desc }) => (
                <li key={label} className="py-3.5 border-b border-white/10">
                  <span className="block font-display text-lg font-medium text-fg">{label}</span>
                  <span className="text-sm text-fg-muted">{desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel-corte p-7 sm:p-8 self-start">
            <h3 className="text-2xl text-fg">¿Qué tan expuesta está tu empresa?</h3>
            <p className="mt-3 mb-5 text-fg-muted leading-relaxed">
              Te hacemos una evaluación gratuita de 15 minutos para identificar los riesgos más críticos. Sin compromiso.
            </p>
            <ul className="space-y-2 mb-7">
              {EVALUACION.map((item) => (
                <li key={item} className="flex items-baseline gap-3 text-fg-muted">
                  <span className="hex" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <a href={WA.ciberseguridad('Evaluación gratuita')} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full">
              Pedir evaluación gratuita
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid gap-8 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <h2 className="text-fg">Respaldo profesional</h2>
        <ul className="border-t border-white/10">
          {CREDENCIALES.map(({ titulo, org, desc }) => (
            <li key={titulo} className="py-5 border-b border-white/10">
              <h3 className="text-fg">{titulo}</h3>
              <p className="text-sm text-fg-subtle">{org}</p>
              <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <BandaCta
        titulo="Revisa tu seguridad antes de un incidente"
        texto="Cuéntanos cuántos equipos y usuarios tiene tu organización, y te proponemos por dónde partir."
        waHref={WA.ciberseguridad()}
      />
    </div>
  )
}
