import type { Metadata } from 'next'
import { MapPin, House, Search, Laptop, Building2, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Servicio Técnico de Computadores en Coquimbo | TECKWARE' },
  description:
    'Servicio técnico de computadores, notebooks, PC Gamer y consolas para Coquimbo. Recepción en taller en La Serena con hora coordinada, entrega en 48 horas hábiles con informe técnico, pago al retirar y 30 días de garantía.',
  alternates: { canonical: '/servicio-tecnico-coquimbo' },
}

export default function ServicioTecnicoCoquimboPage() {
  return (
    <ServiceLanding
      path="/servicio-tecnico-coquimbo"
      eyebrow="Coquimbo"
      titulo="Servicio técnico de computadores en"
      tituloAccent="Coquimbo"
      subtitle="Reparación y mantención de notebooks, PC y consolas para clientes de Coquimbo. Coordinas por WhatsApp, traes tu equipo a nuestro taller y te lo entregamos en 48 horas hábiles."
      heroImage="/images/mantenimiento.jpg"
      heroAlt="Mantención de computador para clientes de Coquimbo — TECKWARE"
      intro={[
        'TECKWARE es un servicio técnico de la conurbación La Serena–Coquimbo. Si vives o trabajas en Coquimbo, coordinas por WhatsApp una hora y traes tu equipo a nuestro taller en La Serena, a pocos minutos. Ahí trabajamos con calma, con las herramientas adecuadas, y te lo entregamos en 48 horas hábiles con diagnóstico real e informe técnico.',
        'Para trabajos simples, como un formateo o configurar un equipo, también podemos ir a tu casa u oficina en Coquimbo, con un recargo por visita que te informamos antes.',
        'Para pymes y oficinas de Coquimbo ofrecemos mantención de equipos de trabajo y planes de soporte mensual. Siempre con presupuesto previo, boleta y garantía.',
      ]}
      featuresTitle="Cómo te atendemos en Coquimbo"
      features={[
        { icon: MapPin, titulo: 'Taller en La Serena', desc: 'Coordinas una hora por WhatsApp y traes tu equipo. Te enviamos la dirección al agendar.' },
        { icon: House, titulo: 'Domicilio para trabajos simples', desc: 'Formateos y configuraciones en tu casa u oficina en Coquimbo, con recargo por visita informado antes.' },
        { icon: Search, titulo: 'Diagnóstico claro', desc: 'Te explicamos la falla y el costo antes de reparar. El diagnóstico se descuenta si reparas con nosotros.' },
        { icon: Laptop, titulo: 'Todo tipo de equipos', desc: 'Notebooks, PC de escritorio, PC Gamer, MacBook y consolas PlayStation.' },
        { icon: Building2, titulo: 'Soporte para empresas', desc: 'Mantención de equipos de oficina y soporte mensual por contrato para pymes.' },
        { icon: ShieldCheck, titulo: 'Garantía 30 días', desc: 'Garantía en mano de obra, precios con IVA y boleta en todos los servicios.' },
      ]}
      precios={[
        { nombre: 'Diagnóstico electrónico', precio: '$30.000', tiempo: '48 h hábiles', href: WA.diagnostico() },
        { nombre: 'Visita a domicilio (trabajos simples)', precio: 'Servicio + recargo', tiempo: 'A coordinar', href: WA.domicilio() },
        { nombre: 'Mantención empresarial', precio: 'A cotizar', tiempo: '48 h hábiles', href: WA.workstation() },
      ]}
      faqs={[
        { q: '¿Tengo que llevar mi computador a La Serena?', a: 'Sí, en la mayoría de los casos: los trabajos de hardware se hacen en nuestro taller en La Serena, con hora coordinada por WhatsApp. Así lo hacemos bien y con las herramientas adecuadas.' },
        { q: '¿Atienden a domicilio en Coquimbo?', a: 'Solo para trabajos simples, como formateo o configuración, con un recargo por visita según ubicación que te informamos antes de agendar.' },
        { q: '¿Atienden empresas de Coquimbo?', a: 'Sí. Hacemos mantención de equipos de trabajo y ofrecemos soporte técnico mensual por contrato para pymes.' },
        { q: '¿Cuándo pago?', a: 'Sin anticipo: pagas al retirar tu equipo funcionando. Emitimos boleta.' },
      ]}
      waHref={WA.servicio('Servicio técnico (cliente de Coquimbo)')}
      ctaTitle="¿Estás en Coquimbo?"
      ctaText="Cuéntanos qué le pasa a tu equipo por WhatsApp y coordinamos una hora para recibirlo en el taller."
    />
  )
}
