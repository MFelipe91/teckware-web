import Link from 'next/link'
import { POSTS } from '@/lib/blog'

// Las 3 guías más recientes: enlazado interno hacia el blog y señal de expertise.
const ULTIMAS = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

export function GuiasBlog() {
  return (
    <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-[76rem] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <h2 className="text-fg">Cuida tu equipo antes de que falle</h2>
          <Link href="/blog" className="btn btn-terciario self-start sm:self-auto shrink-0">Ver todas las guías</Link>
        </div>
        <ul className="border-t border-white/10">
          {ULTIMAS.map((p) => (
            <li key={p.slug} className="border-b border-white/10">
              <Link href={`/blog/${p.slug}`} className="group grid gap-2 py-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] lg:gap-10 lg:items-baseline">
                <h3 className="text-xl text-fg group-hover:text-brand-bright transition-colors">{p.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{p.description}</p>
                <span className="text-sm text-fg-subtle whitespace-nowrap">{p.minutes} min de lectura</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
