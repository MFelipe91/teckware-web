import type { Metadata } from 'next'
import { HardDrive, Database, Usb, ScanSearch, Lock, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Recuperación de Datos en La Serena | Discos y Notebooks | TECKWARE' },
  description:
    'Recuperación de archivos en La Serena y Coquimbo: discos dañados, notebooks que no encienden, pendrives y archivos borrados. Desde $35.000 con IVA. Tus datos se tratan con confidencialidad.',
  alternates: { canonical: '/recuperacion-de-datos-la-serena' },
}

export default function RecuperacionDatosLaSerenaPage() {
  return (
    <ServiceLanding
      path="/recuperacion-de-datos-la-serena"
      eyebrow="Recuperación de datos"
      titulo="Recuperación de datos en"
      tituloAccent="La Serena"
      subtitle="Fotos, documentos y trabajos de un disco dañado o un computador que ya no arranca."
      heroImage="/images/recuperacion-datos.jpg"
      heroAlt="Disco duro abierto durante una recuperación de datos en La Serena"
      intro={[
        'Cuando un computador deja de arrancar o un disco empieza a fallar, lo más importante suele ser la información: fotos familiares, documentos de trabajo, tesis. Lo primero es no seguir usando el equipo ni formatear, porque eso reduce las posibilidades de recuperar.',
        'Revisamos el disco o medio de almacenamiento, recuperamos los archivos que se pueden rescatar y te los entregamos en tu disco o pendrive. El servicio parte desde $35.000 con IVA. El valor final depende del nivel de daño y te lo informamos antes de continuar.',
        'Seremos claros contigo: en discos con daño físico severo no se puede garantizar el 100% de la recuperación. Tampoco accedemos a tus archivos más allá de lo necesario para el trabajo.',
      ]}
      featuresTitle="Casos que atendemos"
      features={[
        { icon: HardDrive, titulo: 'Discos con fallas', desc: 'Discos que hacen ruidos, se desconectan o aparecen como "sin formato".' },
        { icon: Database, titulo: 'Equipos que no arrancan', desc: 'Sacamos tu información de un notebook o PC que ya no inicia Windows o macOS.' },
        { icon: Usb, titulo: 'Pendrives y discos externos', desc: 'Recuperación desde memorias USB, tarjetas SD y discos externos.' },
        { icon: ScanSearch, titulo: 'Archivos borrados', desc: 'Búsqueda de archivos eliminados por error o tras un formateo accidental.' },
        { icon: Lock, titulo: 'Confidencialidad', desc: 'Tu información se trata con reserva y solo para el trabajo solicitado.' },
        { icon: ShieldCheck, titulo: 'Presupuesto claro', desc: 'Te informamos qué se puede recuperar y cuánto cuesta antes de seguir.' },
      ]}
      precios={[
        { nombre: 'Recuperación de datos', precio: 'Desde $35.000', tiempo: '24–48 h', href: WA.recuperacion() },
        { nombre: 'Diagnóstico electrónico', precio: '$30.000', tiempo: '2–4 h', href: WA.diagnostico() },
        { nombre: 'Formateo con respaldo', precio: '$45.000', tiempo: '24–48 h', href: WA.mantencionLogica() },
      ]}
      faqs={[
        { q: '¿Se pueden recuperar archivos de un notebook que no enciende?', a: 'En la mayoría de los casos sí, porque la información está en el disco y no en la placa. Retiramos el disco y recuperamos los archivos desde ahí.' },
        { q: '¿Cuánto cuesta recuperar datos?', a: 'Desde $35.000 con IVA. El valor final depende del daño del disco y de la cantidad de información; te lo confirmamos antes de continuar.' },
        { q: '¿Garantizan recuperar todo?', a: 'No podemos garantizar el 100% en discos con daño físico severo. Siempre te informamos qué se pudo recuperar.' },
        { q: '¿Qué debo hacer si mi disco empezó a fallar?', a: 'Deja de usarlo, no lo formatees ni instales programas de recuperación sobre el mismo disco, y contáctanos lo antes posible.' },
      ]}
      waHref={WA.recuperacion()}
      ctaTitle="¿Perdiste archivos importantes?"
      ctaText="No sigas usando el equipo. Escríbenos y te decimos cómo proceder para tener las mejores posibilidades de recuperarlos."
    />
  )
}
