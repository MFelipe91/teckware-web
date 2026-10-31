'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle } from 'lucide-react'
import {
  cotizacionSchema, filasCotizacion, FPS, MONITOR, PLAZOS, PRESUPUESTOS, RESOLUCIONES, USOS,
  type Cotizacion,
} from '@/lib/cotizacion'
import { WA } from '@/lib/whatsapp'

const CAMPO = 'w-full rounded-sm bg-ink-800 border border-white/15 px-4 py-3 text-base text-fg placeholder-fg-subtle focus:border-brand-bright/60'
const ETIQUETA = 'block mb-1.5 text-sm font-medium text-fg'
const AYUDA = 'text-fg-subtle font-normal'

function ErrorCampo({ id, mensaje }: { id: string; mensaje?: string }) {
  if (!mensaje) return null
  return <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">{mensaje}</p>
}

export function CotizacionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Cotizacion>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: { usos: [] },
  })
  const [datos, setDatos] = useState<Cotizacion | null>(null)
  const [fallo, setFallo] = useState(false)
  const registrada = useRef(false)
  const tituloResumen = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (datos) tituloResumen.current?.focus()
  }, [datos])

  const aria = (campo: keyof Cotizacion) => ({
    'aria-invalid': !!errors[campo],
    'aria-describedby': errors[campo] ? `${campo}-error` : undefined,
  })

  // Igual que /agendar: el botón es un enlace real a WhatsApp, así no lo frena el bloqueador de
  // ventanas. Guarda una sola vez; si falla, avisa y reintenta con el siguiente clic.
  function registrar() {
    if (registrada.current || !datos) return
    registrada.current = true
    setFallo(false)
    fetch('/api/cotizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      })
      .catch((e) => {
        console.error('No se pudo registrar la cotización:', e)
        registrada.current = false
        setFallo(true)
      })
  }

  if (datos) {
    return (
      <div className="max-w-2xl">
        <h3 ref={tituloResumen} tabIndex={-1} className="outline-none text-2xl text-fg">Revisa tu cotización</h3>
        <dl className="mt-5 border-t border-white/10">
          {filasCotizacion(datos).map((f) => (
            <div key={f.etiqueta} className="py-3 border-b border-white/10 grid gap-1 sm:grid-cols-[190px_minmax(0,1fr)]">
              <dt className="text-sm text-fg-subtle">{f.etiqueta}</dt>
              <dd className="text-fg break-words">{f.valor}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 mb-6 text-fg-muted">
          Al enviar se abre WhatsApp con este resumen listo. Te respondemos con una propuesta en horario hábil.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-3">
          <a
            href={WA.cotizacionPC(datos)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={registrar}
            className="btn btn-primario w-full sm:w-auto"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Enviar por WhatsApp
          </a>
          <button type="button" className="btn btn-secundario w-full sm:w-auto" onClick={() => setDatos(null)}>
            Editar respuestas
          </button>
        </div>
        {fallo && (
          <p role="alert" className="mt-4 text-sm text-danger">
            No pudimos registrar tu cotización en nuestro sistema. Envía el mensaje de WhatsApp: lleva todos tus datos.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(setDatos)} noValidate className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="presupuesto" className={ETIQUETA}>Presupuesto aproximado</label>
        <select id="presupuesto" defaultValue="" {...register('presupuesto')} {...aria('presupuesto')} className={CAMPO}>
          <option value="" disabled>Elige un rango</option>
          {PRESUPUESTOS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ErrorCampo id="presupuesto" mensaje={errors.presupuesto?.message} />
      </div>

      <fieldset>
        <legend className={ETIQUETA}>¿Para qué lo usarás?</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {USOS.map((u) => (
            <label key={u} className="inline-flex items-center gap-2.5 min-h-[32px] text-fg-muted cursor-pointer">
              <input type="checkbox" value={u} {...register('usos')} className="w-5 h-5 accent-brand" />
              {u}
            </label>
          ))}
        </div>
        <ErrorCampo id="usos" mensaje={errors.usos?.message} />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="resolucion" className={ETIQUETA}>Resolución</label>
          <select id="resolucion" defaultValue="" {...register('resolucion')} {...aria('resolucion')} className={CAMPO}>
            <option value="" disabled>Elige una opción</option>
            {RESOLUCIONES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ErrorCampo id="resolucion" mensaje={errors.resolucion?.message} />
        </div>
        <div>
          <label htmlFor="fps" className={ETIQUETA}>FPS que buscas</label>
          <select id="fps" defaultValue="" {...register('fps')} {...aria('fps')} className={CAMPO}>
            <option value="" disabled>Elige una opción</option>
            {FPS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ErrorCampo id="fps" mensaje={errors.fps?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="programas" className={ETIQUETA}>Juegos o programas principales</label>
        <textarea id="programas" rows={3} maxLength={500} {...register('programas')} {...aria('programas')} className={`${CAMPO} resize-none`} placeholder="Ej: Fortnite, Cyberpunk 2077, DaVinci Resolve" />
        <ErrorCampo id="programas" mensaje={errors.programas?.message} />
      </div>

      <div>
        <label htmlFor="marcas" className={ETIQUETA}>Marcas que prefieres <span className={AYUDA}>(opcional)</span></label>
        <input id="marcas" type="text" maxLength={200} {...register('marcas')} {...aria('marcas')} className={CAMPO} placeholder="Ej: AMD, NVIDIA, ASUS" />
        <ErrorCampo id="marcas" mensaje={errors.marcas?.message} />
      </div>

      <div>
        <label htmlFor="componentes" className={ETIQUETA}>Componentes que ya tienes <span className={AYUDA}>(opcional)</span></label>
        <textarea id="componentes" rows={2} maxLength={500} {...register('componentes')} {...aria('componentes')} className={`${CAMPO} resize-none`} placeholder="Ej: gabinete y fuente de 750 W" />
        <ErrorCampo id="componentes" mensaje={errors.componentes?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="monitor" className={ETIQUETA}>¿Necesitas monitor o periféricos?</label>
          <select id="monitor" defaultValue="" {...register('monitor')} {...aria('monitor')} className={CAMPO}>
            <option value="" disabled>Elige una opción</option>
            {MONITOR.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ErrorCampo id="monitor" mensaje={errors.monitor?.message} />
        </div>
        <div>
          <label htmlFor="plazo" className={ETIQUETA}>Plazo deseado</label>
          <select id="plazo" defaultValue="" {...register('plazo')} {...aria('plazo')} className={CAMPO}>
            <option value="" disabled>Elige una opción</option>
            {PLAZOS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ErrorCampo id="plazo" mensaje={errors.plazo?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={ETIQUETA}>Nombre</label>
          <input id="nombre" type="text" autoComplete="name" maxLength={80} {...register('nombre')} {...aria('nombre')} className={CAMPO} />
          <ErrorCampo id="nombre" mensaje={errors.nombre?.message} />
        </div>
        <div>
          <label htmlFor="telefono" className={ETIQUETA}>WhatsApp</label>
          <input id="telefono" type="tel" autoComplete="tel" {...register('telefono')} {...aria('telefono')} className={CAMPO} placeholder="+56 9 1234 5678" />
          <ErrorCampo id="telefono" mensaje={errors.telefono?.message} />
        </div>
      </div>

      <button type="submit" className="btn btn-primario w-full sm:w-auto">Revisar cotización</button>
    </form>
  )
}
