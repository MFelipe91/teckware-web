'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { MessageSquare, X, Send, Loader2, MessageCircle, ShieldCheck, RotateCcw } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

type Message = { role: 'user' | 'assistant'; content: string }

const WELCOME: Message = {
  role: 'assistant',
  content: '¡Hola! Soy **Teck**, el asistente de TECKWARE. Te ayudo con precios, plazos y cómo agendar tu hora en el taller. ¿Qué equipo quieres revisar?',
}

const QUICK = [
  '¿Cuánto vale la mantención de mi PC gamer?',
  '¿Cuánto cuesta la mantención de una PS5?',
  'Quiero armar un PC gamer',
  '¿Cuánto demora el servicio?',
]

const LIMITE = 600
const CLAVE_SESION = 'teck-chat'

// Las respuestas vienen de un modelo de IA: se escapa todo el HTML antes de aplicar el formato.
function renderMd(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-fg">$1</strong>')
    .replace(/\n/g, '<br />')
}

function cargarSesion(): Message[] {
  try {
    const raw = sessionStorage.getItem(CLAVE_SESION)
    const data = raw ? (JSON.parse(raw) as Message[]) : null
    if (Array.isArray(data) && data.length > 0 && data.every((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')) {
      return data.slice(-30)
    }
  } catch { /* sin almacenamiento: se parte de cero */ }
  return [WELCOME]
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  // Mensajes ya vistos: lo que llega con el chat cerrado se marca como no leído.
  const [seenCount, setSeenCount] = useState(1)
  const unread = msgs.length > seenCount
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  // La conversación sigue al cambiar de página (solo en esta pestaña): se recupera al abrir el chat.
  const sesionCargada = useRef(false)
  const abrir = () => {
    if (!sesionCargada.current) {
      sesionCargada.current = true
      const previa = cargarSesion()
      if (previa.length > 1) setMsgs(previa)
    }
    setOpen(true)
  }
  useEffect(() => {
    if (!sesionCargada.current) return
    try { sessionStorage.setItem(CLAVE_SESION, JSON.stringify(msgs.slice(-30))) } catch { /* ignorar */ }
  }, [msgs])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); fabRef.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    // Solo dentro del panel: con el chat cerrado no debe mover la página.
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [msgs, open, loading])

  const sendText = useCallback(async (text: string, history: Message[]) => {
    const limpio = text.trim().slice(0, LIMITE)
    if (!limpio || loading) return

    const next = [...history, { role: 'user' as const, content: limpio }]
    setMsgs(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10) }),
      })

      if (res.status === 503) {
        setUnavailable(true)
        return
      }
      if (res.status === 429) {
        setMsgs(prev => [...prev, { role: 'assistant', content: 'Recibí muchas consultas seguidas. Espera un momento o escríbenos directo por WhatsApp.' }])
        return
      }

      const data = await res.json().catch(() => null) as { text?: string } | null
      if (!res.ok || !data?.text) throw new Error('Sin respuesta del asistente')
      setMsgs(prev => [...prev, { role: 'assistant', content: data.text as string }])
    } catch {
      setMsgs(prev => [...prev, {
        role: 'assistant',
        content: 'Ahora no pude responderte. Escríbenos directo por WhatsApp y te atiende el técnico.',
      }])
    } finally {
      setLoading(false)
    }
  }, [loading])

  const reiniciar = () => {
    setMsgs([WELCOME])
    setSeenCount(1)
    try { sessionStorage.removeItem(CLAVE_SESION) } catch { /* ignorar */ }
    inputRef.current?.focus()
  }

  const cerca = input.length > LIMITE - 100

  return (
    <>
      {/* Panel */}
      <div
        role="dialog"
        aria-label="Chat con Teck, asistente de TECKWARE"
        inert={!open}
        className={`fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-[10.5rem] lg:bottom-24 sm:right-6 z-50 w-full sm:w-[380px] sm:max-w-[calc(100vw-2rem)] origin-bottom-right transition-[opacity,scale,visibility] duration-200 ease-salida ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 motion-reduce:scale-100 pointer-events-none invisible'
        }`}
      >
        <div
          className="chat-panel flex flex-col overflow-hidden sm:rounded-2xl"
          style={{ height: 'min(560px, calc(100dvh - 9rem))' }}
        >
          {/* Encabezado */}
          <div className="chat-cabecera flex items-center gap-3 px-4 py-3 shrink-0">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-950 ring-2 ring-brand-bright/60">
              <Image src="/brand/isotipo.svg" alt="" width={26} height={30} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-whatsapp" aria-hidden="true" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg font-bold leading-tight text-fg">Teck · TECKWARE</p>
              <p className="meta-chica text-fg-muted">Asistente con IA · responde al instante</p>
            </div>
            {msgs.length > 1 && !unavailable && (
              <button
                onClick={reiniciar}
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full text-fg-muted hover:bg-white/8 hover:text-fg transition-colors"
                aria-label="Nueva conversación"
                title="Nueva conversación"
              >
                <RotateCcw size={18} />
              </button>
            )}
            <button
              onClick={() => { setOpen(false); setSeenCount(msgs.length); fabRef.current?.focus() }}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full text-fg-muted hover:bg-white/8 hover:text-fg transition-colors"
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            {unavailable ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <MessageCircle size={36} className="text-whatsapp" />
                <p className="text-fg-muted">El asistente no está disponible en este momento. Te atendemos directo por WhatsApp.</p>
                <a href={WA.general()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <MessageCircle size={18} aria-hidden="true" />
                  Chatear por WhatsApp
                </a>
              </div>
            ) : (
              <>
                {msgs.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-950 ring-1 ring-brand-bright/40" aria-hidden="true">
                        <Image src="/brand/isotipo.svg" alt="" width={15} height={17} />
                      </span>
                    )}
                    {msg.role === 'user' ? (
                      <div className="chat-burbuja-usuario max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed text-white">
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        className="chat-burbuja-teck max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed text-fg-muted"
                        dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }}
                      />
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2" role="status" aria-label="Teck está escribiendo">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-950 ring-1 ring-brand-bright/40" aria-hidden="true">
                      <Image src="/brand/isotipo.svg" alt="" width={15} height={17} />
                    </span>
                    <div className="chat-burbuja-teck flex items-center gap-1 px-4 py-3.5">
                      {[0, 150, 300].map(d => (
                        <span key={d} className="h-2 w-2 rounded-full bg-brand-bright animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Atajos: solo al comenzar */}
                {msgs.length === 1 && !loading && (
                  <div className="flex flex-wrap gap-2 pt-1 pl-9">
                    {QUICK.map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendText(q, msgs)}
                        className="min-h-11 rounded-full border border-brand-bright/35 px-3.5 py-2 text-left text-sm text-brand-bright hover:bg-brand/10 active:bg-brand/20 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Escribir */}
          {!unavailable && (
            <div className="shrink-0 border-t border-white/10 px-3 pt-3 pb-3">
              <form
                onSubmit={(e) => { e.preventDefault(); if (!loading) sendText(input, msgs) }}
                className="flex items-center gap-2 rounded-full border border-white/12 bg-ink-950/70 pl-4 pr-1.5 py-1.5 focus-within:border-brand-bright/60"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value.slice(0, LIMITE))}
                  placeholder="Escribe tu consulta…"
                  aria-label="Escribe tu consulta"
                  maxLength={LIMITE}
                  enterKeyHint="send"
                  autoComplete="off"
                  className="flex-1 min-w-0 bg-transparent py-1.5 text-base text-fg placeholder-fg-subtle outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cian text-ink-950 hover:bg-cian-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Enviar"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <span className="meta-chica flex items-center gap-1.5 text-fg-subtle">
                  <ShieldCheck size={14} className="text-brand-bright" aria-hidden="true" />
                  {cerca ? `${input.length}/${LIMITE} caracteres` : 'No compartas claves ni datos bancarios'}
                </span>
                <a
                  href={WA.general()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-chica inline-flex min-h-11 items-center gap-1.5 font-semibold text-whatsapp hover:underline"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  Hablar con una persona
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón flotante */}
      <button
        ref={fabRef}
        onClick={() => { if (open) setOpen(false); else abrir(); setSeenCount(msgs.length) }}
        type="button"
        className="fab chat-fab fixed bottom-0 right-0 sm:bottom-24 lg:bottom-6 sm:right-6 z-50 w-14 h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] sm:h-14 sm:pb-0 flex items-center justify-center"
        aria-label={open ? 'Cerrar chat' : 'Abrir chat con Teck, asistente con IA'}
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageSquare size={22} className="text-white" />
        }
        {unread && !open && (
          <span className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full border-2 border-brand bg-danger" />
        )}
      </button>
    </>
  )
}
