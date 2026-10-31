import type { Metadata } from 'next'
import { WEB_QA_SERVICIOS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { BandaCta } from '@/components/shared/BandaCta'
import { PageHeader } from '@/components/shared/PageHeader'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Consultoría Web & QA',
  description:
    'Desarrollo web profesional, auditorías de sitios y QA para empresas en Chile. Landing pages, sitios corporativos, testing manual y automatizado.',
  alternates: { canonical: '/web-qa' },
  openGraph: ogPagina('/web-qa'),
}

const DIFERENCIADORES = [
  { titulo: 'Stack moderno', descripcion: 'Next.js, TypeScript y Tailwind, con buenas prácticas de desarrollo.' },
  { titulo: 'Rendimiento medido', descripcion: 'Revisamos los Core Web Vitals de tu sitio y te mostramos los resultados.' },
  { titulo: 'Seguridad incluida', descripcion: 'Security headers, sanitización de inputs y protección básica ante vulnerabilidades web.' },
  { titulo: 'Entregables claros', descripcion: 'Informes ejecutivos y técnicos. Sabes exactamente qué encontramos y qué hacer.' },
]

const PROCESO_WEB = [
  { paso: 1, titulo: 'Briefing', desc: 'Reunión de 30 min por WhatsApp para entender tu proyecto, objetivos y plazos.' },
  { paso: 2, titulo: 'Propuesta', desc: 'Presupuesto detallado con alcance, entregables y cronograma en 48 horas hábiles.' },
  { paso: 3, titulo: 'Ejecución', desc: 'Desarrollo o auditoría con actualizaciones de avance cada 2 días.' },
  { paso: 4, titulo: 'Entrega', desc: 'Deploy en producción o informe final con soporte post-entrega de 15 días.' },
]

const INCLUYE = [
  'Comunicación directa por WhatsApp',
  'Actualizaciones de avance regulares',
  'Entregables documentados',
  'Código limpio y comentado',
  'Optimización SEO técnico base',
  'Responsive mobile-first',
  'Soporte post-entrega 15 días',
  'Sin costos ocultos',
]

export default function WebQAPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <PageHeader
        titulo="Desarrollo web y control de calidad para tu empresa"
        bajada="Construimos sitios, auditamos los que ya tienes y probamos tus aplicaciones con pruebas manuales y automatizadas."
      >
        <a href={WA.webQA()} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full sm:w-auto">
          Solicitar cotización
        </a>
      </PageHeader>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid gap-10 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <h2 className="text-fg">Servicios</h2>
          <p className="mt-4 text-fg-muted">Desde una auditoría puntual hasta la construcción completa de tu sitio.</p>
        </div>
        <ul className="border-t border-white/10">
          {WEB_QA_SERVICIOS.map((s) => (
            <li key={s.id} className="py-5 border-b border-white/10 grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2">
              <h3 className="text-fg">{s.nombre}</h3>
              <span className="price text-lg text-fg text-right">{s.precio}</span>
              <p className="text-sm text-fg-muted leading-relaxed">
                {s.descripcion} <span className="text-fg-subtle">Plazo: {s.tiempo}.</span>
              </p>
              <a href={WA.webQA(s.nombre)} target="_blank" rel="noopener noreferrer" className="btn btn-terciario justify-self-end self-start" aria-label={`Solicitar ${s.nombre}`}>
                Solicitar
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ink-800 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-[76rem] mx-auto">
          <h2 className="text-fg mb-8">Cómo trabajamos</h2>
          <ul className="grid gap-x-10 sm:grid-cols-2 border-t border-white/10">
            {DIFERENCIADORES.map(({ titulo, descripcion }) => (
              <li key={titulo} className="py-5 border-b border-white/10">
                <h3 className="text-[1.125rem] text-fg">{titulo}</h3>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-fg mb-10">El proceso</h2>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PROCESO_WEB.map(({ paso, titulo, desc }) => (
            <li key={paso} className="pt-4 border-t-2 border-brand-bright">
              <span className="price text-sm text-brand-bright">Paso {paso}</span>
              <h3 className="mt-2 text-fg">{titulo}</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-[76rem] mx-auto grid gap-8 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 className="text-fg">Todo proyecto incluye</h2>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {INCLUYE.map((item) => (
              <li key={item} className="flex items-baseline gap-3 text-fg-muted">
                <span className="hex" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BandaCta
        titulo="¿Tienes un proyecto en mente?"
        texto="Cuéntanos qué necesitas. Respondemos con una propuesta en 48 horas hábiles."
        waHref={WA.webQA()}
      />
    </div>
  )
}
