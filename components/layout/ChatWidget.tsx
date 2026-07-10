'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, X, Send, ArrowRight, Bot, Loader2 } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

type Message = { role: 'user' | 'assistant'; content: string }

const WELCOME: Message = {
  role: 'assistant',
  content: '¡Hola! Soy **Teck** 👋 el asistente de TECKWARE. ¿En qué te puedo ayudar hoy? Puedo cotizar servicios, informarte de tiempos de entrega o ayudarte a agendar tu visita.',
}

const QUICK = [
  '¿Cuánto vale el diagnóstico?',
  '¿Cuánto tarda un formateo?',
  'Quiero armar un PC Gamer',
]

function renderMd(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [unread, setUnread] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (!open && msgs.length > 1) setUnread(true)
  }, [msgs])

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

      const data = await res.json()
      setMsgs(prev => [...prev, { role: 'assistant', content: data.text }])
    } catch {
      setMsgs(prev => [...prev, {
        role: 'assistant',
        content: 'Tuve un problema de conexión. Escríbenos directo por WhatsApp 😊',
      }])
    } finally {
      setLoading(false)
    }
  }, [loading])

  return (
    <>
      {/* Panel */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] transition-all duration-300 ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        aria-live="polite"
      >
        <div
          className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0D1117] shadow-2xl shadow-black/60"
          style={{ height: 460 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#080B14] border-b border-white/8 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#00D4FF]/12 border border-[#00D4FF]/25 flex items-center justify-center">
              <Bot size={14} className="text-[#00D4FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#F1F5F9] leading-none mb-1">Teck · Asistente TECKWARE</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[10px] text-[#64748B]">En línea · responde al instante</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#475569] hover:text-[#94A3B8] transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Cerrar chat"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {unavailable ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <Bot size={32} className="text-[#475569]" />
                <p className="text-sm text-[#94A3B8]">El chat IA no está disponible en este momento.</p>
                <a
                  href={WA.general()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#00D4FF] text-[#03040A] font-bold rounded-xl text-sm hover:bg-[#00B8D9] transition-colors"
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
                      <div className="w-6 h-6 rounded-full bg-[#00D4FF]/12 border border-[#00D4FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={10} className="text-[#00D4FF]" />
                      </div>
                    )}
                    {msg.role === 'user' ? (
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-3 py-2 text-sm leading-relaxed bg-[#00D4FF]/15 text-[#F1F5F9]">
                        {msg.content}
                      </div>
                    ) : (
                      <div
                        className="max-w-[80%] rounded-2xl rounded-tl-sm px-3 py-2 text-sm leading-relaxed bg-white/5 text-[#94A3B8]"
                        dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }}
                      />
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#00D4FF]/12 border border-[#00D4FF]/20 flex items-center justify-center shrink-0">
                      <Bot size={10} className="text-[#00D4FF]" />
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-sm px-3 py-3 flex gap-1 items-center">
                      {[0, 150, 300].map(d => (
                        <span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-[#475569] animate-bounce"
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
                  onClick={() => sendText(q, msgs)}
                  className="text-[10px] px-2.5 py-1.5 rounded-full border border-[#00D4FF]/25 text-[#00D4FF] hover:bg-[#00D4FF]/8 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {!unavailable && (
            <div className="px-3 pb-3 shrink-0">
              <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && sendText(input, msgs)}
                  placeholder="Escribe tu consulta..."
                  className="flex-1 bg-transparent text-sm text-[#F1F5F9] placeholder-[#475569] outline-none min-w-0 py-1"
                  disabled={loading}
                />
                <button
                  onClick={() => sendText(input, msgs)}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center shrink-0 hover:bg-[#00B8D9] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Enviar"
                >
                  {loading
                    ? <Loader2 size={12} className="text-[#03040A] animate-spin" />
                    : <Send size={12} className="text-[#03040A]" />
                  }
                </button>
              </div>
              <div className="flex justify-between items-center mt-1.5 px-0.5">
                <span className="text-[9px] text-[#334155]">La IA puede cometer errores</span>
                <a
                  href={WA.general()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-[#475569] hover:text-[#00D4FF] transition-colors flex items-center gap-0.5"
                >
                  Preferir WhatsApp <ArrowRight size={8} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-[#00D4FF] hover:bg-[#00B8D9] shadow-lg shadow-[#00D4FF]/30 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={open ? 'Cerrar chat' : 'Abrir chat con Teck IA'}
      >
        {open
          ? <X size={22} className="text-[#03040A]" />
          : <MessageSquare size={22} className="text-[#03040A]" />
        }
        {unread && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#080B14]" />
        )}
      </button>
    </>
  )
}
