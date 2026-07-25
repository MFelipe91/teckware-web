import type { Metadata } from 'next'
import { Wrench, Thermometer, Fan, Cpu, Gauge, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Mantención de PC Gamer en La Serena',
  description:
    'Mantención profesional de PC Gamer en La Serena y Coquimbo: limpieza interna, cambio de pasta térmica premium, revisión de temperaturas y optimización. Recupera el rendimiento y baja las temperaturas de tu equipo.',
  alternates: { canonical: 'https://www.teckware.cl/mantencion-pc-gamer' },
}

export default function MantencionPCGamerPage() {
  return (
    <ServiceLanding
      eyebrow="Mantención Gaming"
      titulo="Mantención de"
      tituloAccent="PC Gamer"
      subtitle="Limpieza profunda, pasta térmica premium y optimización para que tu PC vuelva a rendir como el primer día — en La Serena y Coquimbo."
      heroImage="/images/pcgamer01.jpg"
      heroAlt="Mantención de PC Gamer — limpieza y pasta térmica en La Serena — TECKWARE"
      intro={[
        'Con el tiempo, el polvo se acumula en los ventiladores y disipadores de tu PC Gamer, la pasta térmica se seca y las temperaturas suben. El resultado: throttling, caídas de FPS, ruido excesivo y, en el peor caso, apagados por sobrecalentamiento.',
        'En TECKWARE realizamos una mantención física completa: desarmado, limpieza interna profunda, cambio de pasta térmica de alto rendimiento (Thermal Grizzly), revisión de flujo de aire y control de temperaturas bajo carga. Tu equipo recupera rendimiento, estabilidad y vida útil.',
        'Atendemos gabinetes de todas las gamas, desde equipos de entrada hasta builds de alta gama con refrigeración líquida. Diagnóstico transparente y garantía en todos nuestros trabajos.',
      ]}
      featuresTitle="Qué incluye la mantención"
      features={[
        { icon: Fan, titulo: 'Limpieza interna profunda', desc: 'Removemos polvo de ventiladores, disipadores, filtros y componentes con herramientas profesionales.' },
        { icon: Thermometer, titulo: 'Cambio de pasta térmica', desc: 'Aplicamos pasta térmica premium en CPU (y GPU si aplica) para bajar temperaturas varios grados.' },
        { icon: Gauge, titulo: 'Control de temperaturas', desc: 'Medimos temperaturas en reposo y bajo carga (stress test) para verificar el resultado real.' },
        { icon: Cpu, titulo: 'Revisión de componentes', desc: 'Chequeamos conexiones, ventiladores, almacenamiento y estado general del hardware.' },
        { icon: Wrench, titulo: 'Optimización opcional', desc: 'Podemos sumar formateo, actualización de drivers y optimización de Windows para gaming.' },
        { icon: ShieldCheck, titulo: 'Garantía incluida', desc: 'Todos los trabajos tienen garantía. Trabajo transparente y precio fijo, sin sorpresas.' },
      ]}
      marcasTitle="Compatible con todas las marcas"
      marcas={['ASUS', 'MSI', 'Gigabyte', 'ASRock', 'NVIDIA RTX', 'AMD Radeon', 'Intel', 'AMD Ryzen', 'Corsair', 'NZXT']}
      precios={[
        { nombre: 'Mantención Full', precio: '$75.000', tiempo: '24–48 h', href: WA.mantencionFull() },
        { nombre: 'Mantención GPU (pasta + pads)', precio: 'Desde $45.000', tiempo: '24 h', href: WA.mantencionGPU() },
        { nombre: 'Armado / Upgrade Gamer', precio: 'Desde $75.000', tiempo: '48 h', href: WA.armadoEstandar() },
      ]}
      faqs={[
        { q: '¿Cada cuánto debo hacer mantención a mi PC Gamer?', a: 'Recomendamos una mantención física al menos una vez al año. Si tu equipo está en un ambiente con mucho polvo o mascotas, cada 6–8 meses es lo ideal.' },
        { q: '¿Cuánto bajan las temperaturas después de la mantención?', a: 'Depende del estado inicial, pero es común ver reducciones de 10 a 20 °C en CPU y GPU tras la limpieza y el cambio de pasta térmica.' },
        { q: '¿Qué pasta térmica utilizan?', a: 'Usamos pasta térmica de alto rendimiento (Thermal Grizzly) y, en tarjetas gráficas, también reemplazamos los thermal pads cuando es necesario.' },
        { q: '¿Cuánto demora el servicio?', a: 'La mantención Full suele estar lista en 24 a 48 horas. Si necesitas urgencia, coordinamos por WhatsApp.' },
        { q: '¿Atienden en La Serena y Coquimbo?', a: 'Sí. Atendemos en La Serena y Coquimbo, e incluso ofrecemos servicio a domicilio coordinado previamente.' },
      ]}
      waHref={WA.servicio('Mantención de PC Gamer')}
      ctaTitle="¿Tu PC Gamer está caliente o ruidoso?"
      ctaText="Agenda tu mantención y devuélvele el rendimiento a tu equipo. Diagnóstico transparente y garantía incluida."
    />
  )
}
