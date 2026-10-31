import { test, expect, type Page } from '@playwright/test'
import { SERVICIOS, precioServicio } from '../../lib/constants'
import { aislarNavegador, exigirSupabaseFalso, guardar, registroFalso, type Caso } from './comun'

const NUMERO = '56930209427'
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)
const png = (name = 'foto.png') => ({ name, mimeType: 'image/png', buffer: PNG })

// Próximo día con ese número de semana (1 = lunes, 6 = sábado), al menos a 2 días de hoy.
function proximo(diaSemana: number): string {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  while (d.getDay() !== diaSemana) d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function nuevoRegistro() {
  const casos: Caso[] = []
  const anotar = (caso: string, esperado: string, obtenido: unknown, ok: boolean) => {
    casos.push({ caso, esperado, obtenido: String(obtenido), ok })
  }
  return { casos, anotar }
}

const siguiente = (page: Page) => page.getByRole('button', { name: /^(Siguiente|Ver resumen)/ })

async function irAlPaso2(page: Page) {
  await page.goto('/agendar')
  await page.getByRole('button', { name: /Mantención Full/ }).click()
  await siguiente(page).click()
  await page.getByRole('button', { name: 'Notebook', exact: true }).click()
}

async function irAlResumen(page: Page) {
  await irAlPaso2(page)
  await page.getByLabel(/Describe el problema/).fill('Se apaga solo al jugar')
  await siguiente(page).click()
  await page.getByLabel(/Tu nombre/).fill('Prueba Auditoria')
  await page.getByLabel(/Teléfono/).fill('+56 9 1111 2222')
  await siguiente(page).click()
}

test.beforeAll(async ({ request, baseURL }) => {
  await exigirSupabaseFalso(request, baseURL)
})

test('/agendar', async ({ page, context, request }) => {
  const bloqueadas = await aislarNavegador(context)
  const { casos, anotar } = nuevoRegistro()

  await page.goto('/agendar')
  anotar('Paso 1 sin servicio', 'Siguiente deshabilitado', await siguiente(page).isDisabled(), await siguiente(page).isDisabled())

  const esperados = [
    ['Diagnóstico / Revisión', precioServicio('diagnostico')],
    ['Mantención Lógica', precioServicio('mantencion-logica')],
    ['Mantención Full', precioServicio('mantencion-full')],
    ['Armado PC Gamer', precioServicio('armado-estandar')],
  ] as const
  for (const [nombre, precio] of esperados) {
    const texto = await page.getByRole('button', { name: new RegExp(nombre) }).innerText()
    anotar(`Precio de ${nombre}`, precio, texto.split('\n').at(-1), texto.includes(precio))
  }

  await irAlPaso2(page)
  await page.getByLabel(/Describe el problema/).fill('    ')
  const conEspacios = await siguiente(page).isDisabled()
  anotar('Problema solo con espacios', 'Siguiente deshabilitado', conEspacios, conEspacios)
  await page.getByLabel(/Describe el problema/).fill('Se apaga solo al jugar')

  // Fotos: tipo, tamaño, cantidad y subida correcta.
  const entrada = page.locator('input[type="file"]')
  const errorFoto = page.locator('p.text-danger').first()

  await entrada.setInputFiles({ name: 'a.gif', mimeType: 'image/gif', buffer: PNG })
  await errorFoto.waitFor({ timeout: 30_000 })
  anotar('Foto GIF', 'Rechazada con mensaje', await errorFoto.innerText(), /Formato no válido/.test(await errorFoto.innerText()))

  await entrada.setInputFiles({ name: 'g.png', mimeType: 'image/png', buffer: Buffer.alloc(6 * 1024 * 1024, 1) })
  await page.getByText(/demasiado grande/).waitFor({ timeout: 30_000 })
  anotar('Foto de 6 MB', 'Rechazada con mensaje', await errorFoto.innerText(), true)

  await entrada.setInputFiles([png('1.png'), png('2.png'), png('3.png'), png('4.png')])
  await page.getByText(/Máximo 3 fotos/).waitFor()
  anotar('4 fotos a la vez', 'Rechazadas con mensaje', await errorFoto.innerText(), true)

  await entrada.setInputFiles(png())
  await page.getByAltText('Foto 1').waitFor({ timeout: 30_000 })
  await expect(page.getByText('Subiendo fotos...')).toHaveCount(0, { timeout: 30_000 })
  anotar('Foto PNG válida', 'Se ve la miniatura', 'miniatura visible', true)

  await siguiente(page).click()

  // Paso 3.
  const vacio = await siguiente(page).isDisabled()
  anotar('Paso 3 vacío', 'Ver resumen deshabilitado', vacio, vacio)
  await page.getByLabel(/Tu nombre/).fill('x')
  await page.getByLabel(/Teléfono/).fill('abc')
  const invalidoBloquea = await siguiente(page).isDisabled()
  anotar('Nombre "x" y teléfono "abc"', 'Rechazados (como en /solicitar)', invalidoBloquea ? 'rechazados' : 'aceptados: se puede continuar', invalidoBloquea)

  const fecha = page.getByLabel(/Fecha preferida/)
  await fecha.fill(proximo(6))
  const alerta = page.getByRole('alert').filter({ hasText: /lunes a viernes/ })
  await alerta.waitFor()
  anotar('Sábado como fecha', 'Rechazado con mensaje', await alerta.innerText(), (await fecha.inputValue()) === '')

  await fecha.fill('2020-01-06')
  await fecha.blur()
  const pasada = await fecha.inputValue()
  const valida = await fecha.evaluate((el: HTMLInputElement) => el.validity.valid)
  anotar('Fecha pasada escrita a mano (2020-01-06)', 'Rechazada', pasada ? `aceptada (validity.valid=${valida})` : 'rechazada', pasada === '')

  const miercoles = proximo(3)
  await fecha.fill(miercoles)
  await page.getByLabel(/Tu nombre/).fill('Prueba Auditoria')
  await page.getByLabel(/Teléfono/).fill('+56 9 1111 2222')
  await page.getByRole('button', { name: /Tarde 15:00/ }).click()
  await siguiente(page).click()

  // Paso 4: mensaje de WhatsApp.
  const enlace = page.getByRole('link', { name: /Enviar solicitud por WhatsApp/ })
  const href = (await enlace.getAttribute('href')) ?? ''
  const url = new URL(href)
  const mensaje = url.searchParams.get('text') ?? ''
  anotar('Número de WhatsApp', NUMERO, url.pathname, url.pathname === `/${NUMERO}`)
  for (const dato of ['Mantención Full', 'Notebook', 'Se apaga solo al jugar', miercoles, 'Tarde 15:00', 'Prueba Auditoria', '+56 9 1111 2222', 'booking-photos']) {
    anotar(`Mensaje incluye "${dato}"`, 'presente', mensaje.includes(dato), mensaje.includes(dato))
  }
  const conPrecio = mensaje.includes(precioServicio('mantencion-full'))
  anotar('Mensaje incluye el precio', `${precioServicio('mantencion-full')} (la pantalla lo mostró)`, conPrecio, conPrecio)

  // Envío: se guarda una sola vez aunque hagan doble clic.
  const antes = (await registroFalso(request)).solicitudes.length
  const respuesta = page.waitForResponse('**/api/solicitudes')
  const popup = context.waitForEvent('page')
  await enlace.click()
  const r = await respuesta
  await (await popup).close().catch(() => {})
  anotar('POST /api/solicitudes', '200', r.status(), r.status() === 200)

  const segundo = context.waitForEvent('page')
  await enlace.click()
  await (await segundo).close().catch(() => {})
  await page.waitForTimeout(800)
  const registro = await registroFalso(request)
  const nuevas = registro.solicitudes.slice(antes)
  anotar('Doble clic', '1 fila', `${nuevas.length} fila(s)`, nuevas.length === 1)
  const fila = nuevas[0] ?? {}
  anotar('Fila guardada', 'datos completos y origen "agendar"', JSON.stringify(fila).slice(0, 400),
    fila.nombre === 'Prueba Auditoria' && fila.telefono === '+56 9 1111 2222' && fila.servicio === 'mantenimiento' &&
    fila.equipo_tipo === 'Notebook' && fila.origen === 'agendar' && (fila.foto_urls as string[]).length === 1)

  // Si falla el guardado, ¿alguien se entera?
  await irAlResumen(page)
  await page.route('**/api/solicitudes', (route) => route.fulfill({ status: 500, json: { error: 'simulado' } }))
  const fallo = page.waitForResponse('**/api/solicitudes')
  const popup3 = context.waitForEvent('page')
  await page.getByRole('link', { name: /Enviar solicitud por WhatsApp/ }).click()
  await fallo
  await (await popup3).close().catch(() => {})
  await page.waitForTimeout(500)
  const avisos = await page.getByRole('alert').filter({ hasText: /./ }).count()
  anotar('El guardado falla (500 simulado)', 'Queda registro o aviso', avisos ? 'hay aviso' : 'sin aviso ni reintento: el dueño solo se entera si el cliente envía el WhatsApp', avisos > 0)
  await page.unroute('**/api/solicitudes')

  guardar('form-agendar', { casos, salidasBloqueadas: [...new Set(bloqueadas)] })
})

test('/solicitar', async ({ page, context, request }) => {
  await aislarNavegador(context)
  const { casos, anotar } = nuevoRegistro()
  await page.addInitScript(() => {
    const w = window as unknown as { __abiertos: string[]; __eventos: unknown[][]; gtag: (...a: unknown[]) => void }
    w.__abiertos = []
    w.__eventos = []
    w.gtag = (...a) => { w.__eventos.push(a) }
    window.open = ((url: string) => { w.__abiertos.push(url); return null }) as typeof window.open
  })
  const abiertos = () => page.evaluate(() => (window as unknown as { __abiertos: string[] }).__abiertos)
  const enviar = () => page.getByRole('button', { name: /Enviar por WhatsApp/ }).click()

  await page.goto('/solicitar')
  await page.waitForLoadState('networkidle')
  await enviar()
  const errores = page.locator('form p.text-danger')
  await errores.first().waitFor()
  const n = await errores.count()
  anotar('Enviar vacío', '5 errores y no abre WhatsApp', `${n} errores, abiertos: ${(await abiertos()).length}`, n === 5 && (await abiertos()).length === 0)

  const conErrorAria = await page.locator('#nombre').getAttribute('aria-invalid')
  anotar('Error anunciado a lectores de pantalla', 'aria-invalid y aria-describedby o role=alert', `aria-invalid=${conErrorAria}, alertas=${await page.locator('form [role="alert"]').count()}`, conErrorAria === 'true')

  const invalidos: [string, string, string, RegExp][] = [
    ['#nombre', 'Mario123', 'Nombre con números', /Solo letras/],
    ['#telefono', '12345', 'Teléfono inválido', /Teléfono chileno/],
    ['#email', 'no-es-email', 'Email inválido', /Email inválido/],
    ['#descripcion', 'corto', 'Descripción corta', /Describe un poco más/],
    ['#descripcion', 'x'.repeat(501), 'Descripción de 501 caracteres', /Máximo 500/],
  ]
  for (const [sel, valor, caso, patron] of invalidos) {
    await page.fill(sel, valor)
    await enviar()
    const msg = page.locator('form p.text-danger').filter({ hasText: patron })
    const visto = await msg.count()
    anotar(caso, patron.source, visto ? await msg.first().innerText() : 'sin mensaje', visto > 0)
  }

  for (const [valor, idx] of [['+56 9 1234 5678', 0], ['912345678', 1], ['56912345678', 2]] as const) {
    await page.fill('#telefono', valor)
    await enviar()
    const ok = (await page.locator('form p.text-danger').filter({ hasText: /Teléfono chileno/ }).count()) === 0
    anotar(`Teléfono válido ${idx + 1}: ${valor}`, 'aceptado', ok, ok)
  }

  await page.fill('#nombre', 'María José Ñuñez')
  await page.fill('#telefono', '+56 9 1111 2222')
  await page.fill('#email', 'prueba@ejemplo.cl')
  await page.selectOption('#tipoEquipo', 'notebook')
  await page.selectOption('#servicio', 'mantenimiento-fisico')
  await page.fill('#descripcion', 'Se calienta <script>alert(1)</script> al jugar')

  const antes = (await registroFalso(request)).solicitudes.length
  await enviar()
  await expect.poll(async () => (await abiertos()).length).toBe(1)
  const url = new URL((await abiertos())[0])
  const msg = url.searchParams.get('text') ?? ''
  anotar('Número de WhatsApp', NUMERO, url.pathname, url.pathname === `/${NUMERO}`)
  for (const dato of ['María José Ñuñez', '+56 9 1111 2222', 'prueba@ejemplo.cl', 'Notebook', 'Mantención Full', precioServicio('mantencion-full')]) {
    anotar(`Mensaje incluye "${dato}"`, 'presente', msg.includes(dato), msg.includes(dato))
  }
  anotar('Limpia HTML del mensaje', 'sin < ni >', msg.includes('<') ? 'contiene <' : 'limpio', !msg.includes('<'))
  const evento = await page.evaluate(() => (window as unknown as { __eventos: unknown[][] }).__eventos.filter((e) => e[1] === 'click_whatsapp').length)
  anotar('Conversión click_whatsapp', '1 evento', evento, evento === 1)

  const despues = (await registroFalso(request)).solicitudes.length
  anotar('Guardado en Supabase', 'Se guarda como /agendar', despues > antes ? 'guardada' : 'no se guarda: solo abre WhatsApp', despues > antes)

  guardar('form-solicitar', { casos })
})

test('API de solicitudes y fotos', async ({ request, baseURL }) => {
  const { casos, anotar } = nuevoRegistro()
  const api = `${baseURL}/api/solicitudes`
  const ip = (n: string) => ({ 'x-forwarded-for': `10.9.0.${n}` })
  const valido = { nombre: 'Prueba API', telefono: '+56911112222', servicio: 'otro' }

  let r = await request.post(api, { headers: ip('1'), data: { nombre: 'Solo nombre' } })
  anotar('Faltan datos', '400', r.status(), r.status() === 400)

  r = await request.post(api, { headers: { ...ip('1'), 'Content-Type': 'application/json' }, data: '{ roto' })
  anotar('JSON roto', '400', r.status(), r.status() === 400)

  r = await request.post(api, { headers: ip('1'), data: { ...valido, nombre: 'n'.repeat(100_000) } })
  anotar('Nombre de 100.000 caracteres', 'Rechazado', r.status(), r.status() === 400)

  r = await request.post(api, { headers: ip('1'), data: { ...valido, telefono: 'no-es-telefono' } })
  anotar('Teléfono inválido directo a la API', 'Rechazado', r.status(), r.status() === 400)

  r = await request.post(api, { headers: ip('1'), data: { ...valido, fotoUrls: ['https://sitio-ajeno.example/x.jpg'] } })
  anotar('URL de foto ajena', 'Rechazada', r.status(), r.status() === 400)

  let ultimo = 0
  for (let i = 0; i < 11; i++) {
    ultimo = (await request.post(api, { headers: ip('2'), data: valido })).status()
  }
  anotar('Petición 11 en un minuto', '429', ultimo, ultimo === 429)

  const subir = (archivos: { name: string; mimeType: string; buffer: Buffer }[], n: string) =>
    request.post(`${baseURL}/api/upload`, { headers: ip(n), multipart: { files: archivos[0] } })

  r = await subir([{ name: 'x.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') }], '3')
  anotar('Subir SVG', '400', r.status(), r.status() === 400)

  r = await subir([{ name: 'virus.png', mimeType: 'image/png', buffer: Buffer.from('esto no es una imagen') }], '3')
  anotar('Archivo que no es imagen, declarado como PNG', 'Rechazado (revisando el contenido)', r.status(), r.status() === 400)

  const log = await registroFalso(request)
  const bucket = log.peticiones.find((p) => p.ruta === '/storage/v1/bucket')
  anotar('Bucket de fotos', 'Privado', bucket?.cuerpo ?? 'sin petición', !/"public":true/.test(bucket?.cuerpo ?? ''))

  guardar('api-solicitudes', { casos })
})

