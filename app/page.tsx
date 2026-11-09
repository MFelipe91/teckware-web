import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { TrustBar } from '@/components/home/TrustBar'
import { ServiciosGrid } from '@/components/home/ServiciosGrid'
import { PorQueElegirnos } from '@/components/home/PorQueElegirnos'
import { Proceso } from '@/components/home/Proceso'
import { ServiciosDestacados } from '@/components/home/ServiciosDestacados'
import { InstagramBanda } from '@/components/home/InstagramBanda'
import { GuiasBlog } from '@/components/home/GuiasBlog'
import { BandaCta } from '@/components/shared/BandaCta'
import { EMPRESA, PLAZO } from '@/lib/constants'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: ogPagina('/'),
}

// Portada "Gaming Premium" (maqueta B). Precios y textos salen de lib/constants.ts, así la
// página es estática y no consulta la base en cada visita.
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServiciosGrid />
      <PorQueElegirnos />
      <Proceso />
      <ServiciosDestacados />
      <InstagramBanda />
      <GuiasBlog />
      <BandaCta
        titulo="Cuéntanos qué le pasa a tu equipo"
        texto={`Te orientamos por WhatsApp, te damos el precio y coordinamos una hora para recibirlo. Entrega en ${PLAZO}, con informe técnico.`}
        nota={`${EMPRESA.direccion}. ${EMPRESA.horario}.`}
      />
    </>
  )
}
