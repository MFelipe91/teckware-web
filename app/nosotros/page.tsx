import type { Metadata } from 'next'
import Image from 'next/image'
import { Shield, MapPin, Calendar, Building2, ArrowRight } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { BLUR_DARK } from '@/lib/imageBlur'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Conoce a TECKWARE SpA — empresa de servicio técnico informático fundada en La Serena por Mario Felipe Busques Araya, Ingeniero Informático con certificaciones en ciberseguridad.',
  alternates: { canonical: '/nosotros' },
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-ink-900 pt-24">
      {/* Header con imagen */}
      <section className="relative bg-ink-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Foto de fondo — water cooling azul (ambiente técnico) */}
        <div className="absolute inset-0">
          <Image
            src="/images/casper-johansson-KDIHqGWlvOc-unsplash.jpg"
            alt="Water cooling build — TECKWARE SpA"
            fill
            className="object-cover object-center opacity-12"
            priority
            quality={55}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DARK}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/50 to-ink-950" />
        </div>
        <CircuitBackground variant="constellation" palette="brand" density={1} opacity={0.6} />
        <div className="glow-brand w-80 h-80 -top-20 -right-10 opacity-25" />
        <div className="glow-silver w-64 h-64 bottom-0 left-10 opacity-20" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'var(--gradient-signature)' }}
        />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] uppercase text-brand-bright border border-brand-bright/20 rounded-sm bg-brand/6">
            Nosotros
          </span>
          <h1 className="text-fg mb-4">
            Tecnología con{' '}
            <span className="gradient-text">propósito</span>
          </h1>
          <p className="text-fg-muted max-w-xl mx-auto">
            Una empresa fundada con la convicción de que el servicio técnico puede ser honesto, rápido y accesible.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        {/* Historia + foto lateral */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-fg mb-6">La historia</h2>
            <div className="space-y-4">
              <p className="text-fg-muted leading-relaxed">
                TECKWARE SpA nació en abril de 2026 en La Serena, Región de Coquimbo,
                fundada por {EMPRESA.responsable}, {EMPRESA.tituloProfesional}.
              </p>
              <p className="text-fg-muted leading-relaxed">
                La idea surgió de una realidad concreta: en La Serena existía una brecha entre
                los talleres informales sin garantía y las tiendas de retail que cobran caro
                por trabajos básicos. TECKWARE llena ese espacio con profesionalismo real,
                precios justos y atención directa.
              </p>
              <p className="text-fg-muted leading-relaxed">
                Cada reparación la hace el mismo técnico que toma el teléfono. Sin intermediarios,
                sin subcontratos, sin excusas.
              </p>
            </div>
          </div>
          {/* Foto — técnico ensamblando PC */}
          <div className="relative h-72 lg:h-96 rounded-sm overflow-hidden border border-white/8">
            <Image
              src="/images/patty-zavala-e1MjwVoOdH8-unsplash.jpg"
              alt="Técnico ensamblando PC Gamer con water cooling — TECKWARE"
              fill
              className="object-cover object-center"
              quality={78}
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={BLUR_DARK}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-bright">
                Ensamblaje profesional
              </span>
            </div>
          </div>
        </section>

        {/* Datos de la empresa */}
        <section>
          <h2 className="text-fg mb-8">Información legal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Building2, label: 'Razón social', value: EMPRESA.nombre },
              { icon: Shield, label: 'RUT', value: EMPRESA.rut },
              { icon: Calendar, label: 'Fundación', value: EMPRESA.fundacion },
              { icon: MapPin, label: 'Zona de atención', value: EMPRESA.direccion },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-5 rounded-sm bg-white/[0.03] border border-white/8 hover:border-brand-bright/20 transition-colors"
              >
                <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-sm bg-brand/8 border border-brand-bright/18">
                  <Icon size={16} className="text-brand-bright" />
                </div>
                <div>
                  <div className="text-xs text-fg-subtle mb-0.5">{label}</div>
                  <div className="text-sm font-medium text-fg">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section>
          <h2 className="text-fg mb-8">Nuestros valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                titulo: 'Honestidad radical',
                descripcion:
                  'Si tu equipo no tiene solución o el costo no vale la pena, te lo decimos. Preferimos perder un cobro que perder tu confianza.',
              },
              {
                titulo: 'Seguridad primero',
                descripcion:
                  'Formación en ciberseguridad aplicada a cada trabajo: tus datos están protegidos y nunca accedemos a tu información sin autorización.',
              },
              {
                titulo: 'Excelencia técnica',
                descripcion:
                  'Herramientas profesionales, repuestos de calidad, documentación por escrito. El mismo estándar siempre, sin importar el equipo.',
              },
            ].map((v) => (
              <div
                key={v.titulo}
                className="p-6 rounded-sm border border-white/8 bg-white/[0.02] hover:border-brand-bright/20 transition-colors"
              >
                <div className="w-1 h-5 rounded-full bg-brand mb-4" />
                <h3 className="text-base font-bold text-fg mb-2">{v.titulo}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{v.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-4">
          <h2 className="text-fg mb-4">¿Tienes un equipo con problemas?</h2>
          <p className="text-fg-muted mb-8">Escríbenos por WhatsApp. Te respondemos en horario hábil, Lun–Vie 10:00–18:30.</p>
          <a
            href={WA.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-extrabold rounded-sm hover:bg-brand-hover transition-colors min-h-[52px]"
          >
            Contactar ahora
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
        </section>
      </div>
    </div>
  )
}
