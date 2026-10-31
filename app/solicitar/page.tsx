'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ChevronDown, Send } from 'lucide-react'
import { contactSchema, type ContactForm, sanitize } from '@/lib/security'
import { precioServicio } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

const EQUIPOS: { value: ContactForm['tipoEquipo']; label: string }[] = [
  { value: 'notebook', label: 'Notebook' },
  { value: 'pc-gamer', label: 'PC Gamer' },
  { value: 'macbook', label: 'MacBook' },
  { value: 'aio', label: 'PC All-in-One' },
  { value: 'consola', label: 'Consola' },
  { value: 'tablet', label: 'Tablet / iPad' },
  { value: 'otro', label: 'Otro' },
]

// Precios desde lib/constants.ts: el formulario nunca queda desfasado del sitio.
const SERVICIOS: { value: ContactForm['servicio']; label: string }[] = [
  { value: 'mantenimiento-fisico', label: `Mantención Full (${precioServicio('mantencion-full')})` },
  { value: 'formateo', label: `Mantención Lógica · Formateo (${precioServicio('mantencion-logica')})` },
  { value: 'diagnostico', label: `Diagnóstico / Revisión (${precioServicio('diagnostico')})` },
  { value: 'armado-pc', label: `Armado PC Gamer (${precioServicio('armado-estandar')})` },
  { value: 'cotizacion-build', label: 'Cotización de build a medida' },
  { value: 'otro', label: 'Otro servicio' },
]

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export default function SolicitarPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = (data: ContactForm) => {
    const clean = {
      nombre: sanitize(data.nombre),
      telefono: sanitize(data.telefono),
      email: data.email ? sanitize(data.email) : undefined,
      equipo: EQUIPOS.find((e) => e.value === data.tipoEquipo)?.label ?? data.tipoEquipo,
      servicio: SERVICIOS.find((s) => s.value === data.servicio)?.label ?? data.servicio,
      descripcion: sanitize(data.descripcion),
    }
    const url = WA.formulario(clean)
    // window.open no pasa por el contador de clics de Analytics.tsx: se registra aquí.
    window.gtag?.('event', 'click_whatsapp', { link_url: url.split('?')[0], page_path: location.pathname })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Header */}
      <section className="relative bg-ink-950 pt-44 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <CircuitBackground variant="circuit" palette="brand" density={0.8} opacity={0.45} />
        <div className="glow-brand w-72 h-72 -top-16 right-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase text-brand-bright border border-brand-bright/25 rounded-full bg-brand/8">
            Solicitar servicio
          </span>
          <h1 className="text-fg mb-4">
            Cuéntanos{' '}
            <span className="gradient-text">qué necesitas</span>
          </h1>
          <p className="text-fg-muted max-w-lg mx-auto">
            Completa el formulario y te generamos un mensaje de WhatsApp listo para enviarnos.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-fg mb-1.5">
              Nombre completo <span className="text-danger">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              autoComplete="name"
              {...register('nombre')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-fg placeholder-fg-subtle text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors"
              placeholder="Mario González"
            />
            {errors.nombre && (
              <p className="mt-1.5 text-xs text-danger">{errors.nombre.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-fg mb-1.5">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input
              id="telefono"
              type="tel"
              autoComplete="tel"
              {...register('telefono')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-fg placeholder-fg-subtle text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors"
              placeholder="+56 9 1234 5678"
            />
            {errors.telefono && (
              <p className="mt-1.5 text-xs text-danger">{errors.telefono.message}</p>
            )}
          </div>

          {/* Email (opcional) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-fg mb-1.5">
              Email <span className="text-fg-subtle text-xs">(opcional)</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-fg placeholder-fg-subtle text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors"
              placeholder="mario@email.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>

          {/* Tipo de equipo */}
          <div>
            <label htmlFor="tipoEquipo" className="block text-sm font-medium text-fg mb-1.5">
              Tipo de equipo <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <select
                id="tipoEquipo"
                defaultValue=""
                {...register('tipoEquipo')}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-fg text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors appearance-none"
              >
                <option value="" disabled className="bg-ink-800">Selecciona un equipo</option>
                {EQUIPOS.map((e) => (
                  <option key={e.value} value={e.value} className="bg-ink-800">{e.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none" aria-hidden="true" />
            </div>
            {errors.tipoEquipo && (
              <p className="mt-1.5 text-xs text-danger">{errors.tipoEquipo.message}</p>
            )}
          </div>

          {/* Servicio */}
          <div>
            <label htmlFor="servicio" className="block text-sm font-medium text-fg mb-1.5">
              Servicio requerido <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <select
                id="servicio"
                defaultValue=""
                {...register('servicio')}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-fg text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors appearance-none"
              >
                <option value="" disabled className="bg-ink-800">Selecciona un servicio</option>
                {SERVICIOS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-ink-800">{s.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none" aria-hidden="true" />
            </div>
            {errors.servicio && (
              <p className="mt-1.5 text-xs text-danger">{errors.servicio.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-fg mb-1.5">
              Describe el problema <span className="text-danger">*</span>
            </label>
            <textarea
              id="descripcion"
              rows={4}
              {...register('descripcion')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-fg placeholder-fg-subtle text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors resize-none"
              placeholder="Ej: El notebook no enciende, hace un ruido extraño al iniciar..."
            />
            {errors.descripcion && (
              <p className="mt-1.5 text-xs text-danger">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[52px] text-base"
          >
            <Send size={18} strokeWidth={2.5} />
            Enviar por WhatsApp
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

          <p className="text-xs text-center text-fg-subtle">
            Al enviar, se abrirá WhatsApp con tu solicitud lista para enviarnos.
          </p>
        </form>
      </div>
    </div>
  )
}
