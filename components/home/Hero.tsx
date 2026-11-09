import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { STOCK } from '@/lib/fotos'

// Server Component. Dirección "Gaming Premium" (maqueta B): foto protagonista a la derecha que se
// funde con el fondo, y el título local a la izquierda. El H1 mantiene la frase que posiciona en
// Google; el lema de la maqueta va como bajada.
export function Hero() {
  return (
    <section className="hero-premium relative isolate overflow-hidden bg-ink-950" aria-label="Inicio">
      {/* Foto: en celular arriba (recorte horizontal); desde lg ocupa la mitad derecha. */}
      <div className="hero-foto-marco" aria-hidden="true">
        <Image
          src={STOCK.hero.src}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          quality={70}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[60%_50%]"
        />
      </div>

      <div className="relative max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-10 lg:mt-0 lg:pt-36 lg:pb-28">
        <div className="hero-texto max-w-[46rem]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-ink-950/70 px-3.5 py-1.5 text-sm text-fg-muted backdrop-blur">
            <MapPin size={16} className="text-brand-bright" aria-hidden="true" />
            La Serena · Región de Coquimbo
          </p>

          <h1 className="mt-5 lg:text-[clamp(3.5rem,5.2vw,5rem)]">
            Mantención y servicio técnico de <span className="acento">computadores</span> en La Serena y Coquimbo
          </h1>

          <p className="mt-5 font-display text-2xl sm:text-[1.75rem] font-semibold leading-tight text-fg">
            Tu tecnología merece un servicio de otro nivel.
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-fg-muted">
            PC gamer, notebooks, MacBook y consolas. Te decimos qué tiene tu equipo, cuánto cuesta y cómo evitar que vuelva a fallar.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/agendar" className="btn btn-cian w-full sm:w-auto">
              <CalendarDays size={20} aria-hidden="true" />
              Agendar mi servicio
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#servicios" className="btn btn-secundario w-full sm:w-auto">
              Ver servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
