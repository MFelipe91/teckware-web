'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MessageCircle } from 'lucide-react'
import { NAV_LINKS, EMPRESA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#020307]/92 backdrop-blur-2xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      )}
    >
      {/* AMD/ROG sliding accent line — visible on scroll */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500',
          scrolled ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'linear-gradient(90deg, transparent, #E61E32 25%, #00D4FF 75%, transparent)',
        }}
      />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0" aria-label="TECKWARE inicio">
          <div className="rounded-sm overflow-hidden border border-[#00D4FF]/20 shadow-[0_0_16px_rgba(0,212,255,0.1)]">
            <Image
              src="/logo-tw.png"
              alt="TECKWARE — Soluciones Tecnológicas"
              width={116}
              height={63}
              priority
              className="block"
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-[#8B9DB5] hover:text-[#F1F5F9] rounded-sm transition-all duration-150 group"
              >
                {link.label}
                {/* ROG-style underline on hover */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#00D4FF] transition-all duration-200 group-hover:w-4/5 rounded-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={WA.general()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#00D4FF] text-[#020307] text-sm font-extrabold rounded-sm hover:bg-[#00B8D9] transition-all duration-150 min-h-[40px] shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_28px_rgba(0,212,255,0.35)] tracking-wide"
          >
            <MessageCircle size={15} strokeWidth={2.5} />
            WhatsApp
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[#8B9DB5] hover:text-[#F1F5F9] rounded-sm hover:bg-white/5 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#020307]/97 backdrop-blur-2xl border-b border-white/8">
          <ul className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#8B9DB5] hover:text-[#F1F5F9] hover:bg-white/4 rounded-sm transition-all border-l-2 border-transparent hover:border-[#00D4FF]/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4 pt-1">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#00D4FF] text-[#020307] text-sm font-extrabold rounded-sm hover:bg-[#00B8D9] transition-colors min-h-[44px] shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
