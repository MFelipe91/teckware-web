import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Clock, Phone } from 'lucide-react'
import { InstagramIcon } from '@/components/shared/InstagramIcon'
import { EMPRESA, NAV_LINKS, SERVICIOS } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#03040A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Columna 1 — Marca */}
          <div className="space-y-4">
            <Link href="/" aria-label="TECKWARE inicio">
              <div className="rounded-sm overflow-hidden border border-[#00D4FF]/15 shadow-[0_0_12px_rgba(0,212,255,0.06)] inline-block">
                <Image src="/logo-tw.png" alt="TECKWARE" width={120} height={65} className="block" />
              </div>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {EMPRESA.tagline}
            </p>
            <p className="text-xs text-[#475569]">RUT {EMPRESA.rut}</p>
            <div className="flex gap-3">
              <a
                href={EMPRESA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#475569] hover:text-[#00D4FF] transition-colors"
                aria-label="Instagram TECKWARE"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2 — Navegación */}
          <div>
            <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Navegación</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/solicitar" className="text-sm text-[#00D4FF] hover:text-[#00A8CC] font-medium transition-colors">
                  Solicitar servicio →
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 — Servicios */}
          <div>
            <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Servicios</h3>
            <ul className="space-y-2">
              {SERVICIOS.map((s) => (
                <li key={s.id}>
                  <a
                    href={WA.servicio(s.nombre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
                  >
                    {s.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 — Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-[#F1F5F9] mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#94A3B8]">
                <MapPin size={15} className="text-[#00D4FF] mt-0.5 shrink-0" />
                <span>{EMPRESA.direccion}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <Clock size={15} className="text-[#00D4FF] shrink-0" />
                <span>{EMPRESA.horario}</span>
              </li>
              <li>
                <a
                  href={`mailto:${EMPRESA.email}`}
                  className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
                >
                  <Mail size={15} className="text-[#00D4FF] shrink-0" />
                  {EMPRESA.email}
                </a>
              </li>
              <li>
                <a
                  href={WA.general()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#00D4FF] transition-colors"
                >
                  <Phone size={15} className="text-[#00D4FF] shrink-0" />
                  {EMPRESA.telefono}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#475569]">
            © {year} TECKWARE SpA. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="text-xs text-[#475569] hover:text-[#94A3B8] transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-[#475569] hover:text-[#94A3B8] transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
