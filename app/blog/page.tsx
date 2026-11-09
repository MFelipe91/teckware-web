import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { POSTS } from '@/lib/blog'
import { FOTO_BLOG, STOCK } from '@/lib/fotos'
import { HeroInterior } from '@/components/shared/HeroInterior'
import { BandaCta } from '@/components/shared/BandaCta'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  title: { absolute: 'Guías de Mantención de PC y Consolas | Blog TECKWARE' },
  description:
    'Guías prácticas de mantención preventiva de PC gamer, notebooks, PS5 y equipos de empresa, escritas por el equipo técnico de TECKWARE en La Serena.',
  alternates: { canonical: '/blog' },
  openGraph: ogPagina('/blog'),
}

const fecha = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

const ORDENADOS = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))

export default function BlogPage() {
  const [destacado, ...resto] = ORDENADOS
  return (
    <div className="min-h-svh bg-ink-900">
      <HeroInterior
        antetitulo="Blog TECKWARE"
        titulo={<>Guías de <span className="acento">mantención</span></>}
        bajada="Consejos prácticos para que tu PC, notebook o consola rinda más y dure más. Escritos desde el taller, en La Serena."
        foto={STOCK.formateo}
      />

      <section className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-label="Guías">
        <div className="max-w-[76rem] mx-auto">
          {destacado && (
            <Link href={`/blog/${destacado.slug}`} className="tarjeta tarjeta-enlace group grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[20rem] overflow-hidden">
                <Image src={(FOTO_BLOG[destacado.slug] ?? STOCK.placa).src} alt={(FOTO_BLOG[destacado.slug] ?? STOCK.placa).alt} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="antetitulo">Guía destacada</p>
                <h2 className="mt-3 text-3xl sm:text-4xl text-fg group-hover:text-brand-bright transition-colors">{destacado.title}</h2>
                <p className="mt-4 text-fg-muted leading-relaxed">{destacado.description}</p>
                <span className="mt-4 text-sm text-fg-subtle">
                  <time dateTime={destacado.date}>{fecha(destacado.date)}</time> · {destacado.minutes} min de lectura
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 font-display font-bold text-brand-bright">
                  Leer guía <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resto.map((p) => {
              const foto = FOTO_BLOG[p.slug] ?? STOCK.placa
              return (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="tarjeta tarjeta-enlace group flex h-full flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-sm text-fg-subtle">
                        <time dateTime={p.date}>{fecha(p.date)}</time> · {p.minutes} min de lectura
                      </span>
                      <h2 className="mt-2 text-2xl text-fg group-hover:text-brand-bright transition-colors">{p.title}</h2>
                      <p className="mt-2 text-sm text-fg-muted leading-relaxed">{p.description}</p>
                      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-display font-bold text-brand-bright">
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

      <BandaCta
        titulo="¿Prefieres que lo revisemos nosotros?"
        texto="Diagnóstico claro antes de cualquier trabajo, informe técnico y 30 días de garantía. Atendemos en La Serena y Coquimbo."
      />
    </div>
  )
}
