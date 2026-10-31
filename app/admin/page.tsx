'use client'

import { useState, useEffect, useTransition } from 'react'
import { Plus, Trash2, Eye, EyeOff, LogOut, Save, Lock, Inbox, Phone, RefreshCw, Wrench, Star } from 'lucide-react'
import {
  loginAction, logoutAction, isAuthedAction,
  getServiceRequestsAction, updateRequestStatusAction, deleteRequestAction,
  getServicesAction, upsertServiceAction, deleteServiceAction,
} from './actions'
import { ESTADOS, ICONOS_SERVICIO, type ServiceRequest, type ServiceRow } from '@/lib/admin-types'
import { SERVICIOS } from '@/lib/constants'

// Servicios cuyos textos, precio y plazo viven en el código (lib/constants.ts): en el panel se
// muestran pero no se editan, para que la web y el chatbot digan siempre lo mismo.
const PRECIO_CODIGO = new Map(SERVICIOS.map((s) => [s.id, s]))

const ESTADO_STYLE: Record<string, string> = {
  nuevo:       'bg-brand/15 text-brand-bright border-brand-bright/30',
  contactado:  'bg-warning/15 text-warning border-warning/30',
  agendado:    'bg-violet-500/15 text-violet-400 border-violet-500/30',
  en_proceso:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completado:  'bg-success/15 text-success border-success/30',
  cancelado:   'bg-white/5 text-fg-subtle border-white/10',
}

type Tab = 'solicitudes' | 'servicios'

