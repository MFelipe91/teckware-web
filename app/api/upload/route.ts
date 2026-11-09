import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { clientIp, rateLimit, mismoOrigen } from '@/lib/security'

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
const MARCAS_HEIC = new Set(['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'])

// El tipo que declara el navegador se puede falsificar: se revisa el contenido real del archivo.
function tipoReal(b: Buffer): string | null {
  if (b.length < 12) return null
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return 'image/webp'
  if (b.toString('latin1', 4, 8) === 'ftyp' && MARCAS_HEIC.has(b.toString('latin1', 8, 12))) return 'image/heic'
  return null
}

export async function POST(req: Request) {
  // Solo desde el propio sitio: frena el envío automatizado desde otras webs.
  if (!mismoOrigen(req)) {
    return NextResponse.json({ error: 'Origen no permitido' }, { status: 403 })
  }
  if (!rateLimit(`upload:${clientIp(req)}`, 10, 60_000).ok) {
    return NextResponse.json({ error: 'Demasiados intentos. Espera un minuto.' }, { status: 429 })
  }

  const supabase = createServerClient()

  // Las fotos de clientes son privadas: solo se ven desde /admin, con enlaces firmados.
  // Crea el bucket si falta y deja privado uno que ya existía como público.
  const opciones = { public: false, fileSizeLimit: MAX_SIZE, allowedMimeTypes: ALLOWED }
  await supabase.storage.createBucket(BUCKET, opciones)
  const { error: errorBucket } = await supabase.storage.updateBucket(BUCKET, opciones)
  if (errorBucket) {
    console.error('No se pudo dejar privado el bucket de fotos:', errorBucket)
    return NextResponse.json({ error: 'No se pudieron subir las fotos' }, { status: 500 })
  }

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'Sin archivos' }, { status: 400 })
  }
  if (files.length > 3) {
    return NextResponse.json({ error: 'Máximo 3 fotos' }, { status: 400 })
  }

  const paths: string[] = []

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: `Formato no válido: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Foto demasiado grande (máx 5 MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const tipo = tipoReal(buffer)
    if (!tipo) {
      return NextResponse.json({ error: 'El archivo no es una imagen válida' }, { status: 400 })
    }

    const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const path = `bookings/${uid}.${EXT[tipo]}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: tipo, upsert: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    paths.push(path)
  }

  return NextResponse.json({ paths })
}
