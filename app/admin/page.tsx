'use client'

import { useState, useEffect, useTransition } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut, Save, X, Video, Lock, Inbox, Cpu, Phone, RefreshCw, Wrench, Star } from 'lucide-react'
import {
  loginAction, logoutAction, isAuthedAction,
  getBuildsAction, upsertBuildAction, deleteBuildAction,
  getServiceRequestsAction, updateRequestStatusAction, deleteRequestAction,
  getServicesAction, upsertServiceAction, deleteServiceAction,
} from './actions'
import { ESTADOS, ICONOS_SERVICIO, type ServiceRequest, type ServiceRow } from '@/lib/admin-types'
import type { Build } from '@/lib/builds-data'
import { INITIAL_BUILDS } from '@/lib/builds-data'

const EMPTY_BUILD: Build = {
  id: '', nombre: '', tag: 'Nuevo', tagColor: 'cyan', descripcion: '',
  precio: 0, disponible: true, featured: false,
  specs: { cpu: '', gpu: '', ram: '', storage: '', motherboard: '', psu: '', cooling: '', case: '' },
  fps: { fortnite: '', warzone: '', valorant: '', cyberpunk: '', gta5: '' },
  youtubeId: '',
}

const ESTADO_STYLE: Record<string, string> = {
  nuevo:       'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30',
  contactado:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
  agendado:    'bg-violet-500/15 text-violet-400 border-violet-500/30',
  en_proceso:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completado:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelado:   'bg-white/5 text-[#475569] border-white/10',
}

