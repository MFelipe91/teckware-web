import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaPair } from '@/components/shared/CtaPair'

// Next ya agrega noindex a las respuestas 404.
export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'Esta página de TECKWARE no existe. Vuelve al inicio o revisa nuestros servicios de mantención y servicio técnico.',
}

const ENLACES = [
  { href: '/', label: 'Inicio' },
  { href: '/mantencion', label: 'Mantención de computadores' },
  { href: '/servicios', label: 'Servicios y precios' },
  { href: '/blog', label: 'Guías de mantención' },
]

export default function NotFound() {
  return (
    <div className="bg-ink-950 px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <div className="max-w-[76rem] mx-auto">
        <p className="etiqueta">Error 404</p>
        <h1 className="max-w-3xl">Esta página no existe</h1>
        <p className="mt-6 mb-8 max-w-xl text-lg text-fg-muted leading-relaxed">
          Puede que el enlace esté mal escrito o que la página se haya movido. Vuelve al inicio o
          escríbenos y te ayudamos directamente.
        </p>
        <CtaPair />
        <ul className="mt-12 max-w-md border-t border-white/10">
          {ENLACES.map((l) => (
            <li key={l.href} className="border-b border-white/10">
              <Link href={l.href} className="block py-3 text-fg-muted hover:text-brand-bright transition-colors">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
