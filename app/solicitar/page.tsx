'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Send } from 'lucide-react'
import { contactSchema, type ContactForm, sanitize } from '@/lib/security'
import { WA } from '@/lib/whatsapp'
import { CircuitBackground } from '@/components/backgrounds/CircuitBackground'

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
      equipo: data.tipoEquipo,
      servicio: data.servicio,
      descripcion: sanitize(data.descripcion),
    }
    const url = WA.formulario(clean)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-ink-900 pt-24">
      {/* Header */}
      <section className="relative bg-ink-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
            <select
              id="tipoEquipo"
              {...register('tipoEquipo')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-fg text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors appearance-none"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <option value="" disabled className="bg-ink-800">Selecciona un equipo</option>
              <option value="notebook" className="bg-ink-800">Notebook</option>
              <option value="pc-gamer" className="bg-ink-800">PC Gamer</option>
              <option value="macbook" className="bg-ink-800">MacBook</option>
              <option value="aio" className="bg-ink-800">PC All-in-One</option>
              <option value="consola" className="bg-ink-800">Consola</option>
              <option value="tablet" className="bg-ink-800">Tablet / iPad</option>
              <option value="otro" className="bg-ink-800">Otro</option>
            </select>
            {errors.tipoEquipo && (
              <p className="mt-1.5 text-xs text-danger">{errors.tipoEquipo.message}</p>
            )}
          </div>

          {/* Servicio */}
          <div>
            <label htmlFor="servicio" className="block text-sm font-medium text-fg mb-1.5">
              Servicio requerido <span className="text-danger">*</span>
            </label>
            <select
              id="servicio"
              {...register('servicio')}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-fg text-[16px] focus:outline-none focus:border-brand-bright/50 focus:ring-1 focus:ring-brand-bright/30 transition-colors appearance-none"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <option value="" disabled className="bg-ink-800">Selecciona un servicio</option>
              <option value="diagnostico" className="bg-ink-800">Diagnóstico / Revisión ($25.000)</option>
              <option value="formateo" className="bg-ink-800">Formateo + Instalación ($35.000)</option>
              <option value="mantenimiento-fisico" className="bg-ink-800">Mantenimiento físico ($60.000)</option>
              <option value="armado-pc" className="bg-ink-800">Armado PC Gamer ($60.000)</option>
              <option value="cotizacion-build" className="bg-ink-800">Cotización Build a medida ($70.000)</option>
              <option value="otro" className="bg-ink-800">Otro servicio</option>
            </select>
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
