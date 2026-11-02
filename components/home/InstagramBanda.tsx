import Image from 'next/image'
import { EMPRESA } from '@/lib/constants'
import { InstagramIcon } from '@/components/shared/InstagramIcon'

// Banda de Instagram: el nombre de la cuenta es la pieza grande, porque es lo que hay que recordar.
// Las fotos son decorativas y van teñidas: no se presentan como publicaciones de la cuenta.
export function InstagramBanda() {
  return (
    <section className="banda-azul px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-16" aria-labelledby="instagram-titulo">
      <div className="max-w-[76rem] mx-auto grid gap-10 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center">
        <div className="min-w-0">
          <h2 id="instagram-titulo" className="text-fg">Síguenos en Instagram</h2>
          <a
            href={EMPRESA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-cuenta"
            aria-label={`Abrir ${EMPRESA.instagramHandle} en Instagram`}
          >
            {EMPRESA.instagramHandle}
          </a>
          <p className="mt-4 max-w-xl leading-relaxed text-fg">
            {EMPRESA.instagramPublicaciones} de PC gamer y servicio técnico. Mira nuestro trabajo y proyectos recientes antes de traer tu equipo.
          </p>
          <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-oscuro mt-6 w-full sm:w-auto">
            <InstagramIcon size={18} />
            Seguir en Instagram
          </a>
        </div>

        <div className="ig-panal" aria-hidden="true">
          <div className="ig-celda ig-celda-a">
            <Image src="/images/revendo-TN0dhAnylPI-unsplash.jpg" alt="" fill sizes="(min-width: 1024px) 180px, 50vw" quality={60} className="ig-foto" style={{ objectPosition: '55% 55%' }} />
          </div>
          <div className="ig-celda ig-celda-b">
            <InstagramIcon size={56} className="text-fg" />
          </div>
          <div className="ig-celda ig-celda-c">
            <Image src="/images/upgraderamssd.jpg" alt="" fill sizes="(min-width: 1024px) 180px, 50vw" quality={60} className="ig-foto" />
          </div>
        </div>
      </div>
    </section>
  )
}
