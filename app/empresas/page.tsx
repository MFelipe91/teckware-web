import type { Metadata } from 'next'
import { Building2, Compass, Bot, Code2, ShieldCheck, Wrench, GraduationCap, MessagesSquare, CalendarClock, Receipt, Home } from 'lucide-react'
import { HubPage } from '@/components/landing/HubPage'
import { precioServicio } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Soporte informático para empresas en La Serena y Coquimbo',
  description:
    'Soporte informático para pymes en La Serena y Coquimbo: mantención preventiva de equipos, asesoría tecnológica, automatización con IA, desarrollo web y ciberseguridad. Empresa formal con boleta.',
  alternates: { canonical: '/empresas' },
}

export default function EmpresasPage() {
  return (
    <HubPage
      path="/empresas"
      eyebrow="Para pymes y oficinas"
      titulo="Soporte informático para empresas en"
      tituloAccent="La Serena y Coquimbo"
      subtitle="Mantención de equipos, asesoría, automatización con IA, desarrollo web y ciberseguridad, con un ingeniero informático que conoce tu operación y te habla claro."
      intro={[
        'En una pyme, un computador detenido es una persona que no puede trabajar. Nuestro foco es la prevención: mantener los equipos sanos, ordenar la tecnología que ya tienes y resolver rápido cuando algo falla.',
        'Trabajamos directo contigo, sin intermediarios: evaluamos qué necesita tu empresa, te proponemos un plan por escrito con precio claro y lo ejecutamos en tus instalaciones en La Serena y Coquimbo, coordinando por WhatsApp.',
      ]}
      cardsTitle="Cómo podemos ayudar a tu empresa"
      cards={[
        {
          icon: Wrench,
          titulo: 'Mantención de equipos',
          desc: 'Mantención preventiva y soporte de los computadores y notebooks de tu equipo de trabajo, coordinada para no interrumpir la operación.',
          precio: precioServicio('workstation'),
          href: WA.workstation(),
          cta: 'Cotizar',
        },
        {
          icon: Compass,
          titulo: 'Asesoría informática integral',
          desc: 'Revisamos tus equipos, red, respaldos y licencias, y te proponemos qué mejorar primero según tu presupuesto.',
          precio: 'A cotizar',
          href: WA.servicio('Asesoría informática para empresas'),
          cta: 'Cotizar',
        },
        {
          icon: Bot,
          titulo: 'Automatización con IA',
          desc: 'Automatizamos tareas repetitivas (respuestas, reportes, planillas, documentos) con herramientas de IA adaptadas a tu negocio.',
          precio: 'A cotizar',
          href: WA.servicio('Automatización con IA para empresas'),
          cta: 'Cotizar',
        },
        {
          icon: Code2,
          titulo: 'Desarrollo web y QA',
          desc: 'Sitios y landing pages para tu empresa, auditorías web y pruebas de calidad de software.',
          href: '/web-qa',
          cta: 'Ver servicios',
        },
        {
          icon: ShieldCheck,
          titulo: 'Ciberseguridad',
          desc: 'Auditoría, hardening de equipos, políticas de seguridad y capacitación para tu equipo.',
          href: '/ciberseguridad',
          cta: 'Ver servicios',
        },
        {
          icon: Building2,
          titulo: 'Mantención preventiva',
          desc: 'Todos los servicios de mantención: PC, notebooks, formateo y consolas, con precios publicados.',
          href: '/mantencion',
          cta: 'Ver mantención',
        },
      ]}
      puntosTitle="Por qué trabajar con TECKWARE"
      puntos={[
        { icon: GraduationCap, titulo: 'Ingeniería informática', desc: 'Especialistas en hardware, mantención preventiva, ciberseguridad y desarrollo.' },
        { icon: MessagesSquare, titulo: 'Hablas con quien hace el trabajo', desc: 'Sin call center: te explicamos el problema y la solución en simple.' },
        { icon: CalendarClock, titulo: 'Entrega en 48 horas hábiles', desc: 'Plazos claros desde el inicio, con diagnóstico real e informe técnico de cada equipo.' },
        { icon: Home, titulo: 'En tus instalaciones', desc: 'Atendemos en tu oficina en La Serena y Coquimbo.' },
        { icon: ShieldCheck, titulo: 'Garantía de 30 días', desc: 'Todos los trabajos tienen garantía.' },
        { icon: Receipt, titulo: 'Empresa formal', desc: 'TECKWARE SpA: presupuesto por escrito y boleta por cada servicio.' },
      ]}
      faqs={[
        { q: '¿Atienden empresas con varios equipos?', a: 'Sí. Cotizamos según la cantidad y el tipo de equipos, y coordinamos los horarios para que tu equipo pueda seguir trabajando.' },
        { q: '¿Qué tipo de tareas se pueden automatizar con IA?', a: 'Tareas repetitivas como responder consultas frecuentes, generar reportes, ordenar planillas o redactar documentos base. Primero revisamos tu proceso y te decimos si conviene automatizarlo.' },
        { q: '¿Trabajan en nuestras oficinas?', a: 'Sí, en La Serena y Coquimbo. Si un equipo necesita más tiempo de taller, lo coordinamos contigo.' },
        { q: '¿Emiten boleta?', a: 'Sí. TECKWARE SpA emite boleta por cada servicio y todos los precios incluyen IVA.' },
        { q: '¿Cómo empezamos?', a: 'Escríbenos por WhatsApp con el nombre de tu empresa, cuántos equipos tienen y qué necesitan. Te respondemos con una propuesta.' },
      ]}
      waHref={WA.workstation()}
      ctaTitle="Conversemos sobre la tecnología de tu empresa"
      ctaText="Cuéntanos cuántos equipos tienen y qué les está costando tiempo. Te proponemos un plan claro, sin compromiso."
    />
  )
}
