import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { ServiciosDestacados } from '@/components/home/ServiciosDestacados'
import { PorQueElegirnos } from '@/components/home/PorQueElegirnos'
import { Proceso } from '@/components/home/Proceso'
import { Segmentos } from '@/components/home/Segmentos'
import { GuiasBlog } from '@/components/home/GuiasBlog'
import { InstagramBanda } from '@/components/home/InstagramBanda'
import { BandaCta } from '@/components/shared/BandaCta'
import { EMPRESA, PLAZO } from '@/lib/constants'
import { getServices } from '@/lib/services'
import { ogPagina } from '@/lib/seo'

// Revalida cada 5 min: los servicios destacados del panel cambian poco y así no se
// consulta Supabase en cada visita.
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: ogPagina('/'),
}

export default async function Home() {
  const servicios = await getServices()
  return (
    <>
      <Hero />
      <ServiciosDestacados servicios={servicios} />
      <Proceso />
      <InstagramBanda />
      <PorQueElegirnos />
      <Segmentos />
      <GuiasBlog />
      <BandaCta
        titulo="Cuéntanos qué le pasa a tu equipo"
        texto={`Te orientamos por WhatsApp, te damos el precio y coordinamos una hora para recibirlo. Entrega en ${PLAZO}, con informe técnico.`}
        nota={`${EMPRESA.direccion}. ${EMPRESA.horario}.`}
      />
    </>
  )
}
