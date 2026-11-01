import type { Metadata } from 'next'
import Image from 'next/image'
import { EMPRESA } from '@/lib/constants'
import { FOTOS } from '@/lib/fotos'
import { BandaCta } from '@/components/shared/BandaCta'
import { PageHeader } from '@/components/shared/PageHeader'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'TECKWARE SpA es un servicio técnico de La Serena, fundado por Mario Felipe Busques Araya, Ingeniero Informático con certificaciones en ciberseguridad.',
  alternates: { canonical: '/nosotros' },
  openGraph: ogPagina('/nosotros'),
}

const DATOS = [
  { label: 'Razón social', value: EMPRESA.nombre },
  { label: 'RUT', value: EMPRESA.rut },
  { label: 'Fundación', value: EMPRESA.fundacion },
  { label: 'Zona de atención', value: EMPRESA.direccion },
]

const VALORES = [
  {
    titulo: 'Honestidad',
    descripcion: 'Si tu equipo no tiene solución o el costo no vale la pena, te lo decimos. Preferimos perder un cobro que perder tu confianza.',
  },
  {
    titulo: 'Seguridad primero',
    descripcion: 'Formación en ciberseguridad aplicada a cada trabajo: tus datos están protegidos y nunca accedemos a tu información sin autorización.',
  },
  {
    titulo: 'Trabajo documentado',
    descripcion: 'Herramientas profesionales y documentación por escrito. El mismo estándar siempre, sin importar el equipo.',
  },
]

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <PageHeader
        titulo="Quiénes somos"
        bajada="Un servicio técnico de La Serena donde te atiende la misma persona que trabaja en tu equipo."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid gap-10 lg:gap-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <h2 className="text-fg mb-6">La historia</h2>
          <div className="space-y-4 max-w-2xl">
            <p className="text-fg-muted leading-relaxed">
              TECKWARE SpA nació en abril de 2026 en La Serena, Región de Coquimbo,
              fundada por {EMPRESA.responsable}, {EMPRESA.tituloProfesional}.
            </p>
            <p className="text-fg-muted leading-relaxed">
              La idea surgió de una realidad concreta: en La Serena existía una brecha entre
              los talleres informales sin garantía y las tiendas de retail que cobran caro
              por trabajos básicos. TECKWARE llena ese espacio con precios claros y atención directa.
            </p>
            <p className="text-fg-muted leading-relaxed">
              Cada reparación la hace el mismo técnico que toma el teléfono. Sin intermediarios ni subcontratos.
            </p>
          </div>
        </div>

        <div>
          {FOTOS.duenio && (
            <div className="panel-corte relative h-80 mb-8 overflow-hidden">
              <Image src={FOTOS.duenio.src} alt={FOTOS.duenio.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
          <h2 className="text-fg text-3xl mb-5">Información legal</h2>
          <dl className="border-t border-white/10">
            {DATOS.map(({ label, value }) => (
              <div key={label} className="py-3 border-b border-white/10 grid gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                <dt className="text-sm text-fg-subtle">{label}</dt>
                <dd className="text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-ink-800 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-[76rem] mx-auto grid gap-10 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 className="text-fg">Cómo trabajamos</h2>
          <ul className="border-t border-white/10">
            {VALORES.map((v) => (
              <li key={v.titulo} className="py-5 border-b border-white/10">
                <h3 className="text-fg">{v.titulo}</h3>
                <p className="mt-1.5 text-fg-muted leading-relaxed max-w-2xl">{v.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BandaCta
        titulo="¿Tienes un equipo con problemas?"
        texto={`Escríbenos por WhatsApp. Te respondemos en horario hábil: ${EMPRESA.horario}.`}
      />
    </div>
  )
}
