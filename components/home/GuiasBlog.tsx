import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { POSTS } from '@/lib/blog'

// Las 3 guías más recientes: enlazado interno hacia el blog y señal de expertise.
const ULTIMAS = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

export function GuiasBlog() {
  return (
    <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-bright">Guías de prevención</p>
            <h2 className="mt-3 text-fg">Cuida tu equipo antes de que falle</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-bright hover:text-fg transition-colors">
            Ver todas las guías
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ULTIMAS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex flex-col h-full p-6 rounded-xl glass-card card-hover"
              >
                <h3 className="text-lg font-semibold text-fg leading-snug">{p.title}</h3>
                <p className="mt-3 text-sm text-fg-muted leading-relaxed flex-1">{p.description}</p>
                <span className="mt-5 flex items-center justify-between text-xs text-fg-subtle">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} aria-hidden="true" />
                    {p.minutes} min de lectura
                  </span>
                  <ArrowRight size={15} className="text-brand-bright transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
