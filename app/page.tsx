import { Hero } from '@/components/home/Hero'
import { Ticker } from '@/components/home/Ticker'
import { BookingStrip } from '@/components/home/BookingStrip'
import { ServiciosDestacados } from '@/components/home/ServiciosDestacados'
import { PorQueElegirnos } from '@/components/home/PorQueElegirnos'
import { Proceso } from '@/components/home/Proceso'
import { Reviews } from '@/components/home/Reviews'
import { CTABanner } from '@/components/home/CTABanner'
import { getServices } from '@/lib/services'

// Revalida cada 30s para reflejar cambios de servicios destacados del panel
export const revalidate = 30

export default async function Home() {
  const servicios = await getServices()
  return (
    <>
      <Hero />
      <Ticker />
      <BookingStrip />
      <ServiciosDestacados servicios={servicios} />
      <PorQueElegirnos />
      <Proceso />
      <Reviews />
      <CTABanner />
    </>
  )
}
