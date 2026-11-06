'use client'

import { useEffect, useId, useState, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, CheckCircle2, Search, RefreshCw, Wrench, Cpu, Briefcase, Package, Monitor, Laptop, Apple, Gamepad2, Tablet, Camera, X, Loader2, ImageIcon, Check, Info, ShieldCheck } from 'lucide-react'
import { EMPRESA, PLAZO, SERVICIO_CONDICIONES, CONDICIONES_GENERALES, precioServicio } from '@/lib/constants'
import { nombreSchema, telefonoSchema } from '@/lib/security'

// Mapea el id del servicio del wizard → la clave de condiciones en constants.ts
const COND_MAP: Record<string, string> = {
  diagnostico: 'diagnostico',
  formateo: 'mantencion-logica',
  mantenimiento: 'mantencion-full',
  armado: 'armado-estandar',
  workstation: 'workstation',
}

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
  { id: 'diagnostico',    label: 'Diagnóstico / Revisión',        icon: Search,    precio: precioServicio('diagnostico'),    desc: 'Identificamos la falla exacta. Se descuenta si reparas.' },
  { id: 'formateo',       label: 'Mantención Lógica · Formateo',   icon: RefreshCw, precio: precioServicio('mantencion-logica'),    desc: 'Formateo e instalación de Windows o macOS + optimización' },
  { id: 'mantenimiento',  label: 'Mantención Full · Físico + Sistema', icon: Wrench, precio: precioServicio('mantencion-full'), desc: 'Test, limpieza, pasta Thermal Grizzly, BIOS, Windows limpio y test final' },
  { id: 'armado',         label: 'Armado PC Gamer',               icon: Cpu,       precio: precioServicio('armado-estandar'),    desc: 'Ensamblado profesional con cable management' },
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
  'Mañana 10:00–12:00',
  'Mediodía 12:00–15:00',
  'Tarde 15:00–18:30',
]

const STEP_LABELS = ['Servicio', 'Equipo', 'Agenda', 'Resumen']

const EMPTY: FormData = {
  servicio: '', servicioLabel: '', equipoTipo: '',
  marca: '', problema: '', nombre: '',
  telefono: '', fechaPreferida: '', horario: '',
  fotoUrls: [],
}

