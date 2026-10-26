import type { Metadata } from 'next'
import { Search, Laptop, Monitor, RefreshCw, HardDrive, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Servicio Técnico de Computadores en La Serena | TECKWARE' },
  description:
    'Servicio técnico de computadores y notebooks en La Serena y Coquimbo. Entrega en 48 horas hábiles con informe técnico: diagnóstico, formateo, mantención, upgrade y reparación. Precio claro antes de reparar, pago al retirar y garantía de 30 días.',
  alternates: { canonical: '/servicio-tecnico-computadores-la-serena' },
}

export default function ServicioTecnicoLaSerenaPage() {
  return (
    <ServiceLanding
      path="/servicio-tecnico-computadores-la-serena"
      eyebrow="La Serena · Coquimbo"
      titulo="Servicio técnico de computadores en"
      tituloAccent="La Serena"
      subtitle="Notebooks, PC de escritorio, PC Gamer y MacBook. Te decimos qué tiene tu equipo y cuánto cuesta antes de tocarlo."
      heroImage="/images/diagnostico_tester.jpg"
      heroAlt="Técnico revisando un computador en el servicio técnico TECKWARE de La Serena"
      intro={[
        'Si tu computador está lento, no enciende, se apaga solo, se calienta o se llenó de virus, en TECKWARE lo revisamos y te explicamos el problema en palabras simples. Atendemos personas, estudiantes, gamers y pymes de La Serena y Coquimbo.',
        'Todo parte con un diagnóstico electrónico ($30.000, con informe técnico en 48 horas hábiles). Con el resultado te enviamos un presupuesto claro por WhatsApp y tú decides. Si reparas con nosotros, el valor del diagnóstico se descuenta del total.',
        'Trabajamos sin anticipo: pagas al retirar tu equipo funcionando. Todos los precios incluyen IVA, emitimos boleta y la mano de obra tiene garantía de 30 días.',
      ]}
      featuresTitle="Qué resolvemos"
      features={[
        { icon: Search, titulo: 'Diagnóstico de fallas', desc: 'Equipos que no encienden, pantallazos azules, reinicios, ruidos o lentitud extrema. Encontramos la causa antes de cambiar nada.' },
        { icon: RefreshCw, titulo: 'Formateo y optimización', desc: 'Instalación limpia de Windows o macOS, drivers y programas esenciales, con respaldo básico de tus archivos.' },
        { icon: Laptop, titulo: 'Notebooks', desc: 'Limpieza interna, pasta térmica, teclados, bisagras, carga y upgrades de RAM y SSD en todas las marcas.' },
        { icon: Monitor, titulo: 'PC de escritorio y gamer', desc: 'Mantención física, cambio de componentes, armado y revisión de temperaturas bajo carga.' },
        { icon: HardDrive, titulo: 'Recuperación de datos', desc: 'Rescatamos fotos y documentos de discos dañados o equipos que no arrancan, siempre antes de formatear.' },
        { icon: ShieldCheck, titulo: 'Garantía y boleta', desc: '30 días de garantía en mano de obra, precios con IVA y boleta. Hablas directo con el técnico.' },
      ]}
      marcasTitle="Equipos que atendemos"
      marcas={['HP', 'Lenovo', 'Dell', 'ASUS', 'Acer', 'MSI', 'Samsung', 'Apple MacBook', 'PC armados', 'All-in-One']}
      precios={[
        { nombre: 'Diagnóstico electrónico', precio: '$30.000', tiempo: '48 h hábiles', href: WA.diagnostico() },
        { nombre: 'Mantención Lógica (formateo)', precio: '$45.000', tiempo: '48 h hábiles', href: WA.mantencionLogica() },
        { nombre: 'Mantención Full', precio: '$75.000', tiempo: '48 h hábiles', href: WA.mantencionFull() },
      ]}
      faqs={[
        { q: '¿Cuánto cuesta revisar mi computador?', a: 'El diagnóstico electrónico cuesta $30.000 con IVA y se entrega en 48 horas hábiles, con informe técnico. Si decides reparar con nosotros, ese monto se descuenta del total.' },
        { q: '¿Tengo que pagar algo por adelantado?', a: 'No. Trabajamos sin anticipo: pagas cuando retiras tu equipo funcionando.' },
        { q: '¿Qué garantía tienen los trabajos?', a: 'La mano de obra tiene 30 días de garantía. Si algo de lo que reparamos vuelve a fallar en ese plazo, lo revisamos sin costo.' },
        { q: '¿Atienden también en Coquimbo?', a: 'Sí. Atendemos clientes de La Serena y Coquimbo en nuestro taller en La Serena, con hora coordinada. Para trabajos simples, como formateo, también vamos a domicilio con un recargo según ubicación.' },
        { q: '¿Cuál es el horario de atención?', a: 'De lunes a viernes de 10:00 a 18:30. Por WhatsApp respondemos rápido para cotizar y coordinar.' },
      ]}
      waHref={WA.servicio('Servicio técnico de computador')}
      ctaTitle="¿Tu computador está fallando?"
      ctaText="Escríbenos por WhatsApp con el modelo y el problema. Te respondemos con los pasos a seguir y un valor estimado."
    />
  )
}
