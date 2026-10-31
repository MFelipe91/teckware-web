import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { POSTS } from '@/lib/blog'

export const metadata: Metadata = {
  title: { absolute: 'Guías de Mantención de PC, Notebooks y Consolas | Blog TECKWARE' },
  description:
    'Guías prácticas de mantención preventiva de PC gamer, notebooks, PS5 y equipos de empresa, escritas por el equipo técnico de TECKWARE en La Serena.',
  alternates: { canonical: '/blog' },
}

const fecha = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ink-900 pt-24">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] uppercase text-brand-bright border border-brand-bright/20 rounded-xl bg-brand/6">
          Blog
        </span>
        <h1 className="text-fg mb-4">Guías de mantención</h1>
        <p className="text-fg-muted max-w-xl mx-auto">
          Consejos prácticos para que tu PC, notebook o consola rinda más y dure más. Escritos desde el taller, en La Serena.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {POSTS.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex flex-col h-full glass-card rounded-xl p-7 border border-white/8 card-hover"
              >
                <div className="flex items-center gap-3 mb-3 text-xs text-fg-subtle">
                  <time dateTime={p.date}>{fecha(p.date)}</time>
                  <span className="flex items-center gap-1"><Clock size={12} />{p.minutes} min</span>
                </div>
                <h2 className="text-lg font-bold text-fg mb-3 leading-snug">{p.title}</h2>
                <p className="text-sm text-fg-muted leading-relaxed mb-5">{p.description}</p>
                <span className="mt-auto flex items-center gap-2 text-sm font-semibold text-brand-bright">
                  Leer guía
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
