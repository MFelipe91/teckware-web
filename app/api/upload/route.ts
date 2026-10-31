import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { clientIp, rateLimit } from '@/lib/security'

const BUCKET = 'booking-photos'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
// La extensión sale del tipo validado, nunca del nombre que manda el cliente.
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
}
const ALLOWED = Object.keys(EXT)

export async function POST(req: Request) {
  if (!rateLimit(`upload:${clientIp(req)}`, 10, 60_000).ok) {
    return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429 })
  }

  const supabase = createServerClient()

  // Crear bucket si no existe (idempotente)
  await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_SIZE,
    allowedMimeTypes: ALLOWED,
  }).catch(() => {})

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'Sin archivos' }, { status: 400 })
  }
  if (files.length > 3) {
    return NextResponse.json({ error: 'Máximo 3 fotos' }, { status: 400 })
  }

  const urls: string[] = []

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: `Formato no válido: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Foto demasiado grande (máx 5 MB)' }, { status: 400 })
    }

    const ext = EXT[file.type]
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const path = `bookings/${uid}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return NextResponse.json({ urls })
}
