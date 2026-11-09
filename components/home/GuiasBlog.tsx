import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { POSTS } from '@/lib/blog'
import { FOTO_BLOG, STOCK } from '@/lib/fotos'

// Las 3 guías más recientes: enlazado interno hacia el blog y señal de expertise.
const ULTIMAS = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

const fecha = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })

export function GuiasBlog() {
  return (
    <section className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="blog-titulo">
      <div className="max-w-[76rem] mx-auto grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:items-center">
        <div>
          <p className="antetitulo">Blog TECKWARE</p>
          <h2 id="blog-titulo" className="mt-3 text-fg">
            Aprende, cuida y <span className="acento">optimiza</span> tu equipo
          </h2>
          <Link href="/blog" className="btn btn-secundario mt-6 w-full sm:w-auto">
            Ver todas las guías <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {/* En celular las guías se deslizan de lado. */}
        <ul className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
          {ULTIMAS.map((p) => {
            const foto = FOTO_BLOG[p.slug] ?? STOCK.placa
            return (
              <li key={p.slug} className="shrink-0 basis-[82%] snap-start sm:basis-auto">
                <Link href={`/blog/${p.slug}`} className="tarjeta tarjeta-enlace group flex h-full flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 640px) 25vw, 82vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-sm text-fg-subtle">
                      <time dateTime={p.date}>{fecha(p.date)}</time> · {p.minutes} min de lectura
                    </span>
                    <h3 className="mt-2 text-xl text-fg group-hover:text-brand-bright transition-colors">{p.title}</h3>
                    <span className="mt-auto pt-3 inline-flex items-center gap-1.5 font-display font-bold text-brand-bright">
                      Leer guía <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
