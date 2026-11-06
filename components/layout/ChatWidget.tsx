'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, X, Send, ArrowRight, Bot, Loader2 } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

type Message = { role: 'user' | 'assistant'; content: string }

const WELCOME: Message = {
  role: 'assistant',
  content: '¡Hola! Soy **Teck**, el asistente de TECKWARE. ¿En qué te puedo ayudar hoy? Puedo contarte precios y plazos, o ayudarte a agendar tu hora en el taller.',
}

const QUICK = [
  '¿Cuánto vale la mantención de mi PC gamer?',
  '¿Cuánto cuesta la mantención de una PS5?',
  'Quiero armar un PC Gamer',
]

// Las respuestas vienen de un modelo de IA: se escapa todo el HTML antes de aplicar el formato.
function renderMd(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
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
  }, [msgs, open])

  const sendText = useCallback(async (text: string, history: Message[]) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const next = [...history, userMsg]
    setMsgs(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })

      if (res.status === 503) {
        setUnavailable(true)
        return
      }

      const data = await res.json().catch(() => null) as { text?: string } | null
      if (!res.ok || !data?.text) throw new Error('Sin respuesta del asistente')
      setMsgs(prev => [...prev, { role: 'assistant', content: data.text as string }])
    } catch {
      setMsgs(prev => [...prev, {
        role: 'assistant',
        content: 'Ahora no pude responderte. Escríbenos directo por WhatsApp.',
      }])
    } finally {
      setLoading(false)
    }
  }, [loading])

  return (
    <>
      {/* Panel */}
      <div
        role="dialog"
        aria-label="Chat con Teck, asistente de TECKWARE"
        inert={!open}
        className={`fixed bottom-[4.5rem] sm:bottom-[10.5rem] right-4 sm:right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] origin-bottom-right transition-[opacity,scale,visibility] duration-200 ease-salida ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 motion-reduce:scale-100 pointer-events-none invisible'
        }`}
      >
        <div
          className="flex flex-col rounded-sm overflow-hidden border border-white/10 bg-ink-800 shadow-black/60"
          style={{ height: 'min(460px, calc(100dvh - 12rem))' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-ink-900 border-b border-white/8 shrink-0">
            <div className="w-8 h-8 rounded-sm bg-brand/12 border border-brand-bright/25 flex items-center justify-center">
              <Bot size={14} className="text-brand-bright" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-fg leading-none mb-1">Teck, asistente de TECKWARE</p>
              <div className="flex items-center gap-1.5">
                <span className="meta-chica text-fg-subtle">Asistente virtual. Te ayuda a cotizar</span>
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); setSeenCount(msgs.length); fabRef.current?.focus() }}
              type="button"
              className="text-fg-subtle hover:text-fg-muted transition-colors p-2 rounded-sm hover:bg-white/5"
              aria-label="Cerrar chat"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            {unavailable ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <Bot size={32} className="text-fg-subtle" />
                <p className="text-sm text-fg-muted">El chat IA no está disponible en este momento.</p>
                <a
                  href={WA.general()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primario"
                >
                  Chatear por WhatsApp
                  <ArrowRight size={14} />
                </a>
              </div>
            ) : (
              <>
                {msgs.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-sm bg-brand/12 border border-brand-bright/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={10} className="text-brand-bright" />
                      </div>
                    )}
                    {msg.role === 'user' ? (
                      <div className="max-w-[80%] rounded-sm rounded-tr-sm px-3 py-2 text-sm leading-relaxed bg-brand/15 text-fg">
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        className="max-w-[80%] rounded-sm rounded-tl-sm px-3 py-2 text-sm leading-relaxed bg-white/5 text-fg-muted"
                        dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }}
                      />
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-sm bg-brand/12 border border-brand-bright/20 flex items-center justify-center shrink-0">
                      <Bot size={10} className="text-brand-bright" />
                    </div>
                    <div className="bg-white/5 rounded-sm rounded-tl-sm px-3 py-3 flex gap-1 items-center">
                      {[0, 150, 300].map(d => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-fg-subtle animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Quick replies — solo en el primer mensaje */}
          {msgs.length === 1 && !unavailable && (
            <div className="px-4 pb-2 flex gap-1.5 flex-wrap shrink-0">
              {QUICK.map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendText(q, msgs)}
                  className="text-sm px-3 py-1.5 rounded-sm border border-brand-bright/25 text-brand-bright hover:bg-brand/8 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {!unavailable && (
            <div className="px-3 pb-3 shrink-0">
              <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-sm px-3 py-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && sendText(input, msgs)}
                  placeholder="Escribe tu consulta..."
                  aria-label="Escribe tu consulta"
                  maxLength={1000}
                  className="flex-1 bg-transparent text-base sm:text-sm text-fg placeholder-fg-subtle outline-none min-w-0 py-1"
                  disabled={loading}
                />
                <button
                  onClick={() => sendText(input, msgs)}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-sm bg-brand flex items-center justify-center shrink-0 hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Enviar"
                >
                  {loading
                    ? <Loader2 size={12} className="text-white animate-spin" />
                    : <Send size={12} className="text-white" />
                  }
                </button>
              </div>
              <div className="flex justify-between items-center mt-1.5 px-0.5">
                <span className="meta-chica text-fg-subtle">La IA puede cometer errores</span>
                <a
                  href={WA.general()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-chica text-fg-subtle hover:text-brand-bright transition-colors flex items-center gap-1"
                >
                  Preferir WhatsApp <ArrowRight size={11} aria-hidden="true" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        ref={fabRef}
        onClick={() => { setOpen(o => !o); setSeenCount(msgs.length) }}
        type="button"
        className="fab fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-50 w-14 h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] sm:h-14 sm:pb-0 bg-brand hover:bg-brand-hover flex items-center justify-center"
        aria-label={open ? 'Cerrar chat' : 'Abrir chat con Teck IA'}
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageSquare size={22} className="text-white" />
        }
        {unread && !open && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full" />
        )}
      </button>
    </>
  )
}
