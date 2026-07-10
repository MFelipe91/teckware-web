const BASE = 'https://wa.me/56930209427?text='
const enc = (text: string) => encodeURIComponent(text)

export const WA = {
  general: () =>
    BASE + enc('Hola TECKWARE! 👋 Me gustaría información sobre sus servicios.'),

  servicio: (nombre: string, equipo?: string) =>
    BASE + enc(
      `Hola TECKWARE! 👋\n\nMe interesa: *${nombre}*` +
      (equipo ? `\nEquipo: ${equipo}` : '') +
      '\n\nQuedo atento/a a su respuesta.'
    ),

  formulario: (d: {
    nombre: string
    telefono: string
    equipo: string
    servicio: string
    descripcion: string
  }) =>
    BASE + enc(
      `*Nueva solicitud desde teckware.cl* 🔧\n\n` +
      `👤 *Nombre:* ${d.nombre}\n` +
      `📱 *Teléfono:* ${d.telefono}\n` +
      `💻 *Equipo:* ${d.equipo}\n` +
      `🛠️ *Servicio:* ${d.servicio}\n` +
      `📝 *Detalle:* ${d.descripcion}\n\n` +
      `_Enviado desde teckware.cl_`
    ),

  build: (nombre: string) =>
    BASE + enc(
      `Hola TECKWARE! 👋\n\nMe interesa el build *${nombre}*.\n\n¿Está disponible y cuál es el precio actual?`
    ),

  diagnostico: () =>
    BASE + enc('Hola TECKWARE! 👋\n\nMe interesa el servicio de *Diagnóstico / Revisión Electrónica* ($25.000).\n\nQuedo atento/a a su respuesta.'),

  formateo: () =>
    BASE + enc('Hola TECKWARE! 👋\n\nMe interesa el servicio de *Formateo + Instalación Limpia* ($35.000).\n\nQuedo atento/a a su respuesta.'),

  mantenimiento: () =>
    BASE + enc('Hola TECKWARE! 👋\n\nMe interesa el servicio de *Mantenimiento Físico Completo* ($60.000).\n\nQuedo atento/a a su respuesta.'),

  workstation: () =>
    BASE + enc('Hola TECKWARE! 👋\n\nMe interesa el servicio de *Mantenimiento Workstation / Empresarial*.\n\nTipo de equipo: [Desktop Workstation / Notebook Workstation]\nMarca/Modelo: \nDescripción del problema o requerimiento: \n\nQuedo atento/a a su respuesta.'),

  webQA: (servicio?: string) =>
    BASE + enc(
      `Hola TECKWARE! 👋\n\nMe interesa un servicio de *Web & QA*${servicio ? `: *${servicio}*` : ''}.\n\n` +
      `Empresa / Proyecto: \n` +
      `Descripción breve: \n` +
      `Presupuesto estimado: \n\n` +
      `Quedo atento/a a su respuesta.`
    ),

  ciberseguridad: (servicio?: string) =>
    BASE + enc(
      `Hola TECKWARE! 👋\n\nMe interesa el servicio de *Ciberseguridad*${servicio ? `: *${servicio}*` : ''}.\n\n` +
      `Empresa / Organización: \n` +
      `N° de equipos / usuarios: \n` +
      `Descripción del requerimiento: \n\n` +
      `Quedo atento/a a su respuesta.`
    ),
}
