import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { InstagramIcon } from '@/components/shared/InstagramIcon'
import { EMPRESA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contacta a TECKWARE SpA en La Serena. WhatsApp, email e Instagram. Respuesta en menos de 2 horas.',
  alternates: { canonical: '/contacto' },
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-ink-900 pt-24">
      {/* Header */}
      <section className="relative bg-ink-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CircuitBackground variant="constellation" palette="mixed" density={1.1} opacity={0.65} />
        <div className="glow-brand w-72 h-72 -top-16 right-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-brand-bright border border-brand-bright/25 rounded-full bg-brand/8">
            Contacto
          </span>
          <h1 className="text-fg mb-4">
            Hablemos{' '}
            <span className="gradient-text">ahora</span>
          </h1>
          <p className="text-fg-muted max-w-lg mx-auto">
            Respuesta garantizada en menos de 2 horas. Elige el canal que prefieras.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp — principal */}
          <a
            href={WA.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-7 rounded-2xl border border-whatsapp/25 bg-whatsapp/5 hover:border-whatsapp/50 hover:bg-whatsapp/10 transition-all card-hover"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-whatsapp/15 border border-whatsapp/25">
              <MessageCircle size={22} className="text-whatsapp" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fg mb-1">WhatsApp</h2>
              <p className="text-sm text-fg-muted mb-3">Canal principal. Respuesta más rápida.</p>
              <span className="text-whatsapp font-semibold text-sm">{EMPRESA.telefono}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-whatsapp font-medium mt-auto">
              Escribir ahora <ArrowRight size={12} />
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMPRESA.email}`}
            className="group flex flex-col gap-4 p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-brand-bright/30 hover:bg-white/5 transition-all card-hover"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand/10 border border-brand-bright/20">
              <Mail size={22} className="text-brand-bright" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fg mb-1">Email</h2>
              <p className="text-sm text-fg-muted mb-3">Para consultas detalladas o presupuestos por escrito.</p>
              <span className="text-brand-bright font-semibold text-sm">{EMPRESA.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-brand-bright font-medium mt-auto">
              Enviar email <ArrowRight size={12} />
            </div>
          </a>

          {/* Instagram */}
          <a
            href={EMPRESA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-silver/30 hover:bg-white/5 transition-all card-hover"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-silver/10 border border-silver/20">
              <InstagramIcon size={22} className="text-silver" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fg mb-1">Instagram</h2>
              <p className="text-sm text-fg-muted mb-3">Sigue nuestro trabajo y proyectos recientes.</p>
              <span className="text-silver font-semibold text-sm">{EMPRESA.instagramHandle}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-silver font-medium mt-auto">
              Ver perfil <ArrowRight size={12} />
            </div>
          </a>

          {/* Ubicación y horario */}
          <div className="flex flex-col gap-5 p-7 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-brand/10 border border-brand-bright/20">
                <MapPin size={22} className="text-brand-bright" />
              </div>
              <div>
                <h2 className="text-base font-bold text-fg mb-1">Zona de atención</h2>
                <p className="text-sm text-fg-muted">{EMPRESA.direccion}</p>
                <p className="text-xs text-fg-subtle mt-1">Sin atención de público en local — coordinamos por WhatsApp</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-brand/10 border border-brand-bright/20">
                <Clock size={22} className="text-brand-bright" />
              </div>
              <div>
                <h2 className="text-base font-bold text-fg mb-1">Horario</h2>
                <p className="text-sm text-fg-muted">{EMPRESA.horario}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA formulario */}
        <div className="mt-12 text-center p-10 rounded-3xl border border-brand-bright/15 bg-brand/5">
          <h2 className="text-fg mb-3">¿Prefieres un formulario?</h2>
          <p className="text-fg-muted mb-6">
            Completa tus datos y te contactamos nosotros.
          </p>
          <Link
            href="/solicitar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors min-h-[48px]"
          >
            Ir al formulario
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  )
}
