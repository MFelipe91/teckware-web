import type { Metadata } from 'next'
import { MapPin, House, Search, Laptop, Building2, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Servicio Técnico de Computadores en Coquimbo | TECKWARE' },
  description:
    'Servicio técnico de computadores, notebooks, PC Gamer y consolas para Coquimbo. Visita a domicilio en hogares y empresas, diagnóstico claro, pago al retirar y 30 días de garantía.',
  alternates: { canonical: '/servicio-tecnico-coquimbo' },
}

export default function ServicioTecnicoCoquimboPage() {
  return (
    <ServiceLanding
      path="/servicio-tecnico-coquimbo"
      eyebrow="Coquimbo"
      titulo="Servicio técnico de computadores en"
      tituloAccent="Coquimbo"
      subtitle="Reparación y mantención de notebooks, PC y consolas para clientes de Coquimbo, con visita a domicilio cuando la necesitas."
      heroImage="/images/mantenimiento.jpg"
      heroAlt="Mantención de computador para clientes de Coquimbo — TECKWARE"
      intro={[
        'TECKWARE es un servicio técnico de la conurbación La Serena–Coquimbo. Si vives o trabajas en Coquimbo, puedes coordinar con nosotros por WhatsApp la entrega de tu equipo o pedir una visita técnica a tu casa u oficina.',
        'La visita a domicilio sirve para diagnosticar en terreno, configurar equipos, redes WiFi o impresoras, y resolver problemas que no requieren llevarse el computador. La tarifa depende de la ubicación y se cotiza antes de ir.',
        'Para pymes y oficinas de Coquimbo ofrecemos mantención de equipos de trabajo y planes de soporte mensual. Siempre con presupuesto previo, boleta y garantía.',
      ]}
      featuresTitle="Cómo te atendemos en Coquimbo"
      features={[
        { icon: House, titulo: 'Visita a domicilio', desc: 'Vamos a tu hogar o empresa en Coquimbo. Tarifa de visita según ubicación, informada antes de agendar.' },
        { icon: MapPin, titulo: 'Entrega coordinada', desc: 'Si el equipo necesita taller, coordinamos por WhatsApp la entrega y el retiro en La Serena.' },
        { icon: Search, titulo: 'Diagnóstico claro', desc: 'Te explicamos la falla y el costo antes de reparar. El diagnóstico se descuenta si reparas con nosotros.' },
        { icon: Laptop, titulo: 'Todo tipo de equipos', desc: 'Notebooks, PC de escritorio, PC Gamer, MacBook y consolas PlayStation.' },
        { icon: Building2, titulo: 'Soporte para empresas', desc: 'Mantención de equipos de oficina y soporte mensual por contrato para pymes.' },
        { icon: ShieldCheck, titulo: 'Garantía 30 días', desc: 'Garantía en mano de obra, precios con IVA y boleta en todos los servicios.' },
      ]}
      precios={[
        { nombre: 'Soporte a domicilio', precio: 'A cotizar', tiempo: 'A coordinar', href: WA.domicilio() },
        { nombre: 'Diagnóstico electrónico', precio: '$30.000', tiempo: '2–4 h', href: WA.diagnostico() },
        { nombre: 'Mantención empresarial', precio: 'A cotizar', tiempo: '24–72 h', href: WA.workstation() },
      ]}
      faqs={[
        { q: '¿Atienden a domicilio en Coquimbo?', a: 'Sí. Hacemos visitas técnicas a hogares y empresas de Coquimbo. La tarifa depende de la ubicación y te la confirmamos por WhatsApp antes de agendar.' },
        { q: '¿Tengo que llevar mi computador a La Serena?', a: 'No siempre. Muchos problemas se resuelven en la visita. Si el equipo necesita taller, coordinamos contigo la entrega y el retiro.' },
        { q: '¿Atienden empresas de Coquimbo?', a: 'Sí. Hacemos mantención de equipos de trabajo y ofrecemos soporte técnico mensual por contrato para pymes.' },
        { q: '¿Cuándo pago?', a: 'Sin anticipo: pagas al retirar tu equipo funcionando o al terminar el servicio en terreno. Emitimos boleta.' },
      ]}
      waHref={WA.domicilio()}
      ctaTitle="¿Estás en Coquimbo?"
      ctaText="Cuéntanos tu sector y el problema por WhatsApp, y te proponemos la forma más rápida de resolverlo."
    />
  )
}
