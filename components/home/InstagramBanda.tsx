import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'
import { InstagramIcon } from '@/components/shared/InstagramIcon'

// Banda de Instagram con los colores propios de la red (pedido del dueño). A la derecha, una
// tarjeta tipo perfil con datos reales de la cuenta: no se muestran fotos como si fueran posts.
export function InstagramBanda() {
  return (
    <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-10 sm:py-16" aria-labelledby="instagram-titulo">
      <div className="ig-degradado relative isolate max-w-[76rem] mx-auto overflow-hidden rounded-2xl px-6 py-9 sm:px-10 sm:py-12 lg:px-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-center">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 font-display text-lg font-bold text-white">
            <InstagramIcon size={22} />
            Instagram
          </p>
          <h2 id="instagram-titulo" className="mt-3 text-white">
            Mira nuestro trabajo en {EMPRESA.instagramHandle}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white/90">
            {EMPRESA.instagramPublicaciones} de PC gamer, mantenciones y servicio técnico. Revisa proyectos recientes antes de traer tu equipo.
          </p>
          <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-blanco mt-7 w-full sm:w-auto">
            <InstagramIcon size={18} />
            Seguir en Instagram
          </a>
        </div>

        {/* Tarjeta tipo perfil: solo datos reales de la cuenta. En celular se omite para acortar la portada. */}
        <a
          href={EMPRESA.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-perfil group max-lg:hidden"
          aria-label={`Ver el perfil ${EMPRESA.instagramHandle} en Instagram`}
        >
          <div className="flex items-center gap-4">
            <span className="ig-anillo">
              <span className="grid h-full w-full place-items-center rounded-full bg-ink-950">
                <Image src="/brand/isotipo.svg" alt="" width={40} height={46} />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block font-display text-2xl font-bold leading-tight text-white">{EMPRESA.instagramHandle}</span>
              <span className="block text-white/85">TECKWARE · Servicio técnico</span>
            </span>
          </div>
          <p className="mt-5 text-white/90 leading-relaxed">
            Mantención de PC gamer, notebooks y consolas. Armados a pedido. La Serena y Coquimbo.
          </p>
          <p className="mt-4 font-display text-lg font-bold text-white">{EMPRESA.instagramPublicaciones}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 font-display text-lg font-bold text-white">
            Ver perfil
            <ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>
    </section>
  )
}
