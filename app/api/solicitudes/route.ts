import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { clientIp, rateLimit } from '@/lib/security'

/**
 * POST /api/solicitudes
 * Registra una solicitud de servicio (wizard /agendar) en Supabase.
 * Corre server-side con SERVICE_ROLE_KEY, por lo que bypassa RLS.
 */
export async function POST(req: Request) {
  if (!rateLimit(`solicitudes:${clientIp(req)}`, 10, 60_000).ok) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const nombre = str(body.nombre)
  const telefono = str(body.telefono)
  const servicio = str(body.servicio)

  if (!nombre || !telefono || !servicio) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      servicio,
      servicio_label: str(body.servicioLabel) || null,
      equipo_tipo: str(body.equipoTipo) || null,
      marca: str(body.marca) || null,
      problema: str(body.problema) || null,
      foto_urls: Array.isArray(body.fotoUrls)
        ? body.fotoUrls.filter((u): u is string => typeof u === 'string').slice(0, 3)
        : [],
      nombre,
      telefono,
      fecha_preferida: str(body.fechaPreferida) || null,
      horario: str(body.horario) || null,
      origen: 'agendar',
    })
    .select('id')
    .single()

  if (error) {
    console.error('service_requests insert error:', error)
    return NextResponse.json({ error: 'No se pudo guardar la solicitud' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id })
}
