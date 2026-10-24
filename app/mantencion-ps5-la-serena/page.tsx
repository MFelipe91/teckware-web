import type { Metadata } from 'next'
import { Gamepad2, Thermometer, Fan, Gauge, Zap, ShieldCheck } from 'lucide-react'
import { ServiceLanding } from '@/components/landing/ServiceLanding'
import { WA } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: { absolute: 'Mantención PS5 y PS4 en La Serena | Metal Líquido | TECKWARE' },
  description:
    'Mantención de PlayStation 5 con cambio de metal líquido ($80.000) y de PS4 / PS3 ($55.000) en La Serena y Coquimbo. Limpieza interna, menos ruido y temperaturas más bajas.',
  alternates: { canonical: '/mantencion-ps5-la-serena' },
}

export default function MantencionPS5LaSerenaPage() {
  return (
    <ServiceLanding
      path="/mantencion-ps5-la-serena"
      eyebrow="Consolas PlayStation"
      titulo="Mantención de PS5 y PS4 en"
      tituloAccent="La Serena"
      subtitle="Si tu consola suena como turbina o se apaga sola, necesita limpieza y refrigeración nueva."
      heroImage="/images/ps5-metal-liquido.jpg"
      heroAlt="PlayStation 5 abierta durante el cambio de metal líquido en La Serena"
      intro={[
        'Las consolas PlayStation acumulan polvo en el ventilador y el disipador, y con el tiempo la refrigeración pierde eficiencia. Las señales son claras: ventilador muy ruidoso, consola caliente al tacto, mensajes de temperatura o apagados en medio de una partida.',
        'La PS5 usa metal líquido como conductor térmico del procesador. Hacemos su mantención especializada con limpieza completa y cambio de metal líquido ($80.000), recomendada una vez al año para mantener temperaturas óptimas.',
        'Para PS4 y PS3 realizamos limpieza física completa y cambio de pasta térmica ($55.000). En ambos casos probamos la consola y sus temperaturas antes de entregarla.',
      ]}
      featuresTitle="Qué incluye la mantención"
      features={[
        { icon: Fan, titulo: 'Limpieza interna completa', desc: 'Desarme, limpieza de ventilador, disipador y rejillas para recuperar el flujo de aire.' },
        { icon: Thermometer, titulo: 'Metal líquido en PS5', desc: 'Retiro y aplicación nueva de metal líquido en el procesador de la PS5, con el cuidado que requiere.' },
        { icon: Zap, titulo: 'Pasta térmica en PS4 / PS3', desc: 'Cambio de pasta térmica para bajar temperaturas y ruido.' },
        { icon: Gauge, titulo: 'Prueba de temperaturas', desc: 'Probamos la consola en uso antes de entregarla para verificar el resultado.' },
        { icon: Gamepad2, titulo: 'Prueba de funcionamiento', desc: 'Revisamos lectura, puertos y funcionamiento general.' },
        { icon: ShieldCheck, titulo: 'Garantía 30 días', desc: 'Garantía en mano de obra, boleta y precios con IVA incluido.' },
      ]}
      marcasTitle="Consolas que atendemos"
      marcas={['PS5 estándar', 'PS5 Digital', 'PS5 Slim', 'PS4', 'PS4 Slim', 'PS4 Pro', 'PS3']}
      precios={[
        { nombre: 'Mantención PS5 (metal líquido)', precio: '$80.000', tiempo: '24–48 h', href: WA.consolaPS5() },
        { nombre: 'Mantención PS4 / PS3', precio: '$55.000', tiempo: '24 h', href: WA.consolaPS4() },
        { nombre: 'Diagnóstico de falla', precio: '$30.000', tiempo: '2–4 h', href: WA.diagnostico() },
      ]}
      faqs={[
        { q: '¿Cada cuánto hay que hacerle mantención a la PS5?', a: 'Recomendamos una vez al año, o antes si notas el ventilador más ruidoso o la consola muy caliente.' },
        { q: '¿Por qué la PS5 usa metal líquido?', a: 'Porque conduce el calor mucho mejor que la pasta térmica común. Su aplicación requiere cuidado y aislamiento correcto, por eso es un servicio especializado.' },
        { q: '¿Cuánto demora la mantención de PS5?', a: 'Entre 24 y 48 horas. La de PS4 o PS3 suele estar lista en 24 horas.' },
        { q: '¿Pierdo mis partidas o juegos?', a: 'No. La mantención es física y no toca el almacenamiento ni tu cuenta.' },
      ]}
      waHref={WA.consolaPS5()}
      ctaTitle="¿Tu PlayStation está ruidosa o caliente?"
      ctaText="Agenda su mantención y vuelve a jugar con menos ruido y temperaturas más bajas."
    />
  )
}
