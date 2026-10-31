// Supabase falso para la auditoría: responde como PostgREST y Storage y registra lo que recibe.
// Existe para que los formularios y /admin corran su código real sin tocar la base de producción.
import http from 'node:http'

const PUERTO = 54399
const peticiones = []
const solicitudes = []

function leer(req) {
  return new Promise((resolve) => {
    const partes = []
    req.on('data', (p) => partes.push(p))
    req.on('end', () => resolve(Buffer.concat(partes)))
  })
}

function responder(res, estado, cuerpo) {
  res.writeHead(estado, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(cuerpo))
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${PUERTO}`)
    const cuerpo = await leer(req)

    if (url.pathname === '/__salud') return responder(res, 200, { ok: true })
    if (url.pathname === '/__registro') return responder(res, 200, { peticiones, solicitudes })

    const esJson = (req.headers['content-type'] ?? '').includes('application/json')
    const texto = esJson ? cuerpo.toString('utf8') : ''
    peticiones.push({
      metodo: req.method,
      ruta: url.pathname,
      bytes: cuerpo.length,
      cuerpo: texto.length < 2000 ? texto : `${texto.slice(0, 2000)}…`,
    })

    if (url.pathname === '/rest/v1/service_requests') {
      if (req.method === 'POST') {
        const fila = {
          id: `falso-${solicitudes.length + 1}`,
          created_at: new Date().toISOString(),
          estado: 'nuevo',
          ...JSON.parse(texto || '{}'),
        }
        solicitudes.push(fila)
        return responder(res, 201, { id: fila.id })
      }
      return responder(res, 200, [...solicitudes].reverse())
    }
    if (url.pathname.startsWith('/rest/v1/')) return responder(res, 200, [])
    if (url.pathname.startsWith('/storage/v1/bucket')) return responder(res, 200, { name: 'booking-photos' })
    if (url.pathname.startsWith('/storage/v1/object/sign/')) {
      const { paths = [] } = JSON.parse(texto || '{}')
      return responder(res, 200, paths.map((p) => ({ path: p, signedURL: `/object/sign/booking-photos/${p}?token=falso`, error: null })))
    }
    if (url.pathname.startsWith('/storage/v1/object/')) {
      return responder(res, 200, { Id: 'falso', Key: url.pathname.replace('/storage/v1/object/', '') })
    }
    return responder(res, 404, { message: 'ruta no simulada' })
  })
  .listen(PUERTO, '127.0.0.1')
