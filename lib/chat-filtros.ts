// Filtros del chatbot Teck. Se aplican en el servidor (app/api/chat/route.ts), antes y después
// del modelo de IA: el navegador se puede saltar cualquier control propio.
// Sin dependencias ni alias de rutas: se prueba directo con `node --test tests/unit/`.

export const LIMITE_MENSAJE = 600
export const LIMITE_HISTORIAL = 10

// Intentos de cambiar el rol del asistente o de sacarle sus instrucciones (prompt injection).
const INYECCION = [
  /ignor[ae]\w*\s+(todas?\s+)?(l[ao]s\s+)?(instrucciones|reglas|indicaciones)/i,
  /olvid[ae]\w*\s+(todas?\s+)?(l[ao]s\s+|tus\s+)?(instrucciones|reglas)/i,
  /ignore\s+(all\s+|any\s+|the\s+)?(previous|prior|above)?\s*(instructions|rules|prompts?)/i,
  /(system|developer)\s*prompt|prompt\s+(del\s+)?sistema|mensaje\s+(del\s+)?sistema/i,
  /(revela|muestra|repite|dime|imprime)\w*\s+(tus|las|el)\s+(instrucciones|reglas|prompt)/i,
  /\b(jailbreak|DAN\b|modo\s+desarrollador|developer\s+mode|god\s*mode)/i,
  /(a\s+partir\s+de\s+ahora|desde\s+ahora)\s+(eres|serás|actúa)/i,
  /\b(act\s+as|pretend\s+(to\s+be|you\s+are)|you\s+are\s+now)\b/i,
  /<\s*\/?\s*(system|assistant|instructions?)\s*>/i,
]

export function esInyeccion(texto: string): boolean {
  return INYECCION.some((r) => r.test(texto))
}

// Datos que nunca deben viajar al proveedor de IA: tarjetas y contraseñas.
const TARJETA = /\b(?:\d[ -]?){13,19}\b/g
const CLAVE = /\b(contrase[ñn]a|clave|password|pass|pin)\s*(es|:|=)?\s*\S+/gi

export function ocultarDatosSensibles(texto: string): { texto: string; oculto: boolean } {
  let oculto = false
  const limpio = texto
    .replace(TARJETA, (m) => {
      const digitos = m.replace(/\D/g, '')
      // Solo números con largo de tarjeta; un teléfono chileno tiene 9 a 11 dígitos.
      if (digitos.length < 13) return m
      oculto = true
      return '[dato oculto]'
    })
    .replace(CLAVE, (_m, palabra: string) => {
      oculto = true
      return `${palabra} [dato oculto]`
    })
  return { texto: limpio, oculto }
}

// Las respuestas solo pueden enlazar al sitio y al WhatsApp oficial.
const URL = /\bhttps?:\/\/[^\s)]+|\bwww\.[^\s)]+/gi
const PERMITIDOS = /^(https?:\/\/)?(www\.)?(teckware\.cl|wa\.me\/56930209427)(\/|\b|$)/i
// Si el modelo devuelve trozos de sus instrucciones, no se muestran.
const FUGA = /(DATOS DE TECKWARE:|REGLAS:|SEGURIDAD:|SERVICIOS Y PRECIOS \(todos)/

export function filtrarRespuesta(texto: string): string | null {
  if (FUGA.test(texto)) return null
  return texto
    .replace(URL, (u) => (PERMITIDOS.test(u) ? u : 'teckware.cl'))
    .slice(0, 1200)
    .trim()
}

export const RESPUESTA_FUERA_DE_TEMA =
  'Solo puedo ayudarte con los servicios de TECKWARE: mantención, servicio técnico, armado de PC, precios y cómo agendar. ¿En qué te ayudo con tu equipo?'

export const AVISO_DATO_OCULTO =
  'Por seguridad oculté un dato sensible de tu mensaje. Nunca compartas contraseñas ni datos bancarios por chat.'
