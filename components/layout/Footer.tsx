import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Mail, MapPin, Clock, Phone } from 'lucide-react'
import { InstagramIcon } from '@/components/shared/InstagramIcon'
import { EMPRESA, NAV_LINKS } from '@/lib/constants'
import { LANDINGS } from '@/lib/landings'

type Enlace = { href: string; label: string; destacado?: boolean }

const NAVEGACION: Enlace[] = [
  ...NAV_LINKS,
  { href: '/web-qa', label: 'Web & QA' },
  { href: '/ciberseguridad', label: 'Ciberseguridad' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/solicitar', label: 'Solicitar servicio', destacado: true },
]
const SERVICIOS: Enlace[] = [...LANDINGS]

const TITULO = 'font-display text-base font-semibold text-silver'

function ListaEnlaces({ enlaces }: { enlaces: Enlace[] }) {
  return (
    <ul>
      {enlaces.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className={`flex min-h-11 items-center text-sm transition-colors hover:text-brand-bright active:text-brand-bright ${
              l.destacado ? 'text-brand-bright font-medium' : 'text-fg-muted'
            }`}
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

// En celular las dos listas largas van plegadas: el pie pasa de ~2 pantallas a menos de una.
// Desde sm se ven abiertas en columnas, como siempre. Los enlaces están en el HTML en ambos casos.
function GrupoPlegable({ titulo, enlaces }: { titulo: string; enlaces: Enlace[] }) {
  return (
    <>
      <details className="group border-b border-white/10 sm:hidden">
        <summary className={`${TITULO} flex min-h-14 cursor-pointer list-none items-center justify-between gap-4`}>
          {titulo}
          <ChevronDown size={18} aria-hidden="true" className="text-fg-subtle transition-transform group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <div className="pb-3">
          <ListaEnlaces enlaces={enlaces} />
        </div>
      </details>
      <div className="hidden sm:block">
        <h2 className={`${TITULO} mb-2`}>{titulo}</h2>
        <ListaEnlaces enlaces={enlaces} />
      </div>
    </>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-950 border-t border-white/10 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Marca */}
          <div className="space-y-4">
            <Link href="/" aria-label="TECKWARE inicio" className="block w-fit">
              <Image
                src="/brand/logo-stack.webp"
                alt="TECKWARE — Soluciones Tecnológicas"
                width={160}
                height={166}
                className="block w-28 sm:w-40 h-auto"
              />
            </Link>
            <p className="text-sm text-fg-muted leading-relaxed">
              {EMPRESA.tagline}
            </p>
            <p className="meta-chica text-fg-subtle">RUT {EMPRESA.rut}</p>
            <a
              href={EMPRESA.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secundario"
              aria-label={`Seguir a ${EMPRESA.instagramHandle} en Instagram`}
            >
              <InstagramIcon size={18} />
              {EMPRESA.instagramHandle}
            </a>
          </div>

          {/* Contacto: en celular va antes de las listas, que van plegadas */}
          <div className="lg:order-last">
            <h2 className={`${TITULO} mb-2`}>Contacto</h2>
            <ul>
              <li className="flex items-start gap-2 py-2.5 text-sm text-fg-muted">
                <MapPin size={15} className="text-brand-bright mt-1 shrink-0" />
                <span>{EMPRESA.direccion}</span>
              </li>
              <li className="flex items-center gap-2 py-2.5 text-sm text-fg-muted">
                <Clock size={15} className="text-brand-bright shrink-0" />
                <span>{EMPRESA.horario}</span>
              </li>
              <li>
                <a
                  href={`mailto:${EMPRESA.email}`}
                  className="flex min-h-11 items-center gap-2 text-sm text-fg-muted hover:text-brand-bright active:text-brand-bright transition-colors"
                >
                  <Mail size={15} className="text-brand-bright shrink-0" />
                  {EMPRESA.email}
                </a>
              </li>
              <li>
                <a
                  href={EMPRESA.telefonoHref}
                  className="flex min-h-11 items-center gap-2 text-sm text-fg-muted hover:text-brand-bright active:text-brand-bright transition-colors"
                >
                  <Phone size={15} className="text-brand-bright shrink-0" />
                  {EMPRESA.telefono}
                </a>
              </li>
            </ul>
          </div>

          <div className="border-t border-white/10 sm:border-0">
            <GrupoPlegable titulo="Navegación" enlaces={NAVEGACION} />
          </div>
          <div className="-mt-8 sm:mt-0">
            <GrupoPlegable titulo="Servicios" enlaces={SERVICIOS} />
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <p className="meta-chica text-fg-subtle">
            © {year} TECKWARE SpA. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="inline-flex min-h-11 items-center meta-chica text-fg-subtle hover:text-fg-muted transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="inline-flex min-h-11 items-center meta-chica text-fg-subtle hover:text-fg-muted transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
