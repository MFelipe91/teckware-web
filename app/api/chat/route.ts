import { NextResponse } from 'next/server'
import { z } from 'zod'
import { SERVICIOS, PLAZO_DETALLE } from '@/lib/constants'
import { clientIp, rateLimit } from '@/lib/security'

// Solo mensajes de usuario/asistente: el cliente no puede inyectar instrucciones de sistema.
const bodySchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(2000),
  })).min(1).max(200),
})

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Groq retira modelos: GROQ_MODEL permite cambiarlo desde Vercel sin tocar el código.
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'

// Precios y plazos salen de lib/constants.ts: así el chatbot nunca queda desfasado del sitio.
const LISTA_SERVICIOS = SERVICIOS.map(
  (s) => `- ${s.nombre}: ${s.precio}${s.tiempo ? ` · ${s.tiempo}` : ''}. ${s.descripcion}`
).join('\n')

const SYSTEM_PROMPT = `Eres Teck, el asistente virtual de TECKWARE SpA, empresa de servicio técnico informático en La Serena, Chile. Tu objetivo es ayudar al cliente, resolver sus dudas y guiarlo a agendar o contactar por WhatsApp.

DATOS DE TECKWARE:
- Zona de atención: La Serena y Coquimbo. Los equipos se reciben en el taller de TECKWARE en La Serena, con hora coordinada por WhatsApp (no hay atención de público sin cita). No entregues la dirección: se envía al confirmar la hora.
- Visita a domicilio: poco común, solo para trabajos simples como formateo o configuración, con recargo según ubicación. Los trabajos de hardware se hacen en el taller.
- WhatsApp: +56 9 3020 9427
- Horario: Lunes a Viernes 10:00–18:30
- Web: teckware.cl
- Se emite BOLETA DE SERVICIO · TECKWARE SpA (empresa formal, RUT 78.398.912-3)

SERVICIOS Y PRECIOS (todos con IVA incluido):
${LISTA_SERVICIOS}
- Todos los servicios tienen garantía de 30 días.

PLAZO: ${PLAZO_DETALLE}. Son días hábiles (lunes a viernes). No prometas plazos más cortos ni "diagnóstico en el día".

EQUIPOS QUE ATENDEMOS: Notebooks, MacBook, PC Desktop, PC Gamer, PS3, PS4, PS5, Consolas, Tablets, iPad.

REGLAS:
- Responde SIEMPRE en español chileno, amable y directo.
- Máximo 3 oraciones por respuesta. Sé conciso.
- Para cotizaciones de PC Gamer a medida, invita a ver teckware.cl/builds o contactar por WhatsApp.
- Si el cliente quiere agendar, indícale teckware.cl/agendar.
- No inventes precios ni tiempos que no estén en la lista.
- No sabes qué horas hay libres: nunca digas que hay o que no hay disponibilidad, ni confirmes citas. Si piden atención para hoy o una hora puntual, responde que las horas se coordinan por WhatsApp con el técnico y que el trabajo se entrega en 48 horas hábiles.
- Si no sabes algo específico, deriva al WhatsApp: +56 9 3020 9427.
- Nunca menciones competidores.
- Si detectas urgencia (equipo quemado, datos perdidos, empresa paralizada), prioriza el WhatsApp inmediatamente.
- Siempre menciona que se emite boleta cuando pregunten por precio o facturación.`

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }

  const limit = rateLimit(`chat:${clientIp(req)}`, 15, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Demasiadas consultas' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }
  const { messages } = parsed.data

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(20_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      reasoning_effort: 'low',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10),
      ],
      max_tokens: 500,
      temperature: 0.6,
    }),
  }).catch((e: unknown) => {
    console.error('Groq sin respuesta:', e)
    return null
  })

  if (!res || !res.ok) {
    if (res) console.error('Groq error:', await res.text())
    return NextResponse.json({ error: 'IA no disponible' }, { status: 502 })
  }

  const data = await res.json()
  const text: string = data.choices?.[0]?.message?.content ?? ''

  return NextResponse.json({ text })
}
