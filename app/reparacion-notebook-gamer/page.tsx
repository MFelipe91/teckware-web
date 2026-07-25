import type { Metadata } from 'next'
import { Fan, Thermometer, HardDrive, Keyboard, MonitorSmartphone, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Reparación de Notebook Gamer en La Serena',
  description:
    'Reparación y mantención de notebooks gamer en La Serena y Coquimbo: sobrecalentamiento, cambio de pasta térmica, limpieza de ventiladores, upgrade de RAM y SSD, y reparación de fallas. ASUS ROG, MSI, Lenovo Legion, Acer Predator y más.',
  alternates: { canonical: 'https://www.teckware.cl/reparacion-notebook-gamer' },
}

export default function ReparacionNotebookGamerPage() {
  return (
    <ServiceLanding
      eyebrow="Notebooks Gaming"
      titulo="Reparación de"
      tituloAccent="Notebook Gamer"
      subtitle="Sobrecalentamiento, bajones de FPS, fallas o upgrades: dejamos tu notebook gamer rindiendo al máximo — en La Serena y Coquimbo."
      heroImage="/images/mantencionpc2.jpg"
      heroAlt="Reparación y mantención de notebook gamer en La Serena — TECKWARE"
      intro={[
        'Los notebooks gamer concentran mucha potencia en poco espacio, por lo que el calor es su principal enemigo. Cuando los ventiladores se llenan de polvo y la pasta térmica se degrada, aparecen el throttling, las caídas de FPS, los apagados repentinos y el ruido constante.',
        'En TECKWARE reparamos y mantenemos notebooks gamer de todas las marcas: limpieza interna, cambio de pasta térmica premium, reemplazo de thermal pads, y solución de fallas de encendido, pantalla, teclado o carga. También hacemos upgrades de RAM y SSD para darle más vida y velocidad a tu equipo.',
        'Trabajamos con diagnóstico transparente y garantía. Antes de intervenir, siempre te informamos qué tiene tu equipo y cuánto costará la reparación.',
      ]}
      featuresTitle="Qué reparamos y mantenemos"
      features={[
        { icon: Thermometer, titulo: 'Sobrecalentamiento', desc: 'Cambio de pasta térmica y thermal pads + limpieza del sistema de disipación para bajar temperaturas.' },
        { icon: Fan, titulo: 'Limpieza de ventiladores', desc: 'Removemos el polvo que ahoga la refrigeración y genera ruido y throttling.' },
        { icon: HardDrive, titulo: 'Upgrade RAM y SSD', desc: 'Ampliamos memoria y cambiamos a SSD NVMe para más velocidad y multitarea fluida.' },
        { icon: MonitorSmartphone, titulo: 'Fallas de pantalla', desc: 'Diagnóstico y reparación de pantalla, bisagras, flex y problemas de imagen.' },
        { icon: Keyboard, titulo: 'Teclado y carga', desc: 'Reparación de teclado, puerto de carga, batería y problemas de encendido.' },
        { icon: ShieldCheck, titulo: 'Garantía incluida', desc: 'Todos los trabajos con garantía. Diagnóstico honesto y precio claro antes de reparar.' },
      ]}
      marcasTitle="Marcas de notebook gamer que atendemos"
      marcas={['ASUS ROG', 'ASUS TUF', 'MSI', 'Lenovo Legion', 'Acer Predator', 'Acer Nitro', 'HP Omen', 'HP Victus', 'Dell G-Series', 'Alienware']}
      precios={[
        { nombre: 'Diagnóstico', precio: '$30.000', tiempo: '2–4 h', href: WA.diagnostico() },
        { nombre: 'Mantención Full (pasta + limpieza)', precio: '$75.000', tiempo: '24–48 h', href: WA.mantencionFull() },
        { nombre: 'Upgrade RAM / SSD', precio: 'Desde $30.000', tiempo: 'A coordinar', href: WA.upgrade() },
      ]}
      faqs={[
        { q: 'Mi notebook gamer se apaga solo jugando, ¿qué es?', a: 'Casi siempre es sobrecalentamiento por polvo acumulado y pasta térmica degradada. Con una mantención física completa se soluciona en la mayoría de los casos.' },
        { q: '¿Puedo ampliar la RAM y el disco de mi notebook gamer?', a: 'En la mayoría de los modelos sí. Verificamos la compatibilidad de tu equipo y te recomendamos el upgrade que mejor relación precio/rendimiento te dé.' },
        { q: '¿Reparan la marca X?', a: 'Atendemos todas las marcas: ASUS ROG/TUF, MSI, Lenovo Legion, Acer Predator/Nitro, HP Omen/Victus, Dell y más. Si tu modelo no aparece, escríbenos igual.' },
        { q: '¿Cuánto demora la reparación?', a: 'Un diagnóstico toma 2 a 4 horas. Las mantenciones y upgrades suelen estar listos en 24 a 48 horas, según disponibilidad de repuestos.' },
        { q: '¿Atienden en La Serena y Coquimbo?', a: 'Sí, atendemos toda la conurbación La Serena–Coquimbo. Coordina por WhatsApp para dejar o retirar tu equipo.' },
      ]}
      waHref={WA.servicio('Reparación de Notebook Gamer')}
      ctaTitle="¿Tu notebook gamer se calienta o falla?"
      ctaText="Agenda un diagnóstico y devuélvele el rendimiento. Trabajamos con garantía y precios transparentes."
    />
  )
}
