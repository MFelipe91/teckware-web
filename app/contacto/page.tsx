import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'
import { InstagramIcon } from '@/components/shared/InstagramIcon'
import { EMPRESA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contacta a TECKWARE SpA en La Serena. WhatsApp, email e Instagram. Respuesta en menos de 2 horas.',
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[#080B14] pt-24">
      {/* Header */}
      <section className="relative bg-[#03040A] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="glow-cyan w-72 h-72 -top-16 right-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-[#00D4FF] border border-[#00D4FF]/25 rounded-full bg-[#00D4FF]/8">
            Contacto
          </span>
          <h1 className="text-[#F1F5F9] mb-4">
            Hablemos{' '}
            <span className="gradient-text">ahora</span>
          </h1>
          <p className="text-[#94A3B8] max-w-lg mx-auto">
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
            className="group flex flex-col gap-4 p-7 rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/5 hover:border-[#22C55E]/50 hover:bg-[#22C55E]/10 transition-all card-hover"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/25">
              <MessageCircle size={22} className="text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9] mb-1">WhatsApp</h2>
              <p className="text-sm text-[#94A3B8] mb-3">Canal principal. Respuesta más rápida.</p>
              <span className="text-[#22C55E] font-semibold text-sm">{EMPRESA.telefono}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#22C55E] font-medium mt-auto">
              Escribir ahora <ArrowRight size={12} />
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMPRESA.email}`}
            className="group flex flex-col gap-4 p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#00D4FF]/30 hover:bg-white/5 transition-all card-hover"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20">
              <Mail size={22} className="text-[#00D4FF]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9] mb-1">Email</h2>
              <p className="text-sm text-[#94A3B8] mb-3">Para consultas detalladas o presupuestos por escrito.</p>
              <span className="text-[#00D4FF] font-semibold text-sm">{EMPRESA.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#00D4FF] font-medium mt-auto">
              Enviar email <ArrowRight size={12} />
            </div>
          </a>

          {/* Instagram */}
          <a
            href={EMPRESA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#A855F7]/30 hover:bg-white/5 transition-all card-hover"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20">
              <InstagramIcon size={22} className="text-[#A855F7]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9] mb-1">Instagram</h2>
              <p className="text-sm text-[#94A3B8] mb-3">Sigue nuestro trabajo y proyectos recientes.</p>
              <span className="text-[#A855F7] font-semibold text-sm">{EMPRESA.instagramHandle}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#A855F7] font-medium mt-auto">
              Ver perfil <ArrowRight size={12} />
            </div>
          </a>

          {/* Ubicación y horario */}
          <div className="flex flex-col gap-5 p-7 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                <MapPin size={22} className="text-[#00D4FF]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#F1F5F9] mb-1">Ubicación</h2>
                <p className="text-sm text-[#94A3B8]">{EMPRESA.direccion}</p>
                <p className="text-xs text-[#475569] mt-1">Oficina virtual — atención por coordinación</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20">
                <Clock size={22} className="text-[#00D4FF]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#F1F5F9] mb-1">Horario</h2>
                <p className="text-sm text-[#94A3B8]">{EMPRESA.horario}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA formulario */}
        <div className="mt-12 text-center p-10 rounded-3xl border border-[#00D4FF]/15 bg-[#00D4FF]/5">
          <h2 className="text-[#F1F5F9] mb-3">¿Prefieres un formulario?</h2>
          <p className="text-[#94A3B8] mb-6">
            Completa tus datos y te contactamos nosotros.
          </p>
          <Link
            href="/solicitar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors min-h-[48px]"
          >
            Ir al formulario
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  )
}