const EMPTY_SERVICE: ServiceRow = {
  id: '', nombre: '', descripcion: '', precio: '', tiempo: '',
  icono: 'package', whatsapp_key: '', featured: false, activo: true, orden: 99,
}

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [pwError, setPwError]   = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [tab, setTab]           = useState<Tab>('solicitudes')
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [services, setServices] = useState<ServiceRow[]>([])
  const [savedId, setSavedId]   = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Restaurar sesión al cargar (cookie httpOnly)
  useEffect(() => {
    isAuthedAction().then((ok) => {
      setAuthed(ok)
      setChecking(false)
    })
  }, [])

  // Cargar datos cuando hay sesión
  useEffect(() => {
    if (!authed) return
    startTransition(async () => {
      const [r, s] = await Promise.all([getServiceRequestsAction(), getServicesAction()])
      setRequests(r)
      setServices(s)
    })
  }, [authed])

  function updateService(index: number, patch: Partial<ServiceRow>) {
    setServices((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  function saveService(index: number) {
    const svc = services[index]
    if (!svc.nombre.trim()) return
    startTransition(async () => {
      const { ok } = await upsertServiceAction(svc)
      if (ok) {
        setServices(await getServicesAction())
        setSavedId(svc.id || svc.nombre)
        setTimeout(() => setSavedId(null), 2000)
      }
    })
  }

  function removeService(index: number) {
    const svc = services[index]
    if (!svc.id) { setServices((l) => l.filter((_, i) => i !== index)); return }
    if (!confirm(`¿Eliminar el servicio "${svc.nombre}"?`)) return
    startTransition(async () => {
      await deleteServiceAction(svc.id)
      setServices(await getServicesAction())
    })
  }

  function addService() {
    setServices((l) => [...l, { ...EMPTY_SERVICE, orden: l.length }])
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const ok = await loginAction(password)
    if (ok) { setAuthed(true); setPwError(false); setPassword('') }
    else setPwError(true)
  }

  async function handleLogout() {
    await logoutAction()
    setAuthed(false)
  }

  function refreshRequests() {
    startTransition(async () => setRequests(await getServiceRequestsAction()))
  }

  function changeEstado(id: string, estado: string) {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, estado } : r)))
    startTransition(async () => { await updateRequestStatusAction(id, estado) })
  }

  function removeRequest(id: string) {
    if (!confirm('¿Eliminar esta solicitud?')) return
    setRequests((rs) => rs.filter((r) => r.id !== id))
    startTransition(async () => { await deleteRequestAction(id) })
  }

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  // LOADING inicial
  if (checking) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <RefreshCw className="animate-spin text-brand-bright" size={24} />
      </div>
    )
  }

  // LOGIN
  if (!authed) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-sm bg-brand/10 border border-brand-bright/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-brand-bright" />
            </div>
            <h1 className="text-2xl font-black text-fg mb-1">Panel Admin</h1>
            <p className="text-sm text-fg-subtle">TECKWARE SpA</p>
          </div>
          <form onSubmit={handleLogin} className="panel rounded-sm border border-white/10 p-6">
            <label htmlFor="admin-clave" className="text-sm font-semibold text-fg-muted block mb-2">Contraseña</label>
            <div className="relative mb-4">
              <input
                id="admin-clave"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false) }}
                placeholder="Ingresa la contraseña"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-10 text-sm text-fg placeholder-fg-subtle focus:outline-none transition-colors ${pwError ? 'border-danger/50' : 'border-white/15 focus:border-brand-bright/50'}`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-fg-subtle hover:text-fg-muted">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pwError && <p className="text-xs text-danger mb-4">Contraseña incorrecta</p>}
            <button type="submit" className="btn btn-primario w-full">
              Ingresar
            </button>
            <p className="text-center text-xs text-fg-subtle mt-4">
              Configura <code className="text-fg-muted">ADMIN_PASSWORD</code> en <code className="text-fg-muted">.env.local</code> y en Vercel.
            </p>
          </form>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-ink-900 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-fg">Panel Admin</h1>
            <p className="text-sm text-fg-subtle">
              {requests.filter((r) => r.estado === 'nuevo').length} solicitudes nuevas
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 border border-white/15 text-fg-muted font-medium rounded-sm hover:border-white/30 transition-all text-sm min-h-[40px]">
            <LogOut size={15} /> Salir
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/8">
          {([['solicitudes', 'Solicitudes', Inbox], ['servicios', 'Servicios', Wrench]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === id ? 'border-brand-bright text-brand-bright' : 'border-transparent text-fg-subtle hover:text-fg-muted'
              }`}
            >
              <Icon size={15} />
              {label}
              {id === 'solicitudes' && requests.filter((r) => r.estado === 'nuevo').length > 0 && (
                <span className="btn btn-primario">
                  {requests.filter((r) => r.estado === 'nuevo').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===== SOLICITUDES ===== */}
        {tab === 'solicitudes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-fg-subtle">{requests.length} solicitudes en total</p>
              <button onClick={refreshRequests} disabled={isPending} className="flex items-center gap-2 px-3 py-2 text-xs text-fg-muted border border-white/15 rounded-sm hover:border-white/30 transition-all disabled:opacity-40">
                <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} /> Actualizar
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="panel rounded-sm border border-white/10 p-12 text-center">
                <Inbox size={32} className="text-fg-subtle mx-auto mb-3" />
                <p className="text-sm text-fg-muted">Aún no hay solicitudes.</p>
                <p className="text-xs text-fg-subtle mt-1">Las solicitudes de /agendar aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="panel rounded-sm border border-white/10 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-fg">{r.nombre}</span>
                          <a href={`https://wa.me/${r.telefono.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-whatsapp hover:underline">
                            <Phone size={11} /> {r.telefono}
                          </a>
                          <span className="text-[10px] text-fg-subtle">{fmtFecha(r.created_at)}</span>
                        </div>
                        <p className="text-xs text-fg-muted mb-1">
                          <span className="text-brand-bright font-semibold">{r.servicio_label ?? r.servicio}</span>
                          {r.equipo_tipo && <span> · {r.equipo_tipo}{r.marca ? ` (${r.marca})` : ''}</span>}
                        </p>
                        {r.problema && <p className="text-xs text-fg-muted leading-relaxed">{r.problema}</p>}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {(r.horario || r.fecha_preferida) && (
                            <span className="text-[10px] text-fg-subtle">
                              📅 {r.fecha_preferida ?? 'a coordinar'} · {r.horario ?? 'a coordinar'}
                            </span>
                          )}
                          {r.foto_urls?.length > 0 && (
                            <div className="flex gap-1.5">
                              {r.foto_urls.map((u, i) => (
                                <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-brand-bright hover:bg-white/10">
                                  📷 Foto {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={r.estado}
                          onChange={(e) => changeEstado(r.id, e.target.value)}
                          className={`text-[11px] font-bold uppercase tracking-wider rounded-lg border px-2.5 py-1.5 bg-transparent focus:outline-none cursor-pointer ${ESTADO_STYLE[r.estado] ?? ESTADO_STYLE.nuevo}`}
                        >
                          {ESTADOS.map((e) => (
                            <option key={e} value={e} className="bg-ink-900 text-fg">{e.replace('_', ' ')}</option>
                          ))}
                        </select>
                        <button onClick={() => removeRequest(r.id)} className="w-8 h-8 flex items-center justify-center rounded-sm border border-white/15 text-fg-muted hover:border-danger/30 hover:text-danger transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== SERVICIOS ===== */}
        {tab === 'servicios' && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-sm text-fg-subtle">{services.length} servicios · edita precios y detalles, se reflejan en la web</p>
              <button
                onClick={addService}
                className="btn btn-primario"
              >
                <Plus size={16} strokeWidth={2.5} /> Nuevo servicio
              </button>
            </div>
            <div className="space-y-3">
              {services.map((s, i) => (
                <div key={s.id || `new-${i}`} className="panel rounded-sm border border-white/10 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-semibold text-fg-subtle block mb-1">Nombre</label>
                      {PRECIO_CODIGO.has(s.id) ? (
                        <p className="px-3 py-2 text-sm text-fg" title="Se edita en lib/constants.ts">{PRECIO_CODIGO.get(s.id)!.nombre}</p>
                      ) : (
                        <input value={s.nombre} onChange={(e) => updateService(i, { nombre: e.target.value })} placeholder="Nombre del servicio" className={INPUT} />
                      )}
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-semibold text-fg-subtle block mb-1">Precio</label>
                      {PRECIO_CODIGO.has(s.id) ? (
                        <p className="px-3 py-2 text-sm text-fg" title="Se edita en lib/constants.ts">{PRECIO_CODIGO.get(s.id)!.precio} <span className="block text-[10px] text-fg-subtle">Fijo en el código</span></p>
                      ) : (
                        <input value={s.precio} onChange={(e) => updateService(i, { precio: e.target.value })} placeholder="$45.000 / Desde $45.000 / A cotizar" className={INPUT} />
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-fg-subtle block mb-1">Tiempo</label>
                      {PRECIO_CODIGO.has(s.id) ? (
                        <p className="px-3 py-2 text-sm text-fg" title="Se edita en lib/constants.ts">{PRECIO_CODIGO.get(s.id)!.tiempo}</p>
                      ) : (
                        <input value={s.tiempo} onChange={(e) => updateService(i, { tiempo: e.target.value })} placeholder="48 h hábiles" className={INPUT} />
                      )}
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-semibold text-fg-subtle block mb-1">Ícono</label>
                      <select value={s.icono} onChange={(e) => updateService(i, { icono: e.target.value })} className={INPUT}>
                        {ICONOS_SERVICIO.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-12">
                      <label className="text-[10px] font-semibold text-fg-subtle block mb-1">Descripción</label>
                      {PRECIO_CODIGO.has(s.id) ? (
                        <p className="px-3 py-2 text-sm text-fg-muted" title="Se edita en lib/constants.ts">{PRECIO_CODIGO.get(s.id)!.descripcion}</p>
                      ) : (
                        <textarea value={s.descripcion} onChange={(e) => updateService(i, { descripcion: e.target.value })} rows={2} placeholder="Descripción del servicio..." className={INPUT + ' resize-none'} />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={s.featured} onChange={(e) => updateService(i, { featured: e.target.checked })} className="w-4 h-4 accent-brand-bright" />
                        <span className="flex items-center gap-1 text-xs text-fg-muted"><Star size={12} /> Destacado en home</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={s.activo} onChange={(e) => updateService(i, { activo: e.target.checked })} className="w-4 h-4 accent-emerald-400" />
                        <span className="text-xs text-fg-muted">Visible</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      {savedId === (s.id || s.nombre) && <span className="text-xs text-success">✓ Guardado</span>}
                      <button
                        onClick={() => saveService(i)}
                        disabled={isPending || !s.nombre.trim()}
                        className="btn btn-primario"
                      >
                        <Save size={14} /> Guardar
                      </button>
                      <button onClick={() => removeService(i)} className="w-9 h-9 flex items-center justify-center rounded-sm border border-white/15 text-fg-muted hover:border-danger/30 hover:text-danger transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-fg-subtle text-center mt-8">
              Los cambios se guardan en Supabase y aparecen en /servicios y en el home. El botón &quot;Guardar&quot; aplica cada servicio por separado.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const INPUT = 'w-full bg-white/5 border border-white/15 rounded-sm px-3 py-2.5 text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-brand-bright/50 transition-colors'
