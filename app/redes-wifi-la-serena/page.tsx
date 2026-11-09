import type { Metadata } from 'next'
import { Wifi, Router, Signal, Building2, ShieldCheck, Cable } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { PLAZO } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { ogPagina } from '@/lib/seo'

// Servicio nuevo (2026-11). Alcance y precio por confirmar con el dueño antes de publicar.
export const metadata: Metadata = {
  title: 'Redes y WiFi en La Serena y Coquimbo',
  description:
    'Mejora tu señal WiFi en casa u oficina en La Serena y Coquimbo: revisión de cobertura, configuración del router y redes estables. Cotiza por WhatsApp.',
  alternates: { canonical: '/redes-wifi-la-serena' },
  openGraph: ogPagina('/redes-wifi-la-serena'),
}

export default function RedesWifiPage() {
  return (
    <ServiceLanding
      path="/redes-wifi-la-serena"
      eyebrow="Redes y conectividad"
      titulo="Redes y WiFi"
      tituloAccent="en La Serena y Coquimbo"
      subtitle="Revisamos tu red, configuramos el router y mejoramos la cobertura WiFi para que la conexión llegue estable a donde la necesitas, en casa u oficina."
      intro={[
        'Un WiFi lento o que se corta no siempre es culpa del plan de internet. Muchas veces el router está mal ubicado, usa un canal saturado o su configuración no es la adecuada para la cantidad de equipos conectados.',
        'Revisamos la señal en los lugares donde la usas, ajustamos la configuración del router y te recomendamos la mejor solución para tu espacio, antes de que compres equipos que quizás no necesitas.',
        'Cada lugar es distinto, por eso este servicio se cotiza según el tamaño del espacio, los equipos y lo que necesitas. Escríbenos por WhatsApp y te orientamos.',
      ]}
      featuresTitle="Qué revisamos"
      features={[
        { icon: Signal, titulo: 'Cobertura de la señal', desc: 'Medimos dónde llega bien el WiFi y dónde se cae, para saber qué conviene mejorar.' },
        { icon: Router, titulo: 'Configuración del router', desc: 'Canal, bandas de 2,4 y 5 GHz, contraseña segura y nombre de red ordenado.' },
        { icon: Wifi, titulo: 'Mejora de cobertura', desc: 'Recomendación de ubicación, repetidores o equipos mesh solo si de verdad hacen falta.' },
        { icon: Building2, titulo: 'Casa u oficina', desc: 'Redes domésticas y de oficinas pequeñas, con equipos y usuarios ordenados.' },
        { icon: Cable, titulo: 'Equipos conectados', desc: 'Revisión de computadores, consolas y televisores que se conectan con problemas.' },
        { icon: ShieldCheck, titulo: 'Red más segura', desc: 'Contraseñas, acceso del administrador y red de invitados separada.' },
      ]}
      precios={[
        { nombre: 'Revisión y configuración de red', precio: 'A cotizar', tiempo: 'A coordinar', href: WA.redesWifi() },
        { nombre: 'Diagnóstico de equipo con problemas de conexión', precio: 'A cotizar', tiempo: PLAZO, href: WA.redesWifi() },
      ]}
      faqs={[
        { q: '¿Cuánto cuesta mejorar el WiFi?', a: 'Depende del tamaño del lugar, de los equipos que ya tienes y de lo que necesitas. Escríbenos por WhatsApp con esos datos y te damos un valor antes de empezar.' },
        { q: '¿Tengo que comprar un router nuevo?', a: 'No siempre. Muchas veces basta con reubicar o configurar bien el router que ya tienes. Solo recomendamos comprar equipos cuando de verdad hace falta.' },
        { q: '¿Atienden oficinas y pymes?', a: 'Sí, revisamos redes de oficinas pequeñas en La Serena y Coquimbo. Para más equipos o soporte continuo, revisa nuestras soluciones para empresas.' },
        { q: '¿Atienden en La Serena y Coquimbo?', a: 'Sí, coordinamos por WhatsApp el día y la hora según el lugar.' },
      ]}
      waHref={WA.redesWifi()}
      ctaTitle="¿Tu WiFi no llega o se corta?"
      ctaText="Cuéntanos dónde está el problema y te orientamos por WhatsApp. Te damos el valor antes de empezar."
    />
  )
}
