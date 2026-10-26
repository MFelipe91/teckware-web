import type { Metadata } from 'next'
import { RefreshCw, HardDriveDownload, Settings, AppWindow, Bug, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Formateo de PC y Notebook en La Serena | TECKWARE' },
  description:
    'Formateo de computador y notebook en La Serena y Coquimbo: instalación limpia de Windows o macOS, drivers, programas esenciales y respaldo básico de archivos. $45.000 con IVA, listo en 48 horas hábiles.',
  alternates: { canonical: '/formateo-pc-la-serena' },
}

export default function FormateoPCLaSerenaPage() {
  return (
    <ServiceLanding
      path="/formateo-pc-la-serena"
      eyebrow="Formateo"
      titulo="Formateo de PC y notebook en"
      tituloAccent="La Serena"
      subtitle="Instalación limpia de Windows o macOS, con tus archivos respaldados y el equipo listo para usar."
      heroImage="/images/operating_system.jpg"
      heroAlt="Instalación limpia de sistema operativo en un computador — formateo en La Serena"
      intro={[
        'Formatear es la forma más efectiva de eliminar virus, publicidad invasiva, programas basura y errores acumulados de Windows. El equipo vuelve a arrancar rápido y a responder como cuando era nuevo.',
        'En nuestra Mantención Lógica ($45.000 con IVA) respaldamos tus archivos importantes, instalamos el sistema operativo desde cero, dejamos los drivers y actualizaciones al día, e instalamos los programas esenciales. Te lo entregamos listo para usar en 48 horas hábiles, con un informe técnico de lo que hicimos.',
        'Si además tu equipo se calienta o hace ruido, conviene la Mantención Full ($75.000), que suma limpieza física interna y cambio de pasta térmica al formateo.',
      ]}
      featuresTitle="Qué incluye el formateo"
      features={[
        { icon: HardDriveDownload, titulo: 'Respaldo de tus archivos', desc: 'Antes de formatear respaldamos tus documentos, fotos y escritorio (respaldo básico incluido).' },
        { icon: RefreshCw, titulo: 'Sistema operativo limpio', desc: 'Instalación desde cero de Windows o macOS, sin restos del sistema anterior.' },
        { icon: Settings, titulo: 'Drivers y actualizaciones', desc: 'Controladores correctos para tu modelo y todas las actualizaciones aplicadas.' },
        { icon: AppWindow, titulo: 'Programas esenciales', desc: 'Navegador, lector PDF, compresor y lo básico. Office u otros pagados se instalan con tu licencia.' },
        { icon: Bug, titulo: 'Adiós virus y publicidad', desc: 'El formateo elimina malware, extensiones invasivas y programas que se inician solos.' },
        { icon: ShieldCheck, titulo: 'Garantía 30 días', desc: 'Garantía en la mano de obra, precio con IVA y boleta.' },
      ]}
      precios={[
        { nombre: 'Mantención Lógica (formateo)', precio: '$45.000', tiempo: '48 h hábiles', href: WA.mantencionLogica() },
        { nombre: 'Mantención Full (formateo + limpieza)', precio: '$75.000', tiempo: '48 h hábiles', href: WA.mantencionFull() },
        { nombre: 'Recuperación de datos', precio: 'Desde $35.000', tiempo: '48 h hábiles', href: WA.recuperacion() },
      ]}
      faqs={[
        { q: '¿Cuánto cuesta formatear un computador en La Serena?', a: 'La Mantención Lógica, que incluye formateo, sistema operativo, drivers, programas esenciales y respaldo básico, cuesta $45.000 con IVA.' },
        { q: '¿Voy a perder mis archivos?', a: 'No. Antes de formatear hacemos un respaldo básico de tus archivos y los dejamos en el equipo. Si el disco está dañado, primero intentamos recuperar la información.' },
        { q: '¿Instalan Office?', a: 'Instalamos Office u otros programas pagados usando tu licencia. Si no tienes, podemos instalar alternativas gratuitas como LibreOffice.' },
        { q: '¿Formatean MacBook?', a: 'Sí. Hacemos instalación limpia de macOS en equipos Apple compatibles.' },
        { q: '¿Cuánto demora?', a: 'Se entrega en 48 horas hábiles, con informe técnico. Si hay muchos archivos que respaldar, te avisamos antes.' },
      ]}
      waHref={WA.mantencionLogica()}
      ctaTitle="¿Tu computador está lento o con virus?"
      ctaText="Agenda tu formateo y recíbelo limpio, actualizado y con tus archivos de vuelta."
    />
  )
}