function buildWAMessage(f: FormData): string {
  const BASE = `${EMPRESA.whatsapp}?text=`
  const enc = (t: string) => encodeURIComponent(t)
  const precio = SERVICIOS.find((s) => s.id === f.servicio)?.precio
  const fotos = f.fotoUrls.length
    ? `\n📸 *Fotos adjuntas:* ${f.fotoUrls.length} (enviadas por el sitio web)\n`
    : ''
  const msg =
    `*Nueva solicitud de servicio — teckware.cl* 📋\n\n` +
    `🛠️ *Servicio:* ${f.servicioLabel}${precio && precio !== 'A cotizar' ? ` (${precio})` : ''}\n` +
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
  // Fecha local, no UTC: en Chile, de noche, toISOString ya daría pasado mañana.
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

function esFinDeSemana(iso: string): boolean {
  const dia = new Date(`${iso}T12:00:00`).getDay()
  return dia === 0 || dia === 6
}

export default function AgendarPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [fechaError, setFechaError] = useState('')
  const [tocado, setTocado] = useState({ nombre: false, telefono: false })
  const [guardadoFallo, setGuardadoFallo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const registrada = useRef(false)
  const tituloPaso = useRef<HTMLHeadingElement>(null)
  const primerRender = useRef(true)

  // Al cambiar de paso, el foco va al título: si no, el teclado y el lector de pantalla se pierden.
  useEffect(() => {
    if (primerRender.current) { primerRender.current = false; return }
    tituloPaso.current?.focus({ preventScroll: true })
  }, [step])
  const uid = useId()

  const set = (key: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const goTo = (s: Step) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cambiarFecha(valor: string) {
    if (valor && esFinDeSemana(valor)) {
      setFechaError('Atendemos de lunes a viernes. Elige un día hábil.')
      set('fechaPreferida', '')
      return
    }
    setFechaError('')
    set('fechaPreferida', valor)
  }

  // Al salir del campo, no al cambiar: mientras se escribe el año, la fecha pasa por valores antiguos.
  function revisarFechaPasada() {
    if (form.fechaPreferida && form.fechaPreferida < getTomorrow()) {
      setFechaError('Elige una fecha a partir de mañana.')
      set('fechaPreferida', '')
    }
  }

  const nombreValido = nombreSchema.safeParse(form.nombre)
  const telefonoValido = telefonoSchema.safeParse(form.telefono)
  const errorNombre = tocado.nombre && !nombreValido.success ? nombreValido.error.issues[0].message : ''
  const errorTelefono = tocado.telefono && !telefonoValido.success ? telefonoValido.error.issues[0].message : ''

  const canNext1 = !!form.servicio
  const canNext2 = !!form.equipoTipo && !!form.problema.trim()
  const canNext3 = nombreValido.success && telefonoValido.success

  // Condiciones del servicio seleccionado (mapeado a constants.ts)
  const condSel = form.servicio && COND_MAP[form.servicio]
    ? SERVICIO_CONDICIONES[COND_MAP[form.servicio]]
    : undefined

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
      setForm(f => ({ ...f, fotoUrls: [...f.fotoUrls, ...data.paths] }))
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

  // Guarda la solicitud en Supabase (sin bloquear y una sola vez). El botón es un enlace real a
  // WhatsApp: no lo frena el bloqueador de ventanas y Analytics.tsx lo cuenta como conversión.
  // Si falla, avisa y permite reintentar con el siguiente clic: el WhatsApp lleva todos los datos.
  function registrarSolicitud() {
    if (registrada.current) return
    registrada.current = true
    setGuardadoFallo(false)
    fetch('/api/solicitudes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      })
      .catch((e) => {
        console.error('No se pudo registrar la solicitud:', e)
        registrada.current = false
        setGuardadoFallo(true)
      })
  }

  const progressPct = ((step - 1) / 3) * 100

  return (
    <div className="relative min-h-svh bg-ink-950 pt-24 pb-20 overflow-hidden">
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] mb-4">
            ¿Qué necesita tu equipo?
          </h1>
          <p className="text-fg-muted">
            Completa el formulario · Te confirmamos por WhatsApp en horario hábil (Lun–Vie 10:00–18:30)
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEP_LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                disabled={i + 1 >= step}
                aria-current={i + 1 === step ? 'step' : undefined}
                onClick={() => goTo((i + 1) as Step)}
                className={`py-1 text-sm font-semibold transition-colors ${
                  i + 1 === step
                    ? 'text-brand-bright'
                    : i + 1 < step
                    ? 'text-fg-muted hover:text-fg cursor-pointer'
                    : 'text-fg-subtle cursor-default'
                }`}
              >
                {i + 1 < step && <CheckCircle2 size={10} className="inline mr-1 text-brand-bright" />}
                {label}
              </button>
            ))}
          </div>
          <div className="h-1 bg-white/8 overflow-hidden">
            <div
              className="h-full bg-brand-bright origin-left transition-transform duration-300 ease-salida"
              style={{ transform: `scaleX(${progressPct / 100})` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="panel-corte p-6 sm:p-8">

          {/* STEP 1 — Servicio */}
          {step === 1 && (
            <div>
              <h2 ref={tituloPaso} tabIndex={-1} className="outline-none text-xl text-fg mb-6">Selecciona el servicio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICIOS.map(({ id, label, icon: Icon, precio, desc }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={form.servicio === id}
                    onClick={() => { set('servicio', id); set('servicioLabel', label) }}
                    className={`text-left p-4 rounded-sm border transition-colors ${
                      form.servicio === id
                        ? 'border-brand-bright bg-brand/8'
                        : 'border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${form.servicio === id ? 'bg-brand/15' : 'bg-white/5'}`}>
                        <Icon size={15} className={form.servicio === id ? 'text-brand-bright' : 'text-fg-subtle'} />
                      </div>
                      <span className={`text-sm font-bold ${form.servicio === id ? 'text-fg' : 'text-fg-muted'}`}>{label}</span>
                    </div>
                    <div className="text-sm text-fg-subtle mb-1">{desc}</div>
                    <div className={`text-sm font-bold ${form.servicio === id ? 'text-brand-bright' : 'text-fg-subtle'}`}>{precio}</div>
                  </button>
                ))}
              </div>

              {/* Condiciones del servicio seleccionado */}
              {condSel && (
                <div className="mt-5 rounded-sm border border-brand-bright/20 bg-brand/[0.04] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={15} className="text-brand-bright" />
                    <span className="text-sm font-bold text-fg">Qué incluye</span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {condSel.incluye.map((linea) => (
                      <li key={linea} className="flex items-start gap-2 text-sm text-fg-muted leading-snug">
                        <Check size={13} className="text-brand-bright shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{linea}</span>
                      </li>
                    ))}
                  </ul>
                  {condSel.nota && (
                    <p className="flex items-start gap-2 text-sm text-fg-subtle leading-relaxed pt-3 border-t border-white/8">
                      <Info size={12} className="text-fg-subtle shrink-0 mt-0.5" />
                      <span>{condSel.nota}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Equipo y problema */}
          {step === 2 && (
            <div>
              <h2 ref={tituloPaso} tabIndex={-1} className="outline-none text-xl text-fg mb-6">Cuéntanos sobre tu equipo</h2>

              <div className="mb-5">
                <p className="text-sm font-semibold text-fg-muted mb-3">Tipo de equipo</p>
                <div className="grid grid-cols-3 gap-2">
                  {EQUIPOS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={form.equipoTipo === label}
                      onClick={() => set('equipoTipo', label)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-sm border transition-colors ${
                        form.equipoTipo === label
                          ? 'border-brand-bright bg-brand/8'
                          : 'border-white/10 bg-white/3 hover:border-white/25'
                      }`}
                    >
                      <Icon size={20} className={form.equipoTipo === label ? 'text-brand-bright' : 'text-fg-subtle'} />
                      <span className={`text-sm text-center font-semibold ${form.equipoTipo === label ? 'text-fg' : 'text-fg-subtle'}`}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor={`${uid}-marca`} className="text-sm font-semibold text-fg-muted block mb-2">
                  Marca y modelo <span className="text-fg-subtle normal-case font-normal">(opcional)</span>
                </label>
                <input
                  id={`${uid}-marca`}
                  type="text"
                  placeholder="Ej: HP Pavilion 15, MacBook Air M2, ASUS ROG..."
                  value={form.marca}
                  maxLength={120}
                  onChange={(e) => set('marca', e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-base sm:text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-brand-bright/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor={`${uid}-problema`} className="text-sm font-semibold text-fg-muted block mb-2">
                  Describe el problema o requerimiento <span className="text-danger">*</span>
                </label>
                <textarea
                  id={`${uid}-problema`}
                  placeholder="Ej: No enciende, hace ruido raro, pantalla parpadeante, quiero formatear y que quede como nuevo..."
                  value={form.problema}
                  maxLength={1000}
                  onChange={(e) => set('problema', e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-base sm:text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-brand-bright/50 transition-colors resize-none"
                />
              </div>

              {/* Fotos opcionales */}
              <div className="mt-5">
                <p className="text-sm font-semibold text-fg-muted mb-1">
                  Fotos del equipo o error{' '}
                  <span className="text-fg-subtle normal-case font-normal">(opcional · máx. 3)</span>
                </p>
                <p className="text-sm text-fg-subtle mb-3">
                  Sube fotos del daño, pantalla de error o interior del equipo para que Mario evalúe antes de la cita.
                </p>

                {/* Thumbnails */}
                {previews.length > 0 && (
                  <div className="flex gap-3 mb-3 flex-wrap">
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden border border-white/15 group">
                        <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          aria-label={`Quitar foto ${i + 1}`}
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-sm bg-black/70 text-white flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                        >
                          <X size={12} aria-hidden="true" />
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
                    className="flex items-center gap-3 w-full px-4 py-3.5 border border-dashed border-white/20 rounded-sm hover:border-brand-bright/40 hover:bg-brand/4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading
                      ? <Loader2 size={18} className="text-brand-bright animate-spin shrink-0" />
                      : previews.length === 0
                      ? <Camera size={18} className="text-fg-subtle shrink-0" />
                      : <ImageIcon size={18} className="text-brand-bright shrink-0" />
                    }
                    <span className="text-sm text-fg-subtle">
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
                  <p className="text-sm text-danger mt-2 flex items-center gap-1">
                    <X size={11} /> {uploadError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Fecha y contacto */}
          {step === 3 && (
            <div>
              <h2 ref={tituloPaso} tabIndex={-1} className="outline-none text-xl text-fg mb-6">¿Cuándo y cómo te contactamos?</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`${uid}-nombre`} className="text-sm font-semibold text-fg-muted block mb-2">Tu nombre <span className="text-danger">*</span></label>
                  <input
                    id={`${uid}-nombre`}
                    autoComplete="name"
                    type="text"
                    placeholder="Nombre completo"
                    value={form.nombre}
                    maxLength={80}
                    onChange={(e) => set('nombre', e.target.value)}
                    onBlur={() => setTocado((t) => ({ ...t, nombre: true }))}
                    aria-invalid={!!errorNombre}
                    aria-describedby={errorNombre ? `${uid}-nombre-error` : undefined}
                    className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-base sm:text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-brand-bright/50 transition-colors"
                  />
                  {errorNombre && <p id={`${uid}-nombre-error`} role="alert" className="mt-2 text-sm text-danger">{errorNombre}</p>}
                </div>
                <div>
                  <label htmlFor={`${uid}-telefono`} className="text-sm font-semibold text-fg-muted block mb-2">Teléfono <span className="text-danger">*</span></label>
                  <input
                    id={`${uid}-telefono`}
                    autoComplete="tel"
                    type="tel"
                    placeholder="+56 9 XXXX XXXX"
                    value={form.telefono}
                    onChange={(e) => set('telefono', e.target.value)}
                    onBlur={() => setTocado((t) => ({ ...t, telefono: true }))}
                    aria-invalid={!!errorTelefono}
                    aria-describedby={errorTelefono ? `${uid}-telefono-error` : undefined}
                    className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-base sm:text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-brand-bright/50 transition-colors"
                  />
                  {errorTelefono && <p id={`${uid}-telefono-error`} role="alert" className="mt-2 text-sm text-danger">{errorTelefono}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor={`${uid}-fecha`} className="text-sm font-semibold text-fg-muted block mb-2">
                  Fecha preferida <span className="text-fg-subtle normal-case font-normal">(opcional · lunes a viernes)</span>
                </label>
                <input
                  id={`${uid}-fecha`}
                  type="date"
                  min={getTomorrow()}
                  value={form.fechaPreferida}
                  onChange={(e) => cambiarFecha(e.target.value)}
                  onBlur={revisarFechaPasada}
                  aria-invalid={!!fechaError}
                  className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 text-base sm:text-sm text-fg [color-scheme:dark] focus:outline-none focus:border-brand-bright/50 transition-colors"
                />
                {fechaError && <p role="alert" className="mt-2 text-sm text-danger">{fechaError}</p>}
              </div>

              <div>
                <p className="text-sm font-semibold text-fg-muted mb-3">Horario preferido</p>
                <div className="grid grid-cols-2 gap-2">
                  {HORARIOS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      aria-pressed={form.horario === h}
                      onClick={() => set('horario', h)}
                      className={`py-2.5 px-3 rounded-sm border text-sm font-medium transition-colors ${
                        form.horario === h
                          ? 'border-brand-bright bg-brand/8 text-brand-bright'
                          : 'border-white/10 text-fg-subtle hover:border-white/25 hover:text-fg-muted'
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
                <div className="w-10 h-10 rounded-sm bg-brand/15 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-brand-bright" />
                </div>
                <div>
                  <h2 ref={tituloPaso} tabIndex={-1} className="outline-none text-xl text-fg">Todo listo</h2>
                  <p className="text-sm text-fg-muted">Revisa los datos antes de enviar</p>
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
                    <span className="text-sm text-fg-subtle w-20 shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-fg flex-1">{value}</span>
                  </div>
                ))}
                {previews.length > 0 && (
                  <div className="flex gap-3 py-2">
                    <span className="text-sm text-fg-subtle w-20 shrink-0 pt-1">Fotos</span>
                    <div className="flex gap-2 flex-wrap">
                      {previews.map((src, i) => (
                        <div key={i} className="relative w-14 h-14 rounded-sm overflow-hidden border border-white/15">
                          <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Condiciones generales */}
              <div className="rounded-sm border border-white/8 bg-white/[0.02] p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={14} className="text-brand-bright" />
                  <span className="text-sm font-bold text-fg-muted">Condiciones</span>
                </div>
                <ul className="space-y-1.5">
                  {CONDICIONES_GENERALES.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-fg-muted leading-snug">
                      <Check size={12} className="text-brand-bright shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand/5 border border-brand-bright/20 rounded-sm p-4 mb-6">
                <p className="text-sm text-fg-muted leading-relaxed">
                  Al enviar, abriremos WhatsApp con todos tus datos pre-escritos.
                  Confirmamos disponibilidad en horario hábil. El trabajo se entrega en <strong className="text-fg">{PLAZO}</strong>.
                </p>
              </div>

              <a
                href={buildWAMessage(form)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={registrarSolicitud}
                className="btn btn-whatsapp w-full"
              >
                Enviar solicitud por WhatsApp
                <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
              </a>
              {guardadoFallo && (
                <p role="alert" className="mt-3 text-sm text-danger">
                  No pudimos registrar tu solicitud en nuestro sistema. Envía el mensaje de WhatsApp: lleva todos tus datos.
                </p>
              )}
              <p className="mt-3 text-sm text-fg-subtle">
                ¿No se abrió WhatsApp? Escríbenos al{' '}
                <a href={EMPRESA.telefonoHref} className="underline hover:text-fg">{EMPRESA.telefono}</a>.
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-white/8">
              <button
                type="button"
                onClick={() => goTo(Math.max(1, step - 1) as Step)}
                className={`btn btn-secundario ${step === 1 ? 'invisible' : ''}`}
              >
                <ArrowLeft size={15} />
                Anterior
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(4, step + 1) as Step)}
                disabled={
                  (step === 1 && !canNext1) ||
                  (step === 2 && !canNext2) ||
                  (step === 3 && !canNext3)
                }
                className="btn btn-primario"
              >
                {step === 3 ? 'Ver resumen' : 'Siguiente'}
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-fg-subtle mt-6">
          Atención {EMPRESA.horario}, La Serena
        </p>
      </div>
    </div>
  )
}
