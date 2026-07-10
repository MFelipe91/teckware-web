import type { Metadata } from 'next'
import { Shield, Award, MapPin, Calendar, Building2 } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Conoce a TECKWARE SpA — empresa de servicio técnico informático fundada en La Serena por Mario Felipe Busques Araya, Ingeniero en Ciberseguridad.',
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">
      {/* Header */}
      <section className="relative bg-[#03040A] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="glow-cyan w-80 h-80 -top-20 -right-10 opacity-30" />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-[#00D4FF] border border-[#00D4FF]/25 rounded-full bg-[#00D4FF]/8">
            Nosotros
          </span>
          <h1 className="text-[#F1F5F9] mb-4">
            Tecnología con{' '}
            <span className="gradient-text">propósito</span>
          </h1>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Una empresa fundada con la convicción de que el servicio técnico puede ser honesto, rápido y accesible.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        {/* Historia */}
        <section>
          <h2 className="text-[#F1F5F9] mb-6">La historia</h2>
          <div className="prose-custom space-y-4">
            <p className="text-[#94A3B8] leading-relaxed">
              TECKWARE SpA nació en abril de 2026 en La Serena, Región de Coquimbo,
              fundada por Mario Felipe Busques Araya — Ingeniero Informático con especialización
              en Ciberseguridad.
            </p>
            <p className="text-[#94A3B8] leading-relaxed">
              La idea surgió de una realidad concreta: en La Serena existía una brecha entre
              los talleres informales sin garantía y las tiendas de retail que cobran caro
              por trabajos básicos. TECKWARE llena ese espacio con profesionalismo real,
              precios justos y atención directa.
            </p>
            <p className="text-[#94A3B8] leading-relaxed">
              Cada reparación la hace el mismo técnico que toma el teléfono. Sin intermediarios,
              sin subcontratos, sin excusas.
            </p>
          </div>
        </section>

        {/* Datos de la empresa */}
        <section>
          <h2 className="text-[#F1F5F9] mb-8">Información legal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Building2, label: 'Razón social', value: EMPRESA.nombre },
              { icon: Shield, label: 'RUT', value: EMPRESA.rut },
              { icon: Calendar, label: 'Fundación', value: EMPRESA.fundacion },
              { icon: MapPin, label: 'Dirección', value: EMPRESA.direccion },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/10"
              >
                <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                  <Icon size={16} className="text-[#00D4FF]" />
                </div>
                <div>
                  <div className="text-xs text-[#475569] mb-0.5">{label}</div>
                  <div className="text-sm font-medium text-[#F1F5F9]">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section>
          <h2 className="text-[#F1F5F9] mb-8">Nuestros valores</h2>
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
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="w-2 h-2 rounded-full bg-[#00D4FF] mb-4" />
                <h3 className="text-base font-bold text-[#F1F5F9] mb-2">{v.titulo}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{v.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-4">
          <h2 className="text-[#F1F5F9] mb-4">¿Tienes un equipo con problemas?</h2>
          <p className="text-[#94A3B8] mb-8">Escríbenos. Te respondemos en menos de 2 horas.</p>
          <a
            href={WA.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors min-h-[52px]"
          >
            Contactar ahora
          </a>
        </section>
      </div>
    </div>
  )
}
