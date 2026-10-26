import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { TrustStrip } from '@/components/home/TrustStrip'
import { ServiciosDestacados } from '@/components/home/ServiciosDestacados'
import { PorQueElegirnos } from '@/components/home/PorQueElegirnos'
import { Proceso } from '@/components/home/Proceso'
import { Segmentos } from '@/components/home/Segmentos'
import { GuiasBlog } from '@/components/home/GuiasBlog'
import { CTABanner } from '@/components/home/CTABanner'
import { getServices } from '@/lib/services'

// Revalida cada 5 min: los servicios destacados del panel cambian poco y así no se
// consulta Supabase en cada visita.
export const revalidate = 300

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function Home() {
  const servicios = await getServices()
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServiciosDestacados servicios={servicios} />
      <Proceso />
      <PorQueElegirnos />
      <Segmentos />
      <GuiasBlog />
      <CTABanner />
    </>
  )
}
