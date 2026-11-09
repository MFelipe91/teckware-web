import type { Metadata } from 'next'
import Image from 'next/image'
import { BadgeCheck, FileText, ShieldCheck } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'
import { FOTOS, STOCK } from '@/lib/fotos'
import { BandaCta } from '@/components/shared/BandaCta'
import { CtaPair } from '@/components/shared/CtaPair'
import { HeroInterior } from '@/components/shared/HeroInterior'
import { TrustBar } from '@/components/home/TrustBar'
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
  { label: 'Responsable', value: EMPRESA.responsable },
  { label: 'Zona de atención', value: EMPRESA.direccion },
  { label: 'Horario', value: EMPRESA.horario },
]

const VALORES = [
  {
    icon: BadgeCheck,
    titulo: 'Honestidad',
    descripcion: 'Si tu equipo no tiene solución o el costo no vale la pena, te lo decimos. Preferimos perder un cobro que perder tu confianza.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Seguridad primero',
    descripcion: 'Formación en ciberseguridad aplicada a cada trabajo: tus datos están protegidos y nunca accedemos a tu información sin autorización.',
  },
  {
    icon: FileText,
    titulo: 'Trabajo documentado',
    descripcion: 'Herramientas profesionales, pruebas antes y después e informe técnico por escrito. El mismo estándar siempre, sin importar el equipo.',
  },
]

export default function NosotrosPage() {
  const foto = FOTOS.duenio ?? STOCK.tecnico
  return (
    <div className="min-h-svh bg-ink-900">
      <HeroInterior
        antetitulo="Nosotros"
        titulo={<>Te atiende quien <span className="acento">trabaja en tu equipo</span></>}
        bajada="Un servicio técnico de La Serena con ingeniería detrás: diagnóstico con método, precio claro y trato directo, sin intermediarios."
        foto={STOCK.placa}
      >
        <CtaPair />
      </HeroInterior>
      <TrustBar />

      <section className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="historia">
        <div className="max-w-[76rem] mx-auto grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
          <div>
            <p className="antetitulo">La historia</p>
            <h2 id="historia" className="mt-3 text-fg">Nació para llenar un <span className="acento">vacío</span> en La Serena</h2>
            <div className="mt-6 space-y-4 max-w-2xl">
              <p className="text-fg-muted leading-relaxed">
                TECKWARE SpA nació en {EMPRESA.fundacion.toLowerCase().replace(' ', ' de ')} en La Serena, Región de Coquimbo, fundada por {EMPRESA.responsable}, {EMPRESA.tituloProfesional}.
              </p>
              <p className="text-fg-muted leading-relaxed">
                La idea surgió de una realidad concreta: existía una brecha entre los talleres informales sin garantía y las tiendas de retail que cobran caro por trabajos básicos. TECKWARE llena ese espacio con precios claros y atención directa.
              </p>
              <p className="text-fg-muted leading-relaxed">
                Cada reparación la hace el mismo técnico que toma el teléfono. Sin intermediarios ni subcontratos.
              </p>
            </div>
          </div>
          <div className="tarjeta relative aspect-[4/3]">
            <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-ink-950 border-y border-white/10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="como-trabajamos">
        <div className="max-w-[76rem] mx-auto">
          <div className="text-center">
            <p className="antetitulo">Nuestros valores</p>
            <h2 id="como-trabajamos" className="mt-3 text-fg">Cómo trabajamos</h2>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {VALORES.map(({ icon: Icon, titulo, descripcion }) => (
              <li key={titulo} className="tarjeta p-6">
                <Icon size={32} strokeWidth={1.6} className="text-cian" aria-hidden="true" />
                <h3 className="mt-4 text-fg">{titulo}</h3>
                <p className="mt-2 text-fg-muted leading-relaxed">{descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="datos-legales">
        <div className="max-w-3xl mx-auto">
          <h2 id="datos-legales" className="text-fg text-3xl sm:text-4xl">Información de la empresa</h2>
          <dl className="tarjeta mt-6 divide-y divide-white/10">
            {DATOS.map(({ label, value }) => (
              <div key={label} className="px-5 py-4 grid gap-1 sm:grid-cols-[170px_minmax(0,1fr)]">
                <dt className="text-sm text-fg-subtle">{label}</dt>
                <dd className="text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <BandaCta
        titulo="¿Tienes un equipo con problemas?"
        texto={`Escríbenos por WhatsApp. Te respondemos en horario hábil: ${EMPRESA.horario}.`}
      />
    </div>
  )
}
