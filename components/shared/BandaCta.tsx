import { CtaPair } from '@/components/shared/CtaPair'
import { InstagramIcon } from '@/components/shared/InstagramIcon'
import { EMPRESA } from '@/lib/constants'

// Cierre de cada página: el único cambio fuerte de superficie del sitio. Composición centrada:
// el título manda, debajo la bajada, las dos acciones y los datos de contacto en una línea.
export function BandaCta({
  titulo,
  texto,
  waHref,
  nota,
}: {
  titulo: string
  texto: string
  waHref?: string
  nota?: string
}) {
  return (
    <section className="banda-plata px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-ink-900 text-[clamp(2.25rem,4.6vw,3.75rem)]">{titulo}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-800">{texto}</p>
        <div className="mt-8">
          <CtaPair waHref={waHref} centrado />
        </div>
        {nota && <p className="mx-auto mt-7 max-w-2xl text-sm text-ink-700">{nota}</p>}
        <a
          href={EMPRESA.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-instagram ${nota ? 'mt-4' : 'mt-6'}`}
        >
          <InstagramIcon size={18} />
          Mira nuestro trabajo en {EMPRESA.instagramHandle}
        </a>
      </div>
    </section>
  )
}
