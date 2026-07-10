import { Hero } from '@/components/home/Hero'
import { Ticker } from '@/components/home/Ticker'
import { ServiciosDestacados } from '@/components/home/ServiciosDestacados'
import { PorQueElegirnos } from '@/components/home/PorQueElegirnos'
import { Proceso } from '@/components/home/Proceso'
import { Reviews } from '@/components/home/Reviews'
import { CTABanner } from '@/components/home/CTABanner'

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <ServiciosDestacados />
      <PorQueElegirnos />
      <Proceso />
      <Reviews />
      <CTABanner />
    </>
  )
}
