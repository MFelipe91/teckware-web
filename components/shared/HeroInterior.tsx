import Image from 'next/image'
import type { Foto } from '@/lib/fotos'

// Cabecera de páginas internas en la dirección Gaming Premium: misma lógica que el hero de la
// portada (foto que se funde con el fondo), pero más baja. El H1 llega visible en el HTML.
export function HeroInterior({
  antetitulo,
  titulo,
  bajada,
  foto,
  children,
}: {
  antetitulo: string
  titulo: React.ReactNode
  bajada: string
  foto: Foto
  children?: React.ReactNode
}) {
  return (
    <section className="hero-premium hero-interior relative isolate overflow-hidden bg-ink-950">
      <div className="hero-foto-marco" aria-hidden="true">
        <Image
          src={foto.src}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          quality={70}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="relative max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-10 lg:mt-0 lg:pt-36 lg:pb-20">
        <div className="hero-texto max-w-[44rem]">
          <p className="antetitulo">{antetitulo}</p>
          <h1 className="mt-4 text-[clamp(2.125rem,4.4vw,4.25rem)]">{titulo}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">{bajada}</p>
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
