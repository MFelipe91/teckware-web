import type { Metadata } from 'next'
import { Cpu, Laptop, RefreshCw, Gamepad2, MonitorCog, Building2, ShieldCheck, Thermometer, TrendingUp, MessagesSquare, Home, Receipt } from 'lucide-react'
import { HubPage } from '@/components/landing/HubPage'
import { precioServicio } from '@/lib/constants'
import { POSTS } from '@/lib/blog'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Mantención de computadores en La Serena y Coquimbo',
  description:
    'Mantención preventiva de PC gamer, notebooks, consolas y equipos de empresa en La Serena y Coquimbo: limpieza, pasta térmica, formateo y revisión de temperaturas. Garantía 30 días y boleta.',
  alternates: { canonical: '/mantencion' },
}

export default function MantencionPage() {
  return (
    <HubPage
      path="/mantencion"
      eyebrow="Mantención preventiva"
      titulo="Mantención de computadores en"
      tituloAccent="La Serena y Coquimbo"
      subtitle="Limpieza interna, pasta térmica, formateo y revisión de temperaturas para que tu equipo no falle cuando más lo necesitas. PC gamer, notebooks, consolas y empresas."
      intro={[
        'La mayoría de las fallas que vemos no llegan de golpe: el polvo tapa ventiladores, la pasta térmica se seca y el equipo empieza a calentarse, ponerse lento o apagarse solo. Una mantención a tiempo es más barata que una reparación y alarga la vida útil del equipo.',
        'En cada mantención te explicamos qué encontramos, qué hicimos y cada cuánto conviene repetirla según cómo usas tu equipo. Recibimos tu equipo en nuestro taller en La Serena, con hora coordinada por WhatsApp, para clientes de La Serena y Coquimbo. Con boleta y garantía de 30 días.',
      ]}
      cardsTitle="¿Qué equipo quieres mantener?"
      cards={[
        {
          icon: Cpu,
          titulo: 'PC gamer',
          desc: 'Limpieza profunda, pasta térmica premium, control de temperaturas bajo carga y revisión de flujo de aire.',
          precio: precioServicio('mantencion-full'),
          href: '/mantencion-pc-gamer',
          cta: 'Ver detalle',
        },
        {
          icon: Laptop,
          titulo: 'Notebooks',
          desc: 'Desarmado, limpieza de ventilador y disipador, pasta térmica y revisión general. Incluye notebooks gamer y MacBook.',
          precio: precioServicio('mantencion-full'),
          href: '/reparacion-notebook-la-serena',
          cta: 'Ver detalle',
        },
        {
          icon: RefreshCw,
          titulo: 'Mantención lógica (formateo)',
          desc: 'Instalación limpia de Windows o macOS, drivers y optimización. Respaldamos tus archivos antes.',
          precio: precioServicio('mantencion-logica'),
          href: '/formateo-pc-la-serena',
          cta: 'Ver detalle',
        },
        {
          icon: Gamepad2,
          titulo: 'Consolas PS5 y PS4',
          desc: 'Limpieza interna y cambio de pasta térmica o metal líquido para bajar temperaturas y ruido.',
          precio: `Desde ${precioServicio('consola-ps4')}`,
          href: '/mantencion-ps5-la-serena',
          cta: 'Ver detalle',
        },
        {
          icon: MonitorCog,
          titulo: 'Tarjeta gráfica (GPU)',
          desc: 'Cambio de pasta térmica y thermal pads en la GPU cuando las temperaturas o el ruido suben.',
          precio: precioServicio('mantencion-gpu'),
          href: WA.mantencionGPU(),
          cta: 'Cotizar',
        },
        {
          icon: Building2,
          titulo: 'Equipos de empresa',
          desc: 'Mantención preventiva de los computadores de tu pyme u oficina, coordinada para no interrumpir el trabajo.',
          precio: precioServicio('workstation'),
          href: '/empresas',
          cta: 'Ver empresas',
        },
      ]}
      puntosTitle="Por qué hacer mantención preventiva"
      puntos={[
        { icon: Thermometer, titulo: 'Menos temperatura, menos fallas', desc: 'El calor es lo que más desgasta los componentes. Limpiar y renovar la pasta térmica lo mantiene bajo control.' },
        { icon: TrendingUp, titulo: 'Rendimiento estable', desc: 'Sin polvo ni sobrecalentamiento, el equipo no baja su velocidad para protegerse.' },
        { icon: MessagesSquare, titulo: 'Te explicamos todo', desc: 'Sabes qué tenía tu equipo, qué hicimos y cuándo conviene volver a revisarlo.' },
        { icon: Home, titulo: 'Taller en La Serena', desc: 'Traes tu equipo con hora coordinada por WhatsApp. Para trabajos simples, como formateo, podemos ir a domicilio con recargo.' },
        { icon: ShieldCheck, titulo: 'Garantía de 30 días', desc: 'Todos los trabajos tienen garantía. Si algo falla por nuestro trabajo, lo solucionamos.' },
        { icon: Receipt, titulo: 'Empresa formal', desc: 'TECKWARE SpA: precio claro antes de empezar y boleta por cada servicio.' },
      ]}
      faqs={[
        { q: '¿Cada cuánto conviene hacer mantención?', a: 'Para la mayoría de los equipos, una vez al año. Si hay mucho polvo, mascotas o el equipo trabaja muchas horas con carga (gaming, render), cada 6 a 8 meses.' },
        { q: '¿Qué diferencia hay entre mantención lógica y mantención full?', a: `La lógica es el software: formateo, instalación limpia del sistema y optimización (${precioServicio('mantencion-logica')}). La full suma la parte física: desarmado, limpieza interna y pasta térmica (${precioServicio('mantencion-full')}).` },
        { q: '¿Cuánto demora?', a: 'Se entrega en 48 horas hábiles (lunes a viernes), con el diagnóstico real y un informe técnico de lo que encontramos e hicimos.' },
        { q: '¿Pierdo mis archivos?', a: 'En la mantención física no se tocan tus archivos. Si el servicio incluye formateo, primero respaldamos lo que necesites.' },
        { q: '¿Atienden a domicilio?', a: 'Preferimos trabajar en el taller, donde tenemos las herramientas para hacerlo bien. Para trabajos simples, como formateo, podemos ir a domicilio en La Serena y Coquimbo con un recargo según ubicación.' },
      ]}
      linksTitle="Guías de mantención"
      links={POSTS.map((p) => ({ href: `/blog/${p.slug}`, label: p.title }))}
      waHref={WA.servicio('Mantención preventiva')}
      ctaTitle="¿Hace cuánto no le haces mantención a tu equipo?"
      ctaText="Cuéntanos qué equipo tienes y cómo lo usas, y te decimos qué mantención le conviene y cuánto cuesta."
    />
  )
}
