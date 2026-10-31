import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { clientIp, rateLimit } from '@/lib/security'
import { cotizacionSchema, resumenCotizacion } from '@/lib/cotizacion'

/**
 * POST /api/cotizaciones
 * Registra una cotización de PC Gamer a pedido (/builds) en la misma tabla de solicitudes,
 * para verla en /admin junto con las demás. El detalle queda en "problema".
 */
export async function POST(req: Request) {
  if (!rateLimit(`cotizaciones:${clientIp(req)}`, 10, 60_000).ok) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  const parsed = cotizacionSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }
  const c = parsed.data

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('service_requests')
    .insert({
      servicio: 'pc-gamer-a-pedido',
      servicio_label: 'PC Gamer a pedido',
      equipo_tipo: 'PC Gamer',
      marca: c.marcas || null,
      problema: resumenCotizacion(c),
      foto_urls: [],
      nombre: c.nombre,
      telefono: c.telefono,
      origen: 'builds',
    })
    .select('id')
    .single()

  if (error) {
    console.error('cotización insert error:', error)
    return NextResponse.json({ error: 'No se pudo guardar la cotización' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id })
}
