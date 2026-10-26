import type { Metadata } from 'next'
import { Laptop, Thermometer, Keyboard, Battery, MemoryStick, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Reparación de Notebooks en La Serena y Coquimbo | TECKWARE' },
  description:
    'Reparación de notebooks HP, Lenovo, Dell, ASUS, Acer y más en La Serena y Coquimbo: no enciende, se calienta, lentitud, teclado, carga y upgrade a SSD. Entrega en 48 horas hábiles con informe técnico.',
  alternates: { canonical: '/reparacion-notebook-la-serena' },
}

export default function ReparacionNotebookLaSerenaPage() {
  return (
    <ServiceLanding
      path="/reparacion-notebook-la-serena"
      eyebrow="Notebooks"
      titulo="Reparación de notebooks en"
      tituloAccent="La Serena"
      subtitle="Tu notebook de estudio o trabajo de vuelta funcionando: diagnóstico rápido, presupuesto claro y garantía."
      heroImage="/images/mantencionpc2.jpg"
      heroAlt="Reparación de notebook abierto en el servicio técnico TECKWARE de La Serena"
      intro={[
        'Los problemas más comunes que vemos en notebooks son lentitud, sobrecalentamiento, ventilador ruidoso, equipos que no encienden o no cargan, teclados con teclas muertas y discos que fallan. Casi siempre tienen solución, y muchas veces sale bastante más barata que comprar otro equipo.',
        'Partimos con un diagnóstico electrónico para encontrar la causa real. Después te enviamos el presupuesto: mano de obra y, si hacen falta, repuestos cotizados aparte. No intervenimos nada sin tu aprobación.',
        'Una de las mejoras con más impacto es cambiar el disco mecánico por un SSD y sumar RAM: un notebook de varios años puede volver a sentirse rápido por una fracción del precio de uno nuevo.',
      ]}
      featuresTitle="Fallas que reparamos"
      features={[
        { icon: Laptop, titulo: 'No enciende o se apaga', desc: 'Revisamos alimentación, batería, placa y memoria para encontrar por qué no arranca o se apaga solo.' },
        { icon: Thermometer, titulo: 'Se calienta y hace ruido', desc: 'Limpieza interna del sistema de ventilación y cambio de pasta térmica para bajar temperaturas.' },
        { icon: MemoryStick, titulo: 'Lento: upgrade SSD y RAM', desc: 'Migramos tu sistema a un SSD y ampliamos la RAM cuando el modelo lo permite.' },
        { icon: Keyboard, titulo: 'Teclado y bisagras', desc: 'Reemplazo de teclados y reparación de bisagras o carcasas dañadas (repuesto cotizado aparte).' },
        { icon: Battery, titulo: 'Batería y carga', desc: 'Diagnóstico de batería, cargador y puerto de carga para saber exactamente qué cambiar.' },
        { icon: ShieldCheck, titulo: 'Garantía 30 días', desc: 'Garantía en la mano de obra, boleta y precios con IVA incluido.' },
      ]}
      marcasTitle="Marcas de notebooks que atendemos"
      marcas={['HP', 'Lenovo', 'Dell', 'ASUS', 'Acer', 'MSI', 'Samsung', 'Huawei', 'Toshiba', 'MacBook']}
      precios={[
        { nombre: 'Diagnóstico electrónico', precio: '$30.000', tiempo: '48 h hábiles', href: WA.diagnostico() },
        { nombre: 'Mantención Full notebook', precio: '$75.000', tiempo: '48 h hábiles', href: WA.mantencionFull() },
        { nombre: 'Upgrade SSD / RAM', precio: 'Desde $30.000', tiempo: 'A coordinar', href: WA.upgrade() },
      ]}
      faqs={[
        { q: '¿Vale la pena reparar mi notebook o mejor compro uno nuevo?', a: 'Después del diagnóstico te decimos honestamente si conviene. Muchas veces un SSD, más RAM y una mantención dejan el equipo funcionando bien por varios años más.' },
        { q: '¿Cuánto demora la reparación de un notebook?', a: 'El trabajo se entrega en 48 horas hábiles, con diagnóstico real e informe técnico. Si hay que pedir repuestos, te informamos el plazo antes.' },
        { q: '¿Pierdo mis archivos?', a: 'En una mantención o upgrade no. En el formateo incluimos un respaldo básico de tus archivos. Si el disco está dañado, primero intentamos recuperar los datos.' },
        { q: '¿Los repuestos están incluidos en el precio?', a: 'Los insumos sí (por ejemplo, pasta térmica). Repuestos y componentes como teclados, baterías o SSD se cotizan aparte.' },
      ]}
      waHref={WA.servicio('Reparación de notebook')}
      ctaTitle="¿Qué le pasa a tu notebook?"
      ctaText="Mándanos el modelo y una descripción de la falla por WhatsApp y te orientamos sin compromiso."
    />
  )
}
