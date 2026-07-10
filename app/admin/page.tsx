'use client'

import { useState, useEffect, useTransition } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut, Save, X, Video, Lock } from 'lucide-react'
import { checkPasswordAction, getBuildsAction, upsertBuildAction, deleteBuildAction } from './actions'
import type { Build } from '@/lib/builds-data'
import { INITIAL_BUILDS } from '@/lib/builds-data'

const EMPTY_BUILD: Build = {
  id: '', nombre: '', tag: 'Nuevo', tagColor: 'cyan', descripcion: '',
  precio: 0, disponible: true, featured: false,
  specs: { cpu: '', gpu: '', ram: '', storage: '', motherboard: '', psu: '', cooling: '', case: '' },
  fps: { fortnite: '', warzone: '', valorant: '', cyberpunk: '', gta5: '' },
  youtubeId: '',
}

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError]   = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [builds, setBuilds]     = useState<Build[]>([])
  const [editing, setEditing]   = useState<Build | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (authed) {
      startTransition(async () => {
        const data = await getBuildsAction()
        setBuilds(data.length ? data : INITIAL_BUILDS)
      })
    }
  }, [authed])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const ok = await checkPasswordAction(password)
    if (ok) { setAuthed(true); setPwError(false) }
    else setPwError(true)
  }

  function handleSave() {
    if (!editing) return
    const build = { ...editing, id: editing.id || editing.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
    startTransition(async () => {
      await upsertBuildAction(build)
      const data = await getBuildsAction()
      setBuilds(data)
      setEditing(null)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('¿Eliminar este build?')) return
    startTransition(async () => {
      await deleteBuildAction(id)
      const data = await getBuildsAction()
      setBuilds(data)
    })
  }

  function setSpec(key: keyof Build['specs'], val: string) {
    setEditing((e) => e ? { ...e, specs: { ...e.specs, [key]: val } } : e)
  }

  function setFps(key: keyof NonNullable<Build['fps']>, val: string) {
    setEditing((e) => e ? { ...e, fps: { ...e.fps, [key]: val } } : e)
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
              Contraseña por defecto: <code className="text-[#94A3B8]">teckware2026</code><br />
              Cambia con <code className="text-[#94A3B8]">ADMIN_PASSWORD</code> en .env.local
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#F1F5F9]">Panel Admin</h1>
            <p className="text-sm text-[#475569]">{builds.length} builds en catálogo</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditing({ ...EMPTY_BUILD })}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl hover:bg-[#00A8CC] transition-colors text-sm min-h-[40px]"
            >
              <Plus size={16} strokeWidth={2.5} />
              Nuevo build
            </button>
            <button onClick={() => setAuthed(false)} className="flex items-center gap-2 px-4 py-2.5 border border-white/15 text-[#94A3B8] font-medium rounded-xl hover:border-white/30 transition-all text-sm min-h-[40px]">
              <LogOut size={15} />
              Salir
            </button>
          </div>
        </div>

        {/* Builds list */}
        <div className="grid grid-cols-1 gap-4 mb-8">
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

        <p className="text-xs text-[#475569] text-center">
          Los cambios se guardan en <code className="text-[#94A3B8]">data/builds.json</code> · Para producción en Vercel, configura Supabase
        </p>
      </div>

      {/* Edit modal */}
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
              {/* Básicos */}
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

              {/* Specs */}
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

              {/* FPS */}
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

              {/* YouTube */}
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
                <p className="text-[10px] text-[#475569] mt-1">Pega la URL de YouTube o solo el ID del video</p>
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
