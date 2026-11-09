import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { clientIp, rateLimit, solicitudSchema, mismoOrigen } from '@/lib/security'

/**
 * POST /api/solicitudes
 * Registra una solicitud de servicio (wizard /agendar) en Supabase.
 * Corre server-side con SERVICE_ROLE_KEY, por lo que bypassa RLS.
 */
export async function POST(req: Request) {
  // Solo desde el propio sitio: frena el envío automatizado desde otras webs.
  if (!mismoOrigen(req)) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 })
  }
  if (!rateLimit(`solicitudes:${clientIp(req)}`, 10, 60_000).ok) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  const json: unknown = await req.json().catch(() => null)
  const parsed = solicitudSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }
  const body = parsed.data

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      servicio: body.servicio,
      servicio_label: body.servicioLabel || null,
      equipo_tipo: body.equipoTipo || null,
      marca: body.marca || null,
      problema: body.problema || null,
      foto_urls: body.fotoUrls ?? [],
      nombre: body.nombre,
      telefono: body.telefono,
      fecha_preferida: body.fechaPreferida || null,
      horario: body.horario || null,
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
