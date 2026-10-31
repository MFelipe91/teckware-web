import { precioServicio } from '@/lib/constants'

const BASE = 'https://wa.me/56930209427?text='
const enc = (text: string) => encodeURIComponent(text)

// Precios desde lib/constants.ts: los mensajes nunca quedan desfasados del sitio.
const conIva = (id: Parameters<typeof precioServicio>[0]) => `${precioServicio(id)} c/IVA`

const svc = (nombre: string, precio: string) =>
  BASE + enc(`Hola TECKWARE! 👋\n\nMe interesa: *${nombre}* (${precio}).\n\nQuedo atento/a a su respuesta.`)

export const WA = {
  general: () =>
    BASE + enc('Hola TECKWARE! 👋 Me gustaría información sobre sus servicios.'),

  servicio: (nombre: string) =>
    BASE + enc(`Hola TECKWARE! 👋\n\nMe interesa: *${nombre}*\n\nQuedo atento/a a su respuesta.`),

  formulario: (d: {
    nombre: string; telefono: string; email?: string; equipo: string; servicio: string; descripcion: string
  }) =>
    BASE + enc(
      `*Nueva solicitud desde teckware.cl* 🔧\n\n` +
      `👤 *Nombre:* ${d.nombre}\n` +
      `📱 *Teléfono:* ${d.telefono}\n` +
      (d.email ? `✉️ *Email:* ${d.email}\n` : '') +
      `💻 *Equipo:* ${d.equipo}\n` +
      `🛠️ *Servicio:* ${d.servicio}\n` +
      `📝 *Detalle:* ${d.descripcion}\n\n` +
      `_Enviado desde teckware.cl_`
    ),

  build: (nombre: string) =>
    BASE + enc(`Hola TECKWARE! 👋\n\nMe interesa el build *${nombre}*.\n\n¿Está disponible y cuál es el precio actual?`),

  diagnostico:     () => svc('Diagnóstico Electrónico', conIva('diagnostico')),
  mantencionLogica:() => svc('Mantención Lógica (Formateo Windows/macOS + Optimización)', conIva('mantencion-logica')),
  mantencionFull:  () => svc('Mantención Full (test + limpieza + pasta Thermal Grizzly + BIOS + Windows limpio + test final)', conIva('mantencion-full')),
  mantencionGPU:   () => svc('Mantención GPU (Pasta Thermal Grizzly + Thermal Pads)', conIva('mantencion-gpu')),
  armadoEstandar:  () => svc('Armado PC Gamer Estándar', conIva('armado-estandar')),
  armadoAltaGama:  () => svc('Armado PC Gamer Alta Gama', conIva('armado-alta-gama')),
  consolaPS4:      () => svc('Mantención PS3/PS4', conIva('consola-ps4')),
  consolaPS5:      () => svc('Mantención PS5 (Metal Líquido)', conIva('consola-ps5')),
  recuperacion:    () => svc('Recuperación de Datos', conIva('recuperacion-datos')),
  upgrade:         () => BASE + enc('Hola TECKWARE! 👋\n\nMe interesa una *Asesoría y Upgrade Personalizado*.\n\nEquipo actual: \nComponente a instalar/cambiar: \nPresupuesto aproximado: \n\nQuedo atento/a a su respuesta.'),
  domicilio:       () => BASE + enc('Hola TECKWARE! 👋\n\nMe interesa una *visita a domicilio* para un trabajo simple (formateo o configuración).\n\nComuna / sector: \nQué necesitas: \nDisponibilidad horaria:\n\nQuedo atento/a a su respuesta.'),
  workstation:     () => BASE + enc('Hola TECKWARE! 👋\n\nMe interesa el servicio *Empresarial / Workstation*.\n\nEmpresa: \nEquipos (cantidad y tipo): \nRequerimiento: \n\nQuedo atento/a a su respuesta.'),

  // Formateo y mantenimiento (alias legacy)
  formateo:        () => svc('Mantención Lógica (Formateo + SO + Optimización)', conIva('mantencion-logica')),
  mantenimiento:   () => svc('Mantención Full', conIva('mantencion-full')),

  webQA: (servicio?: string) =>
    BASE + enc(
      `Hola TECKWARE! 👋\n\nMe interesa un servicio de *Web & QA*${servicio ? `: *${servicio}*` : ''}.\n\n` +
      `Empresa / Proyecto: \nDescripción breve: \nPresupuesto estimado: \n\nQuedo atento/a a su respuesta.`
    ),

  ciberseguridad: (servicio?: string) =>
    BASE + enc(
      `Hola TECKWARE! 👋\n\nMe interesa el servicio de *Ciberseguridad*${servicio ? `: *${servicio}*` : ''}.\n\n` +
      `Empresa / Organización: \nN° de equipos / usuarios: \nDescripción del requerimiento: \n\nQuedo atento/a a su respuesta.`
    ),
}
