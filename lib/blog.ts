// Guías del blog (SEO de contenido). Cada guía enlaza a la landing del servicio
// relacionado. Para agregar una: sumar un objeto aquí; el sitemap y /blog la toman solos.

export type BlogSection = { h2: string; p: string[]; list?: string[] }

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string // ISO, fecha de publicación
  minutes: number
  related: { href: string; label: string }
  intro: string
  sections: BlogSection[]
}

export const BLOG_AUTHOR = 'Mario Felipe Busques Araya'

export const POSTS: BlogPost[] = [
  {
    slug: 'cada-cuanto-hacer-mantencion-pc-gamer',
    title: '¿Cada cuánto hacer mantención a tu PC gamer?',
    description:
      'Frecuencia recomendada de limpieza y cambio de pasta térmica para un PC gamer, señales de que ya toca y qué incluye una mantención preventiva bien hecha.',
    date: '2026-10-26',
    minutes: 5,
    related: { href: '/mantencion-pc-gamer', label: 'Mantención de PC Gamer en La Serena' },
    intro:
      'Un PC gamer trabaja con temperaturas altas durante horas. El polvo y una pasta térmica seca no lo rompen de un día para otro, pero sí le van quitando rendimiento y vida útil sin que lo notes. La mantención preventiva evita llegar a la falla.',
    sections: [
      {
        h2: 'La frecuencia recomendada',
        p: [
          'Para un uso normal recomendamos una mantención física completa una vez al año. Si el equipo está en el suelo, en una pieza con alfombra, con mascotas o cerca de la costa (algo común en La Serena y Coquimbo, donde la humedad y la sal aceleran la corrosión), conviene hacerla cada 6 a 8 meses.',
          'El cambio de pasta térmica no siempre es anual: depende de la calidad de la pasta original y de las temperaturas que veas. Lo revisamos en cada mantención y lo cambiamos cuando corresponde.',
        ],
      },
      {
        h2: 'Señales de que ya le toca',
        p: ['Si notas una o más de estas señales, no esperes a la fecha:'],
        list: [
          'Los ventiladores suenan más fuerte que antes, incluso con juegos livianos.',
          'Caídas de FPS o tirones después de 20–30 minutos de juego (throttling térmico).',
          'Temperaturas de CPU o GPU sobre lo normal para tu modelo en reposo.',
          'Polvo visible en filtros, rejillas o disipadores.',
          'Apagados o reinicios repentinos bajo carga.',
        ],
      },
      {
        h2: 'Qué incluye una mantención preventiva bien hecha',
        p: [
          'No basta con soplar el polvo. Una mantención completa incluye desarme y limpieza de ventiladores, disipadores y filtros; cambio de pasta térmica de alto rendimiento en CPU (y GPU cuando corresponde); revisión de conexiones y del flujo de aire; y una prueba de temperaturas bajo carga para comprobar el resultado.',
          'En la tarjeta gráfica, además de la pasta, a veces hay que reemplazar los thermal pads de la memoria. Eso se evalúa según el modelo y las temperaturas.',
        ],
      },
      {
        h2: 'Lo que puedes hacer tú entre mantenciones',
        p: ['Hay cuidados simples que alargan el tiempo entre mantenciones:'],
        list: [
          'Limpiar los filtros de polvo del gabinete cada uno o dos meses.',
          'Dejar espacio libre alrededor del gabinete y no apoyarlo contra la pared.',
          'Revisar las temperaturas con un programa de monitoreo de vez en cuando.',
          'Evitar abrir el PC con aspiradora o aire comprimido sin trabar los ventiladores (se dañan los rodamientos).',
        ],
      },
    ],
  },
  {
    slug: 'senales-notebook-necesita-mantencion',
    title: '7 señales de que tu notebook necesita mantención',
    description:
      'Cómo saber si tu notebook necesita limpieza interna, pasta térmica o un SSD: las señales más comunes y qué hacer antes de que se convierta en una reparación cara.',
    date: '2026-10-26',
    minutes: 4,
    related: { href: '/reparacion-notebook-la-serena', label: 'Reparación y mantención de notebooks' },
    intro:
      'Los notebooks tienen muy poco espacio para ventilar, así que el polvo les afecta más que a un PC de escritorio. Detectar a tiempo las señales de falta de mantención te ahorra una reparación más cara.',
    sections: [
      {
        h2: 'Las señales más comunes',
        p: ['Si tu notebook tiene varias de estas, está pidiendo mantención:'],
        list: [
          'Se calienta mucho en la base o en el teclado, incluso navegando.',
          'El ventilador está casi siempre acelerado y hace ruido.',
          'Se pone lento después de un rato de uso, aunque al encender anda bien.',
          'Se apaga solo cuando le exiges (videollamadas, juegos, edición).',
          'La batería dura mucho menos que antes.',
          'Tarda varios minutos en encender o en abrir programas.',
          'Hace años que nadie lo abre ni lo formatea.',
        ],
      },
      {
        h2: 'Mantención física: el calor',
        p: [
          'Calor, ruido y apagados apuntan a la refrigeración: polvo en el ventilador y en el disipador, y pasta térmica seca. La solución es una limpieza interna y cambio de pasta térmica. Es preventiva: si se deja pasar, el calor sostenido degrada la batería y otros componentes.',
        ],
      },
      {
        h2: 'Mantención lógica: la lentitud',
        p: [
          'Si la lentitud está desde el encendido, el problema suele ser de software (programas que se inician solos, malware, sistema desordenado) o del disco. Un formateo con respaldo de archivos y, si el notebook todavía tiene disco mecánico, el cambio a SSD, suelen hacer una diferencia enorme por mucho menos de lo que cuesta un equipo nuevo.',
        ],
      },
      {
        h2: '¿Cada cuánto?',
        p: [
          'Para un notebook de uso diario recomendamos una mantención física al año. Si lo usas sobre la cama o en superficies blandas (que tapan la ventilación), mejor cada 6 a 8 meses.',
        ],
      },
    ],
  },
  {
    slug: 'mantencion-ps5-metal-liquido',
    title: 'Mantención de PS5: ¿cuándo cambiar el metal líquido?',
    description:
      'Qué es el metal líquido de la PS5, por qué su mantención es distinta a la de PS4 y qué señales indican que tu consola necesita limpieza y refrigeración nueva.',
    date: '2026-10-26',
    minutes: 4,
    related: { href: '/mantencion-ps5-la-serena', label: 'Mantención PS5 y PS4 en La Serena' },
    intro:
      'La PS5 usa metal líquido en vez de pasta térmica común para enfriar su procesador. Conduce muy bien el calor, pero su mantención requiere más cuidado. Esto es lo que conviene saber.',
    sections: [
      {
        h2: 'Qué es el metal líquido y por qué importa',
        p: [
          'Es una aleación metálica que se mantiene líquida a temperatura ambiente y transfiere el calor mucho mejor que una pasta tradicional. Sony la usa en la PS5 para mantener el procesador fresco en un espacio reducido.',
          'Como conduce electricidad, su aplicación necesita aislamiento correcto y precisión. Por eso no es un trabajo para hacer en casa: un error puede dañar la placa.',
        ],
      },
      {
        h2: 'Señales de que tu PS5 necesita mantención',
        list: [
          'El ventilador suena más fuerte que cuando era nueva.',
          'La consola está muy caliente al tacto por la parte trasera.',
          'Aparecen mensajes de temperatura o se apaga en medio de una partida.',
          'Hay polvo acumulado en las rejillas laterales.',
        ],
        p: ['Cualquiera de estas señales indica que la refrigeración está perdiendo eficiencia.'],
      },
      {
        h2: 'Frecuencia recomendada',
        p: [
          'Recomendamos una mantención de PS5 una vez al año: limpieza interna completa del ventilador y el disipador, y revisión o renovación del metal líquido. En PS4 y PS3 la mantención es similar pero con pasta térmica tradicional.',
        ],
      },
      {
        h2: '¿Se pierden los juegos o las partidas?',
        p: [
          'No. La mantención es física: no toca el almacenamiento ni tu cuenta de PlayStation Network.',
        ],
      },
    ],
  },
  {
    slug: 'mantencion-preventiva-computadores-empresa',
    title: 'Mantención preventiva de computadores para pymes',
    description:
      'Por qué una pyme debería tener un plan de mantención preventiva de sus equipos, qué incluye y cómo reduce paradas, pérdidas de información y gastos de reparación.',
    date: '2026-10-26',
    minutes: 5,
    related: { href: '/servicio-tecnico-computadores-la-serena', label: 'Servicio técnico de computadores en La Serena' },
    intro:
      'En una pyme, un computador que falla no es solo un gasto de reparación: es una persona que no puede trabajar y, a veces, información que se pierde. La mantención preventiva convierte esas sorpresas en una tarea planificada.',
    sections: [
      {
        h2: 'Qué incluye un plan preventivo',
        list: [
          'Limpieza física y revisión de temperaturas de cada equipo.',
          'Actualizaciones de sistema, drivers y antivirus.',
          'Revisión del estado de los discos para anticipar fallas.',
          'Verificación de que los respaldos se están haciendo y se pueden recuperar.',
          'Inventario simple de equipos, licencias y estado.',
        ],
        p: ['La idea es detectar problemas antes de que paren el trabajo.'],
      },
      {
        h2: 'Cada cuánto',
        p: [
          'Para equipos de oficina, una mantención física al año suele ser suficiente, con revisiones lógicas (actualizaciones y respaldos) más frecuentes. Equipos de alto rendimiento, como estaciones de diseño, ingeniería o render, conviene revisarlos cada 6 meses.',
        ],
      },
      {
        h2: 'Más allá del hardware: asesoría y automatización',
        p: [
          'Un plan de soporte también es una oportunidad para ordenar la tecnología de la empresa: elegir bien los equipos que se compran, mejorar la seguridad de las cuentas y automatizar tareas repetitivas, por ejemplo con herramientas de inteligencia artificial que ahorran horas de trabajo manual.',
          'En TECKWARE ofrecemos mantención empresarial, soporte mensual por contrato y asesoría informática integral para pymes de La Serena y Coquimbo.',
        ],
      },
    ],
  },
]

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug)
}