type Tab = 'solicitudes' | 'servicios' | 'builds'

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
  const [builds, setBuilds]     = useState<Build[]>([])
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [services, setServices] = useState<ServiceRow[]>([])
  const [savedId, setSavedId]   = useState<string | null>(null)
  const [editing, setEditing]   = useState<Build | null>(null)
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
      const [b, r, s] = await Promise.all([getBuildsAction(), getServiceRequestsAction(), getServicesAction()])
      setBuilds(b.length ? b : INITIAL_BUILDS)
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

  function handleSave() {
    if (!editing) return
    const build = { ...editing, id: editing.id || editing.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
    startTransition(async () => {
      await upsertBuildAction(build)
      setBuilds(await getBuildsAction())
      setEditing(null)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar este build?')) return
    startTransition(async () => {
      await deleteBuildAction(id)
      setBuilds(await getBuildsAction())
    })
  }

  function setSpec(key: keyof Build['specs'], val: string) {
    setEditing((e) => e ? { ...e, specs: { ...e.specs, [key]: val } } : e)
  }
  function setFps(key: keyof NonNullable<Build['fps']>, val: string) {
    setEditing((e) => e ? { ...e, fps: { ...e.fps, [key]: val } } : e)
  }

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  // LOADING inicial
  if (checking) {
    return (
      <div className="min-h-screen bg-[#03040A] flex items-center justify-center">
        <RefreshCw className="animate-spin text-[#00D4FF]" size={24} />
      </div>
    )
  }

  // LOGIN
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#03040A] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-[#00D4FF]" />
            </div>
            <h1 className="text-2xl font-black text-[#F1F5F9] mb-1">Panel Admin</h1>
            <p className="text-sm text-[#475569]">TECKWARE SpA</p>
          </div>
          <form onSubmit={handleLogin} className="glass-card rounded-2xl border border-white/10 p-6">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">Contraseña</label>
            <div className="relative mb-4">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false) }}
                placeholder="Ingresa la contraseña"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-10 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none transition-colors ${pwError ? 'border-red-500/50' : 'border-white/15 focus:border-[#00D4FF]/50'}`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8]">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pwError && <p className="text-xs text-red-400 mb-4">Contraseña incorrecta</p>}
            <button type="submit" className="w-full py-3 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors min-h-[44px]">
              Ingresar
            </button>
            <p className="text-center text-xs text-[#475569] mt-4">
              Configura <code className="text-[#94A3B8]">ADMIN_PASSWORD</code> en <code className="text-[#94A3B8]">.env.local</code> y en Vercel.
            </p>
          </form>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-[#080B14] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#F1F5F9]">Panel Admin</h1>
            <p className="text-sm text-[#475569]">
              {requests.filter((r) => r.estado === 'nuevo').length} solicitudes nuevas · {builds.length} builds
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 border border-white/15 text-[#94A3B8] font-medium rounded-xl hover:border-white/30 transition-all text-sm min-h-[40px]">
            <LogOut size={15} /> Salir
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/8">
          {([['solicitudes', 'Solicitudes', Inbox], ['servicios', 'Servicios', Wrench], ['builds', 'Builds', Cpu]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === id ? 'border-[#00D4FF] text-[#00D4FF]' : 'border-transparent text-[#475569] hover:text-[#94A3B8]'
              }`}
            >
              <Icon size={15} />
              {label}
              {id === 'solicitudes' && requests.filter((r) => r.estado === 'nuevo').length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#00D4FF] text-[#03040A]">
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
              <p className="text-sm text-[#475569]">{requests.length} solicitudes en total</p>
              <button onClick={refreshRequests} disabled={isPending} className="flex items-center gap-2 px-3 py-2 text-xs text-[#94A3B8] border border-white/15 rounded-lg hover:border-white/30 transition-all disabled:opacity-40">
                <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} /> Actualizar
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="glass-card rounded-2xl border border-white/10 p-12 text-center">
                <Inbox size={32} className="text-[#475569] mx-auto mb-3" />
                <p className="text-sm text-[#94A3B8]">Aún no hay solicitudes.</p>
                <p className="text-xs text-[#475569] mt-1">Las solicitudes de /agendar aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="glass-card rounded-2xl border border-white/10 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-[#F1F5F9]">{r.nombre}</span>
                          <a href={`https://wa.me/${r.telefono.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#22C55E] hover:underline">
                            <Phone size={11} /> {r.telefono}
                          </a>
                          <span className="text-[10px] text-[#475569]">{fmtFecha(r.created_at)}</span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mb-1">
                          <span className="text-[#00D4FF] font-semibold">{r.servicio_label ?? r.servicio}</span>
                          {r.equipo_tipo && <span> · {r.equipo_tipo}{r.marca ? ` (${r.marca})` : ''}</span>}
                        </p>
                        {r.problema && <p className="text-xs text-[#8B9DB5] leading-relaxed">{r.problema}</p>}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {(r.horario || r.fecha_preferida) && (
                            <span className="text-[10px] text-[#475569]">
                              📅 {r.fecha_preferida ?? 'a coordinar'} · {r.horario ?? 'a coordinar'}
                            </span>
                          )}
                          {r.foto_urls?.length > 0 && (
                            <div className="flex gap-1.5">
                              {r.foto_urls.map((u, i) => (
                                <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#00D4FF] hover:bg-white/10">
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
                            <option key={e} value={e} className="bg-[#080B14] text-[#F1F5F9]">{e.replace('_', ' ')}</option>
                          ))}
                        </select>
                        <button onClick={() => removeRequest(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/15 text-[#94A3B8] hover:border-red-500/30 hover:text-red-400 transition-all">
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
              <p className="text-sm text-[#475569]">{services.length} servicios · edita precios y detalles, se reflejan en la web</p>
              <button
                onClick={addService}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors text-sm min-h-[40px]"
              >
                <Plus size={16} strokeWidth={2.5} /> Nuevo servicio
              </button>
            </div>
            <div className="space-y-3">
              {services.map((s, i) => (
                <div key={s.id || `new-${i}`} className="glass-card rounded-2xl border border-white/10 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Nombre</label>
                      <input value={s.nombre} onChange={(e) => updateService(i, { nombre: e.target.value })} placeholder="Nombre del servicio" className={INPUT} />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Precio</label>
                      <input value={s.precio} onChange={(e) => updateService(i, { precio: e.target.value })} placeholder="$40.000 / Desde $45.000 / A cotizar" className={INPUT} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Tiempo</label>
                      <input value={s.tiempo} onChange={(e) => updateService(i, { tiempo: e.target.value })} placeholder="24–48 h" className={INPUT} />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Ícono</label>
                      <select value={s.icono} onChange={(e) => updateService(i, { icono: e.target.value })} className={INPUT}>
                        {ICONOS_SERVICIO.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-12">
                      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1">Descripción</label>
                      <textarea value={s.descripcion} onChange={(e) => updateService(i, { descripcion: e.target.value })} rows={2} placeholder="Descripción del servicio..." className={INPUT + ' resize-none'} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={s.featured} onChange={(e) => updateService(i, { featured: e.target.checked })} className="w-4 h-4 accent-[#00D4FF]" />
                        <span className="flex items-center gap-1 text-xs text-[#94A3B8]"><Star size={12} /> Destacado en home</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={s.activo} onChange={(e) => updateService(i, { activo: e.target.checked })} className="w-4 h-4 accent-emerald-400" />
                        <span className="text-xs text-[#94A3B8]">Visible</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      {savedId === (s.id || s.nombre) && <span className="text-xs text-emerald-400">✓ Guardado</span>}
                      <button
                        onClick={() => saveService(i)}
                        disabled={isPending || !s.nombre.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#03040A] text-sm font-bold rounded-lg hover:bg-[#00A8CC] transition-colors disabled:opacity-40 min-h-[38px]"
                      >
                        <Save size={14} /> Guardar
                      </button>
                      <button onClick={() => removeService(i)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/15 text-[#94A3B8] hover:border-red-500/30 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#475569] text-center mt-8">
              Los cambios se guardan en Supabase y aparecen en /servicios y en el home. El botón &quot;Guardar&quot; aplica cada servicio por separado.
            </p>
          </div>
        )}

        {/* ===== BUILDS ===== */}
        {tab === 'builds' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setEditing({ ...EMPTY_BUILD })}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors text-sm min-h-[40px]"
              >
                <Plus size={16} strokeWidth={2.5} /> Nuevo build
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {builds.map((build) => (
                <div key={build.id} className="glass-card rounded-2xl border border-white/10 p-5 flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-[#A855F7]">{build.nombre.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-[#F1F5F9]">{build.nombre}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border ${build.disponible ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-[#475569] border-white/10'}`}>
                        {build.disponible ? 'Disponible' : 'Bajo pedido'}
                      </span>
                      {build.youtubeId && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
                          <Video size={8} /> Video
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#475569] truncate">{build.specs.cpu} · {build.specs.gpu}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#F1F5F9]">${build.precio.toLocaleString('es-CL')}</div>
                    <div className="text-[10px] text-[#475569]">{build.tag}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditing({ ...build })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/15 text-[#94A3B8] hover:border-[#00D4FF]/30 hover:text-[#00D4FF] transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(build.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/15 text-[#94A3B8] hover:border-red-500/30 hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#475569] text-center mt-8">
              Nota: los builds aún se guardan en archivo. Próximo paso: migrarlos a Supabase para producción en Vercel.
            </p>
          </div>
        )}
      </div>

      {/* Edit modal (builds) */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#080B14] border border-white/15 rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-[#F1F5F9]">{editing.id ? 'Editar build' : 'Nuevo build'}</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/15 text-[#94A3B8] hover:border-white/30 transition-all">
                <X size={15} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre del build *">
                  <input value={editing.nombre} onChange={(e) => setEditing({ ...editing, nombre: e.target.value })} placeholder="Ej: Mid Beast Pro" className={INPUT} />
                </Field>
                <Field label="Tag">
                  <input value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} placeholder="Más Pedido" className={INPUT} />
                </Field>
                <Field label="Precio (CLP) *">
                  <input type="number" value={editing.precio || ''} onChange={(e) => setEditing({ ...editing, precio: Number(e.target.value) })} placeholder="1890000" className={INPUT} />
                </Field>
                <Field label="Color del tag">
                  <select value={editing.tagColor} onChange={(e) => setEditing({ ...editing, tagColor: e.target.value as Build['tagColor'] })} className={INPUT}>
                    <option value="cyan">Cyan</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                  </select>
                </Field>
              </div>
              <Field label="Descripción">
                <textarea value={editing.descripcion} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} rows={2} placeholder="Descripción corta del build..." className={INPUT + ' resize-none'} />
              </Field>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.disponible} onChange={(e) => setEditing({ ...editing, disponible: e.target.checked })} className="w-4 h-4 accent-[#00D4FF]" />
                  <span className="text-sm text-[#94A3B8]">Disponible ahora</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-[#A855F7]" />
                  <span className="text-sm text-[#94A3B8]">Destacado en home</span>
                </label>
              </div>
              <div>
                <div className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">Especificaciones</div>
                <div className="grid grid-cols-2 gap-3">
                  {(['cpu', 'gpu', 'ram', 'storage', 'motherboard', 'psu', 'cooling', 'case'] as const).map((key) => (
                    <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                      <input value={editing.specs[key] ?? ''} onChange={(e) => setSpec(key, e.target.value)} placeholder={`Ej: AMD Ryzen 7 9700X`} className={INPUT} />
                    </Field>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">FPS Estimados (opcional)</div>
                <div className="grid grid-cols-2 gap-3">
                  {(['fortnite', 'warzone', 'valorant', 'cyberpunk', 'gta5'] as const).map((key) => (
                    <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                      <input value={editing.fps?.[key] ?? ''} onChange={(e) => setFps(key, e.target.value)} placeholder="280–350 FPS" className={INPUT} />
                    </Field>
                  ))}
                </div>
              </div>
              <Field label="ID de video YouTube (benchmark)">
                <div className="relative">
                  <Video size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
                  <input
                    value={editing.youtubeId}
                    onChange={(e) => setEditing({ ...editing, youtubeId: e.target.value.replace('https://www.youtube.com/watch?v=', '').replace('https://youtu.be/', '') })}
                    placeholder="ID del video o URL completa de YouTube"
                    className={INPUT + ' pl-8'}
                  />
                </div>
              </Field>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={handleSave} disabled={isPending || !editing.nombre || !editing.precio} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]">
                <Save size={15} />
                {isPending ? 'Guardando...' : 'Guardar build'}
              </button>
              <button onClick={() => setEditing(null)} className="px-6 py-3 border border-white/15 text-[#94A3B8] font-medium rounded-xl hover:border-white/30 transition-all min-h-[44px]">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const INPUT = 'w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:border-[#00D4FF]/50 transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  )
}
