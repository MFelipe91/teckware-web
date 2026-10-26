import type { Metadata } from 'next'
import { Cpu, Cable, Gauge, Lightbulb, Sparkles, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Armado de PC Gamer en La Serena | TECKWARE' },
  description:
    'Armado profesional de PC Gamer en La Serena y Coquimbo: ensamblaje, cable management, instalación de Windows y prueba de estabilidad. Estándar $75.000, alta gama con refrigeración líquida $90.000.',
  alternates: { canonical: '/armado-pc-gamer-la-serena' },
}

export default function ArmadoPCGamerLaSerenaPage() {
  return (
    <ServiceLanding
      path="/armado-pc-gamer-la-serena"
      eyebrow="PC Gamer"
      titulo="Armado de PC Gamer en"
      tituloAccent="La Serena"
      subtitle="Compraste las piezas, nosotros las convertimos en un PC estable, ordenado y listo para jugar."
      heroImage="/images/pc-montaje.jpg"
      heroAlt="Armado de PC Gamer con gestión de cables en La Serena — TECKWARE"
      intro={[
        'Armar un PC no es solo conectar piezas: hay que verificar compatibilidad, instalar bien el procesador y la refrigeración, ordenar los cables para que el aire circule, configurar la BIOS y probar que todo sea estable bajo carga.',
        'En el armado estándar ($75.000) ensamblamos tus componentes con gestión de cables, instalamos el sistema y hacemos pruebas de estabilidad. El armado de alta gama ($90.000) suma refrigeración líquida compleja, setups estéticos y personalización RGB.',
        '¿Todavía no compras las piezas? Te asesoramos para elegir componentes compatibles según tu presupuesto y los juegos o programas que usas. Puedes ver ejemplos de configuraciones en nuestra sección PC Gamer.',
      ]}
      featuresTitle="Qué incluye el armado"
      features={[
        { icon: Lightbulb, titulo: 'Asesoría de componentes', desc: 'Revisamos compatibilidad de placa, CPU, RAM, fuente y gabinete antes de armar.' },
        { icon: Cpu, titulo: 'Ensamblaje profesional', desc: 'Montaje cuidadoso de CPU, disipador, memorias, almacenamiento y tarjeta gráfica.' },
        { icon: Cable, titulo: 'Cable management', desc: 'Cables ordenados para mejor flujo de aire y un interior limpio a la vista.' },
        { icon: Gauge, titulo: 'Pruebas de estabilidad', desc: 'Configuración de BIOS, perfiles de memoria y pruebas de temperatura bajo carga.' },
        { icon: Sparkles, titulo: 'Alta gama y RGB', desc: 'Refrigeración líquida, setups estéticos y sincronización de iluminación en el armado de alta gama.' },
        { icon: ShieldCheck, titulo: 'Garantía 30 días', desc: 'Garantía en la mano de obra del armado, boleta y precio con IVA.' },
      ]}
      marcasTitle="Plataformas que armamos"
      marcas={['AMD Ryzen', 'Intel Core', 'NVIDIA GeForce RTX', 'AMD Radeon', 'ASUS', 'MSI', 'Gigabyte', 'ASRock', 'Corsair', 'NZXT']}
      precios={[
        { nombre: 'Armado PC Gamer estándar', precio: '$75.000', tiempo: '48 h hábiles', href: WA.armadoEstandar() },
        { nombre: 'Armado alta gama', precio: '$90.000', tiempo: '48–72 h hábiles', href: WA.armadoAltaGama() },
        { nombre: 'Asesoría y upgrade', precio: 'Desde $30.000', tiempo: 'A coordinar', href: WA.upgrade() },
      ]}
      faqs={[
        { q: '¿El precio del armado incluye los componentes?', a: 'No. El valor corresponde al servicio de armado. Los componentes los aportas tú o te los cotizamos aparte.' },
        { q: '¿Me ayudan a elegir las piezas?', a: 'Sí. Te asesoramos para elegir componentes compatibles según tu presupuesto y uso: gaming, streaming, edición o trabajo.' },
        { q: '¿Cuánto demora el armado?', a: 'El armado estándar está listo en 48 horas hábiles. Uno de alta gama con refrigeración líquida, entre 48 y 72 horas hábiles.' },
        { q: '¿Instalan Windows?', a: 'Sí, instalamos el sistema operativo y los drivers. Se activa con tu licencia.' },
      ]}
      waHref={WA.armadoEstandar()}
      ctaTitle="¿Tienes las piezas o estás cotizando?"
      ctaText="Escríbenos con tu lista de componentes o tu presupuesto y te ayudamos a armar el PC que necesitas."
    />
  )
}
