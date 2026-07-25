import type { Metadata } from 'next'
import { Apple, HardDrive, BatteryCharging, Thermometer, Wrench, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Servicio Técnico Apple / MacBook en La Serena',
  description:
    'Servicio técnico Apple en La Serena y Coquimbo: reparación y mantención de MacBook Air y Pro, cambio de pasta térmica, upgrade de SSD, batería, limpieza interna y diagnóstico. Equipos Intel y Apple Silicon (M1, M2, M3).',
  alternates: { canonical: 'https://www.teckware.cl/servicio-tecnico-apple' },
}

export default function ServicioTecnicoApplePage() {
  return (
    <ServiceLanding
      eyebrow="Apple / Mac"
      titulo="Servicio Técnico"
      tituloAccent="Apple & MacBook"
      subtitle="Mantención, diagnóstico y reparación de MacBook Air y Pro en La Serena y Coquimbo — equipos Intel y Apple Silicon (M1, M2, M3)."
      heroImage="/images/mantenimiento.jpg"
      heroAlt="Servicio técnico Apple y MacBook en La Serena — TECKWARE"
      intro={[
        'Los equipos Apple son potentes y duraderos, pero también requieren cuidado. Con el uso, los MacBook acumulan polvo en la refrigeración, la pasta térmica se degrada y aparecen sobrecalentamiento, ventilador ruidoso y bajones de rendimiento. En modelos más antiguos, la batería y el almacenamiento también se vuelven un cuello de botella.',
        'En TECKWARE ofrecemos servicio técnico especializado para MacBook Air y Pro: limpieza interna profesional, cambio de pasta térmica, diagnóstico de fallas, reemplazo de batería y, en equipos compatibles, upgrade de SSD. Trabajamos tanto con Mac Intel como con Apple Silicon (M1, M2, M3).',
        'Diagnóstico transparente antes de intervenir y garantía en todos los trabajos. Cuidamos tu equipo y tus datos con la responsabilidad que merece.',
      ]}
      featuresTitle="Servicios para tu Mac"
      features={[
        { icon: Thermometer, titulo: 'Mantención térmica', desc: 'Limpieza interna y cambio de pasta térmica para eliminar el sobrecalentamiento y el ventilador ruidoso.' },
        { icon: BatteryCharging, titulo: 'Batería', desc: 'Diagnóstico de salud de batería y reemplazo cuando el ciclo de vida ya está agotado.' },
        { icon: HardDrive, titulo: 'Upgrade SSD', desc: 'Ampliación de almacenamiento en modelos compatibles para más velocidad y espacio.' },
        { icon: Apple, titulo: 'Diagnóstico Mac', desc: 'Revisión completa de hardware y software en equipos Intel y Apple Silicon (M1/M2/M3).' },
        { icon: Wrench, titulo: 'Optimización macOS', desc: 'Limpieza de sistema, respaldo de datos y puesta a punto para recuperar fluidez.' },
        { icon: ShieldCheck, titulo: 'Garantía y cuidado', desc: 'Trabajo con garantía, manejo responsable de tus datos y precio claro antes de reparar.' },
      ]}
      marcasTitle="Equipos Apple que atendemos"
      marcas={['MacBook Air', 'MacBook Pro', 'Mac Intel', 'Apple Silicon M1', 'Apple M2', 'Apple M3', 'iMac', 'Mac mini']}
      precios={[
        { nombre: 'Diagnóstico', precio: '$30.000', tiempo: '2–4 h', href: WA.diagnostico() },
        { nombre: 'Mantención térmica MacBook', precio: 'A cotizar', tiempo: '24–48 h', href: WA.servicio('Mantención MacBook') },
        { nombre: 'Upgrade SSD / Batería', precio: 'A cotizar', tiempo: 'A coordinar', href: WA.servicio('Upgrade / Batería MacBook') },
      ]}
      faqs={[
        { q: '¿Atienden MacBook con chip M1, M2 y M3?', a: 'Sí. Trabajamos tanto con Mac Intel como con Apple Silicon (M1, M2 y M3), en mantención, diagnóstico y upgrades compatibles.' },
        { q: 'Mi MacBook se calienta y el ventilador suena mucho, ¿qué hago?', a: 'Es señal de que necesita mantención térmica: limpieza interna y cambio de pasta. Es uno de los servicios más solicitados y mejora notablemente el rendimiento y el ruido.' },
        { q: '¿Puedo ampliar el disco de mi MacBook?', a: 'Depende del modelo. En equipos con SSD reemplazable sí es posible; en otros el almacenamiento viene soldado. Lo verificamos en el diagnóstico.' },
        { q: '¿Mis datos están seguros?', a: 'Sí. Manejamos tu información con confidencialidad y, cuando el trabajo lo requiere, hacemos respaldo previo. No accedemos a tus archivos sin autorización.' },
        { q: '¿Atienden en La Serena y Coquimbo?', a: 'Sí, atendemos toda la zona La Serena–Coquimbo. Coordina por WhatsApp para dejar tu equipo o consultar por servicio a domicilio.' },
      ]}
      waHref={WA.servicio('Servicio Técnico Apple / MacBook')}
      ctaTitle="¿Tu Mac necesita una puesta a punto?"
      ctaText="Agenda un diagnóstico para tu MacBook o equipo Apple. Servicio especializado, con garantía y cuidado de tus datos."
    />
  )
}
