const BASE = 'https://wa.me/56930209427?text='
const enc = (text: string) => encodeURIComponent(text)

const svc = (nombre: string, precio: string) =>
  BASE + enc(`Hola TECKWARE! 👋\n\nMe interesa: *${nombre}* (${precio}).\n\nQuedo atento/a a su respuesta.`)

export const WA = {
  general: () =>
    BASE + enc('Hola TECKWARE! 👋 Me gustaría información sobre sus servicios.'),

  servicio: (nombre: string) =>
    BASE + enc(`Hola TECKWARE! 👋\n\nMe interesa: *${nombre}*\n\nQuedo atento/a a su respuesta.`),

  formulario: (d: {
    nombre: string; telefono: string; equipo: string; servicio: string; descripcion: string
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
    BASE + enc(`Hola TECKWARE! 👋\n\nMe interesa el build *${nombre}*.\n\n¿Está disponible y cuál es el precio actual?`),

  diagnostico:     () => svc('Diagnóstico Electrónico', '$30.000 c/IVA'),
  mantencionLogica:() => svc('Mantención Lógica (Formateo Windows/macOS + Optimización)', '$45.000 c/IVA'),
  mantencionFull:  () => svc('Mantención Full (Limpieza + Pasta + Formateo + Win + Office)', '$75.000 c/IVA'),
  mantencionGPU:   () => svc('Mantención GPU (Pasta Thermal Grizzly + Thermal Pads)', 'Desde $45.000 c/IVA'),
  armadoEstandar:  () => svc('Armado PC Gamer Estándar', '$75.000 c/IVA'),
  armadoAltaGama:  () => svc('Armado PC Gamer Alta Gama', '$90.000 c/IVA'),
  consolaPS4:      () => svc('Mantención PS3/PS4', '$55.000 c/IVA'),
  consolaPS5:      () => svc('Mantención PS5 (Metal Líquido)', '$80.000 c/IVA'),
  recuperacion:    () => svc('Recuperación de Datos', 'Desde $35.000 c/IVA'),
  upgrade:         () => BASE + enc('Hola TECKWARE! 👋\n\nMe interesa una *Asesoría y Upgrade Personalizado*.\n\nEquipo actual: \nComponente a instalar/cambiar: \nPresupuesto aproximado: \n\nQuedo atento/a a su respuesta.'),
  domicilio:       () => BASE + enc('Hola TECKWARE! 👋\n\nMe interesa un *Servicio Técnico a Domicilio*.\n\nDirección aproximada: \nProblema a resolver: \nDisponibilidad horaria: \n\nQuedo atento/a a su respuesta.'),
  workstation:     () => BASE + enc('Hola TECKWARE! 👋\n\nMe interesa el servicio *Empresarial / Workstation*.\n\nEmpresa: \nEquipos (cantidad y tipo): \nRequerimiento: \n\nQuedo atento/a a su respuesta.'),

  // Formateo y mantenimiento (alias legacy)
  formateo:        () => svc('Mantención Lógica (Formateo + SO + Optimización)', '$40.000 c/IVA'),
  mantenimiento:   () => svc('Mantención Full', '$75.000 c/IVA'),

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
