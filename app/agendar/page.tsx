'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, CheckCircle2, Search, RefreshCw, Wrench, Cpu, Briefcase, Package, Monitor, Laptop, Apple, Gamepad2, Tablet, Camera, X, Loader2, ImageIcon } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

type Step = 1 | 2 | 3 | 4

type FormData = {
  servicio: string
  servicioLabel: string
  equipoTipo: string
  marca: string
  problema: string
  nombre: string
  telefono: string
  fechaPreferida: string
  horario: string
  fotoUrls: string[]
}

const SERVICIOS = [
  { id: 'diagnostico',    label: 'Diagnóstico / Revisión',        icon: Search,    precio: '$25.000',    desc: 'Identificamos el problema exacto' },
  { id: 'formateo',       label: 'Formateo + Instalación Limpia',  icon: RefreshCw, precio: '$35.000',    desc: 'SO desde cero, drivers optimizados' },
  { id: 'mantenimiento',  label: 'Mantenimiento Físico',           icon: Wrench,    precio: '$60.000',    desc: 'Limpieza, pasta térmica, revisión' },
  { id: 'armado',         label: 'Armado PC Gamer',               icon: Cpu,       precio: '$60.000',    desc: 'Ensamblado profesional con cable mgmt' },
  { id: 'workstation',    label: 'Workstation / Empresarial',      icon: Briefcase, precio: 'A cotizar',  desc: 'Equipos de trabajo profesional' },
  { id: 'otro',           label: 'Otro / Consultar',               icon: Package,   precio: 'A cotizar',  desc: 'Cuéntanos qué necesitas' },
]

const EQUIPOS = [
  { id: 'notebook',    label: 'Notebook',       icon: Laptop },
  { id: 'macbook',     label: 'MacBook',        icon: Apple },
  { id: 'desktop',     label: 'PC Desktop',     icon: Monitor },
  { id: 'gamer',       label: 'PC Gamer',       icon: Cpu },
  { id: 'consola',     label: 'Consola',        icon: Gamepad2 },
  { id: 'tablet',      label: 'Tablet / iPad',  icon: Tablet },
]

const HORARIOS = [
  'Mañana 09:00–12:00',
  'Mediodía 12:00–15:00',
  'Tarde 15:00–18:00',
  'Tarde-noche 18:00–19:00',
]

const STEP_LABELS = ['Servicio', 'Equipo', 'Agenda', 'Resumen']

const EMPTY: FormData = {
  servicio: '', servicioLabel: '', equipoTipo: '',
  marca: '', problema: '', nombre: '',
  telefono: '', fechaPreferida: '', horario: '',
  fotoUrls: [],
}

function buildWAMessage(f: FormData): string {
  const BASE = 'https://wa.me/56930209427?text='
  const enc = (t: string) => encodeURIComponent(t)
  const fotos = f.fotoUrls.length
    ? `\n📸 *Fotos adjuntas:*\n${f.fotoUrls.map((u, i) => `  ${i + 1}. ${u}`).join('\n')}\n`
    : ''
  const msg =
    `*Nueva solicitud de servicio — teckware.cl* 📋\n\n` +
    `🛠️ *Servicio:* ${f.servicioLabel}\n` +
    `💻 *Equipo:* ${f.equipoTipo}${f.marca ? ` — ${f.marca}` : ''}\n` +
    `📝 *Problema:* ${f.problema}\n` +
    fotos +
    `\n📅 *Fecha preferida:* ${f.fechaPreferida || 'A coordinar'}\n` +
    `⏰ *Horario:* ${f.horario || 'A coordinar'}\n\n` +
    `👤 *Nombre:* ${f.nombre}\n` +
    `📱 *Teléfono:* ${f.telefono}\n\n` +
    `_Enviado desde teckware.cl/agendar_`
  return BASE + enc(msg)
}

function getTomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function AgendarPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const canNext1 = !!form.servicio
  const canNext2 = !!form.equipoTipo && !!form.problema.trim()
  const canNext3 = !!form.nombre.trim() && !!form.telefono.trim()

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const total = previews.length + files.length
    if (total > 3) {
      setUploadError('Máximo 3 fotos en total')
      return
    }
    setUploadError('')
    setUploading(true)

    // Preview local inmediato
    const newPreviews: string[] = []
    for (const file of Array.from(files)) {
      newPreviews.push(URL.createObjectURL(file))
    }
    setPreviews(prev => [...prev, ...newPreviews])

    // Upload a Supabase
    const fd = new FormData()
    for (const file of Array.from(files)) fd.append('files', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al subir')
      setForm(f => ({ ...f, fotoUrls: [...f.fotoUrls, ...data.urls] }))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al subir las fotos'
      setUploadError(msg)
      // revert previews on error
      setPreviews(prev => prev.slice(0, prev.length - newPreviews.length))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function removePhoto(index: number) {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setForm(f => ({ ...f, fotoUrls: f.fotoUrls.filter((_, i) => i !== index) }))
  }

  const progressPct = ((step - 1) / 3) * 100

  return (
    <div className="min-h-screen bg-[#03040A] pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-[#00D4FF]/25 bg-[#00D4FF]/8 text-[#00D4FF] text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            Agendar servicio
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F1F5F9] tracking-tight mb-3">
            ¿Qué necesita tu equipo?
          </h1>
          <p className="text-[#94A3B8] text-sm">
            Completa el formulario · Te confirmamos en menos de 2 horas por WhatsApp
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEP_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => i + 1 < step && setStep((i + 1) as Step)}
                className={`text-xs font-semibold transition-colors ${
                  i + 1 === step
                    ? 'text-[#00D4FF]'
                    : i + 1 < step
                    ? 'text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer'
                    : 'text-[#475569] cursor-default'
                }`}
              >
                {i + 1 < step && <CheckCircle2 size={10} className="inline mr-1 text-[#00D4FF]" />}
                {label}
              </button>
            ))}
          </div>
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#A855F7] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl border border-white/10 p-6 sm:p-8">

          {/* STEP 1 — Servicio */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9] mb-6">Selecciona el servicio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICIOS.map(({ id, label, icon: Icon, precio, desc }) => (
                  <button
                    key={id}
                    onClick={() => { set('servicio', id); set('servicioLabel', label) }}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      form.servicio === id
                        ? 'border-[#00D4FF] bg-[#00D4FF]/8'
                        : 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.servicio === id ? 'bg-[#00D4FF]/15' : 'bg-white/5'}`}>
                        <Icon size={15} className={form.servicio === id ? 'text-[#00D4FF]' : 'text-[#475569]'} />
                      </div>
                      <span className={`text-sm font-bold ${form.servicio === id ? 'text-[#F1F5F9]' : 'text-[#94A3B8]'}`}>{label}</span>
                    </div>
                    <div className="text-xs text-[#475569] mb-1">{desc}</div>
                    <div className={`text-xs font-bold ${form.servicio === id ? 'text-[#00D4FF]' : 'text-[#475569]'}`}>{precio}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Equipo y problema */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9] mb-6">Cuéntanos sobre tu equipo</h2>

              <div className="mb-5">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-3">Tipo de equipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {EQUIPOS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => set('equipoTipo', label)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        form.equipoTipo === label
                          ? 'border-[#00D4FF] bg-[#00D4FF]/8'
                          : 'border-white/10 bg-white/3 hover:border-white/25'
                      }`}
                    >
                      <Icon size={20} className={form.equipoTipo === label ? 'text-[#00D4FF]' : 'text-[#475569]'} />
                      <span className={`text-[10px] font-semibold ${form.equipoTipo === label ? 'text-[#F1F5F9]' : 'text-[#475569]'}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Marca y modelo <span className="text-[#475569] normal-case font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: HP Pavilion 15, MacBook Air M2, ASUS ROG..."
                  value={form.marca}
                  onChange={(e) => set('marca', e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Describe el problema o requerimiento <span className="text-red-400">*</span>
                </label>
                <textarea
                  placeholder="Ej: No enciende, hace ruido raro, pantalla parpadeante, quiero formatear y que quede como nuevo..."
                  value={form.problema}
                  onChange={(e) => set('problema', e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#00D4FF]/50 transition-colors resize-none"
                />
              </div>

              {/* Fotos opcionales */}
              <div className="mt-5">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1">
                  Fotos del equipo o error{' '}
                  <span className="text-[#475569] normal-case font-normal">(opcional · máx. 3)</span>
                </label>
                <p className="text-xs text-[#475569] mb-3">
                  Sube fotos del daño, pantalla de error o interior del equipo para que Mario evalúe antes de la cita.
                </p>

                {/* Thumbnails */}
                {previews.length > 0 && (
                  <div className="flex gap-3 mb-3 flex-wrap">
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/15 group">
                        <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" />
                        <button
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload zone */}
                {previews.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-3 w-full px-4 py-3.5 border border-dashed border-white/20 rounded-xl hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading
                      ? <Loader2 size={18} className="text-[#00D4FF] animate-spin shrink-0" />
                      : previews.length === 0
                      ? <Camera size={18} className="text-[#475569] shrink-0" />
                      : <ImageIcon size={18} className="text-[#00D4FF] shrink-0" />
                    }
                    <span className="text-sm text-[#475569]">
                      {uploading
                        ? 'Subiendo fotos...'
                        : previews.length === 0
                        ? 'Agregar fotos (JPG, PNG, WebP)'
                        : `Agregar más (${previews.length}/3)`
                      }
                    </span>
                  </button>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  multiple
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />

                {uploadError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <X size={11} /> {uploadError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Fecha y contacto */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9] mb-6">¿Cuándo y cómo te contactamos?</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">Tu nombre <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={form.nombre}
                    onChange={(e) => set('nombre', e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">Teléfono <span className="text-red-400">*</span></label>
                  <input
                    type="tel"
                    placeholder="+56 9 XXXX XXXX"
                    value={form.telefono}
                    onChange={(e) => set('telefono', e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Fecha preferida <span className="text-[#475569] normal-case font-normal">(opcional)</span>
                </label>
                <input
                  type="date"
                  min={getTomorrow()}
                  value={form.fechaPreferida}
                  onChange={(e) => set('fechaPreferida', e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F1F5F9] focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-3">Horario preferido</label>
                <div className="grid grid-cols-2 gap-2">
                  {HORARIOS.map((h) => (
                    <button
                      key={h}
                      onClick={() => set('horario', h)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                        form.horario === h
                          ? 'border-[#00D4FF] bg-[#00D4FF]/8 text-[#00D4FF]'
                          : 'border-white/10 text-[#475569] hover:border-white/25 hover:text-[#94A3B8]'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Resumen */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#00D4FF]/15 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-[#00D4FF]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#F1F5F9]">Todo listo</h2>
                  <p className="text-xs text-[#94A3B8]">Revisa los datos antes de enviar</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  { label: 'Servicio',  value: form.servicioLabel },
                  { label: 'Equipo',    value: `${form.equipoTipo}${form.marca ? ` — ${form.marca}` : ''}` },
                  { label: 'Problema',  value: form.problema },
                  { label: 'Nombre',    value: form.nombre },
                  { label: 'Teléfono', value: form.telefono },
                  { label: 'Fecha',     value: form.fechaPreferida || 'A coordinar' },
                  { label: 'Horario',   value: form.horario || 'A coordinar' },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs text-[#475569] w-20 shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-[#F1F5F9] flex-1">{value}</span>
                  </div>
                ))}
                {previews.length > 0 && (
                  <div className="flex gap-3 py-2">
                    <span className="text-xs text-[#475569] w-20 shrink-0 pt-1">Fotos</span>
                    <div className="flex gap-2 flex-wrap">
                      {previews.map((src, i) => (
                        <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/15">
                          <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-xl p-4 mb-6">
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Al enviar, abriremos WhatsApp con todos tus datos pre-escritos.
                  Confirmaremos disponibilidad en menos de <strong className="text-[#F1F5F9]">2 horas</strong>.
                </p>
              </div>

              <a
                href={buildWAMessage(form)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors text-base min-h-[56px]"
              >
                Enviar solicitud por WhatsApp
                <ArrowRight size={18} strokeWidth={2.5} />
              </a>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-white/8">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-[#94A3B8] text-sm font-medium hover:border-white/30 hover:text-[#F1F5F9] transition-all ${step === 1 ? 'invisible' : ''}`}
              >
                <ArrowLeft size={15} />
                Anterior
              </button>
              <button
                onClick={() => setStep((s) => Math.min(4, s + 1) as Step)}
                disabled={
                  (step === 1 && !canNext1) ||
                  (step === 2 && !canNext2) ||
                  (step === 3 && !canNext3)
                }
                className="flex items-center gap-2 px-6 py-2.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
              >
                {step === 3 ? 'Ver resumen' : 'Siguiente'}
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#475569] mt-6">
          Atención Lun–Sáb 09:00–19:00 · La Serena, Chile
        </p>
      </div>
    </div>
  )
}
