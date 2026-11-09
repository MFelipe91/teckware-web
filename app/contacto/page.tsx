import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, FileText, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'
import { STOCK } from '@/lib/fotos'
import { WA } from '@/lib/whatsapp'
import { HeroInterior } from '@/components/shared/HeroInterior'
import { InstagramIcon } from '@/components/shared/InstagramIcon'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contacta a TECKWARE SpA en La Serena. WhatsApp, teléfono, email e Instagram. Atención Lun–Vie 10:00–18:30.',
  alternates: { canonical: '/contacto' },
  openGraph: ogPagina('/contacto'),
}

export default function ContactoPage() {
  return (
    <div className="min-h-svh bg-ink-900">
      <HeroInterior
        antetitulo="Contacto"
        titulo={<>Hablemos de <span className="acento">tu equipo</span></>}
        bajada={`Te respondemos en horario hábil: ${EMPRESA.horario}. El canal más rápido es WhatsApp.`}
        foto={STOCK.pcGamer}
      >
        <a href={WA.general()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
          <MessageCircle size={18} aria-hidden="true" />
          Escríbenos por WhatsApp
        </a>
      </HeroInterior>

      <section className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="canales">
        <div className="max-w-[76rem] mx-auto">
          <div className="text-center">
            <p className="antetitulo">Canales de atención</p>
            <h2 id="canales" className="mt-3 text-fg">Elige cómo <span className="acento">contactarnos</span></h2>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li className="tarjeta flex flex-col p-6 border-whatsapp/40">
              <MessageCircle size={32} strokeWidth={1.6} className="text-whatsapp" aria-hidden="true" />
              <h3 className="mt-4 text-fg">WhatsApp</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">Precios, dudas y coordinación de tu hora en el taller. El canal principal.</p>
              <a href={WA.general()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-auto w-full">
                <MessageCircle size={18} aria-hidden="true" />
                Escribir
              </a>
            </li>
            <li className="tarjeta flex flex-col p-6">
              <Phone size={32} strokeWidth={1.6} className="text-cian" aria-hidden="true" />
              <h3 className="mt-4 text-fg">Teléfono</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">Para llamarnos en horario de atención.</p>
              <a href={EMPRESA.telefonoHref} className="btn btn-secundario mt-auto w-full">{EMPRESA.telefono}</a>
            </li>
            <li className="tarjeta flex flex-col p-6">
              <Mail size={32} strokeWidth={1.6} className="text-cian" aria-hidden="true" />
              <h3 className="mt-4 text-fg">Email</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">Consultas detalladas o presupuestos para empresas por escrito.</p>
              <a href={`mailto:${EMPRESA.email}`} className="btn btn-secundario mt-auto w-full">Enviar email</a>
            </li>
            <li className="tarjeta flex flex-col p-6 border-ig-magenta/40">
              <InstagramIcon size={32} className="text-ig-rosa" />
              <h3 className="mt-4 text-fg">Instagram</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">Nuestro trabajo y proyectos recientes. {EMPRESA.instagramHandle}</p>
              <a href={EMPRESA.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-instagram mt-auto w-full">
                <InstagramIcon size={18} />
                Seguir
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-ink-950 border-y border-white/10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-[76rem] mx-auto grid gap-4 lg:grid-cols-2">
          <div className="tarjeta p-6 sm:p-8">
            <h2 className="text-3xl text-fg">Zona de atención</h2>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-fg-muted">
                <MapPin size={22} className="text-brand-bright shrink-0 mt-0.5" aria-hidden="true" />
                <span>{EMPRESA.modalidad}</span>
              </li>
              <li className="flex items-start gap-3 text-fg-muted">
                <Clock size={22} className="text-brand-bright shrink-0 mt-0.5" aria-hidden="true" />
                <span>{EMPRESA.horario}. Atendemos La Serena y Coquimbo.</span>
              </li>
            </ul>
            <p className="mt-5 text-sm text-fg-subtle leading-relaxed">{EMPRESA.domicilioNota}</p>
          </div>
          <div className="tarjeta p-6 sm:p-8 border-brand-bright/40">
            <FileText size={32} strokeWidth={1.6} className="text-cian" aria-hidden="true" />
            <h2 className="mt-4 text-3xl text-fg">¿Prefieres un formulario?</h2>
            <p className="mt-3 text-fg-muted leading-relaxed">Completa tus datos y te dejamos el mensaje de WhatsApp listo para enviar, o agenda tu servicio paso a paso.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/agendar" className="btn btn-cian w-full sm:w-auto">Agendar servicio</Link>
              <Link href="/solicitar" className="btn btn-secundario w-full sm:w-auto">Ir al formulario</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
