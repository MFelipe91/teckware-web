import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CtaPair } from '@/components/shared/CtaPair'

// Next ya agrega noindex a las respuestas 404.
export const metadata: Metadata = {
  title: 'Página no encontrada',
}

const ENLACES = [
  { href: '/mantencion', label: 'Mantención de computadores' },
  { href: '/servicios', label: 'Servicios y precios' },
  { href: '/blog', label: 'Guías de mantención' },
]

export default function NotFound() {
  return (
    <div className="bg-ink-950 px-4 sm:px-6 lg:px-8 pt-40 pb-24">
      <div className="max-w-2xl mx-auto text-center">
        <p className="mb-4 font-display text-sm font-semibold tracking-widest text-brand-bright">ERROR 404</p>
        <h1 className="text-fg mb-4">Esta página no existe</h1>
        <p className="text-fg-muted mb-8">
          Puede que el enlace esté mal escrito o que la página se haya movido. Vuelve al inicio o
          escríbenos y te ayudamos directamente.
        </p>
        <CtaPair />
        <ul className="mt-12 space-y-2">
          <li>
            <Link href="/" className="inline-flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand-bright transition-colors">
              Volver al inicio
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </li>
          {ENLACES.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex items-center gap-2 py-1 text-sm text-fg-muted hover:text-brand-bright transition-colors">
                {l.label}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