test('/admin', async ({ browser, baseURL, request }) => {
  const { casos, anotar } = nuevoRegistro()
  const CLAVE = 'clave-solo-para-auditoria-local'
  const abrir = async (ip: string) => {
    const context = await browser.newContext({ baseURL, extraHTTPHeaders: { 'x-forwarded-for': ip } })
    const page = await context.newPage()
    await page.goto('/admin')
    await page.getByPlaceholder('Ingresa la contraseña').waitFor({ timeout: 60_000 })
    return { context, page }
  }
  const entrar = async (page: Page, clave: string) => {
    await page.getByPlaceholder('Ingresa la contraseña').fill(clave)
    await page.locator('form button[type="submit"]').click()
    await page.waitForTimeout(700)
  }

  const a = await abrir('10.8.0.1')
  const sinSesion = await a.page.getByRole('button', { name: /Solicitudes/ }).count()
  anotar('Sin sesión', 'Solo el login', sinSesion ? 'muestra el panel' : 'solo login', sinSesion === 0)

  await entrar(a.page, 'incorrecta')
  const adentro = await a.page.getByPlaceholder('Ingresa la contraseña').count()
  const avisoError = await a.page.locator('form').getByText(/incorrecta|inválida/i).count()
  anotar('Contraseña incorrecta', 'Sigue en login, con aviso', `login=${adentro}, aviso=${avisoError}`, adentro === 1 && avisoError > 0)

  await entrar(a.page, CLAVE)
  await a.page.getByPlaceholder('Ingresa la contraseña').waitFor({ state: 'detached', timeout: 30_000 })
  anotar('Contraseña correcta', 'Abre el panel', 'panel abierto', true)

  const cookie = (await a.context.cookies()).find((c) => c.name === 'tw_admin')
  anotar('Cookie de sesión', 'httpOnly y sameSite lax', `httpOnly=${cookie?.httpOnly}, sameSite=${cookie?.sameSite}`, cookie?.httpOnly === true && cookie?.sameSite === 'Lax')
  anotar('Cookie sin la contraseña', 'No la contiene', cookie?.value.includes(CLAVE) ? 'la contiene' : 'hash', !cookie?.value.includes(CLAVE))

  const hayFilas = (await registroFalso(request)).solicitudes.length > 0
  const visible = await a.page.getByText('Prueba Auditoria').first().isVisible({ timeout: 15_000 }).catch(() => false)
  anotar('La solicitud de /agendar llega al panel', 'Visible', `filas=${hayFilas}, visible=${visible}`, visible)
  await a.context.close()

  const b = await abrir('10.8.0.2')
  for (let i = 0; i < 5; i++) await entrar(b.page, `mala-${i}`)
  await entrar(b.page, CLAVE)
  const bloqueado = await b.page.getByPlaceholder('Ingresa la contraseña').count()
  anotar('Clave correcta tras 5 intentos fallidos', 'Bloqueada durante un minuto', bloqueado ? 'bloqueada' : 'entró', bloqueado === 1)
  await b.context.close()

  guardar('admin', { casos, serviciosConstantes: SERVICIOS.length })
})
