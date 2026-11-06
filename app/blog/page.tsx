import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS } from '@/lib/blog'
import { PageHeader } from '@/components/shared/PageHeader'
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

export default function BlogPage() {
  return (
    <div className="min-h-svh bg-ink-900">
      <PageHeader
        titulo="Guías de mantención"
        bajada="Consejos prácticos para que tu PC, notebook o consola rinda más y dure más. Escritos desde el taller, en La Serena."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-24">
        <ul className="border-t border-white/10">
          {POSTS.map((p) => (
            <li key={p.slug} className="border-b border-white/10">
              <Link
                href={`/blog/${p.slug}`}
                className="group grid gap-2 py-7 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)_auto] lg:gap-10 lg:items-baseline"
              >
                <h2 className="text-2xl sm:text-3xl font-semibold text-fg group-hover:text-brand-bright transition-colors">{p.title}</h2>
                <p className="text-fg-muted leading-relaxed">{p.description}</p>
                <span className="text-sm text-fg-subtle lg:text-right whitespace-nowrap">
                  <time dateTime={p.date} className="block">{fecha(p.date)}</time>
                  {p.minutes} min de lectura
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
