'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, MessageCircle } from 'lucide-react'
import { EMPRESA, NAV_LINKS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { InstagramIcon } from '@/components/shared/InstagramIcon'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink-950 border-b border-white/8 pt-[env(safe-area-inset-top)]">
      <nav aria-label="Principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 xl:gap-6">
        <Link href="/" className="shrink-0 flex items-center min-h-11" aria-label="TECKWARE inicio">
          <Image
            src="/brand/logo-horizontal.webp"
            alt="TECKWARE"
            width={208}
            height={40}
            priority
            className="block h-9 sm:h-10 lg:h-8 xl:h-10"
            style={{ width: 'auto' }}
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-5 xl:gap-7 ml-auto">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`py-2 text-[15px] whitespace-nowrap transition-colors hover:text-fg ${
                  pathname === link.href ? 'text-fg shadow-[inset_0_-1.5px_0_var(--color-brand-bright)]' : 'text-fg-muted'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href={EMPRESA.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram de TECKWARE: ${EMPRESA.instagramHandle}`}
          className="ml-auto lg:ml-0 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-fg-muted hover:text-fg transition-colors"
        >
          <InstagramIcon size={21} />
        </a>

        <a href={WA.general()} target="_blank" rel="noopener noreferrer" className="btn btn-primario hidden lg:inline-flex whitespace-nowrap">
          <MessageCircle size={17} aria-hidden="true" />
          WhatsApp
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-fg-muted hover:text-fg min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="menu-movil lg:hidden bg-ink-950 border-t border-white/8 px-4 pb-5">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-white/8">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`block py-3.5 font-display text-lg font-medium ${pathname === link.href ? 'text-fg' : 'text-fg-muted'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={WA.general()} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full mt-5">
            <MessageCircle size={17} aria-hidden="true" />
            Escríbenos por WhatsApp
          </a>
          <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-secundario w-full mt-3">
            <InstagramIcon size={17} />
            Síguenos en Instagram
          </a>
        </div>
      )}
    </header>
  )
}
