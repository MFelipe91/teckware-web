import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { EMPRESA } from '@/lib/constants'
import { WA } from '@/lib/whatsapp'
import { PageHeader } from '@/components/shared/PageHeader'
import { ogPagina } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contacta a TECKWARE SpA en La Serena. WhatsApp, teléfono, email e Instagram. Atención Lun–Vie 10:00–18:30.',
  alternates: { canonical: '/contacto' },
  openGraph: ogPagina('/contacto'),
}

const CANALES = [
  { canal: 'Teléfono', detalle: 'Para llamarnos en horario de atención.', valor: EMPRESA.telefono, href: EMPRESA.telefonoHref, externo: false },
  { canal: 'Email', detalle: 'Para consultas detalladas o presupuestos por escrito.', valor: EMPRESA.email, href: `mailto:${EMPRESA.email}`, externo: false },
  { canal: 'Instagram', detalle: 'Nuestro trabajo y proyectos recientes.', valor: EMPRESA.instagramHandle, href: EMPRESA.instagram, externo: true },
]

export default function ContactoPage() {
  return (
    <div className="min-h-svh bg-ink-900">
      <PageHeader
        titulo="Contacto"
        bajada={`Te respondemos en horario hábil: ${EMPRESA.horario}. El canal principal es WhatsApp.`}
      >
        <a href={WA.general()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
          <MessageCircle size={18} aria-hidden="true" />
          Escríbenos por WhatsApp
        </a>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid gap-12 lg:gap-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <section aria-label="Canales de contacto">
          <ul className="border-t border-white/10">
            {CANALES.map((c) => (
              <li key={c.canal} className="py-5 border-b border-white/10">
                <h2 className="text-xl text-fg">{c.canal}</h2>
                <p className="mt-1 mb-2 text-sm text-fg-muted">{c.detalle}</p>
                <a
                  href={c.href}
                  {...(c.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="btn btn-terciario"
                >
                  {c.valor}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel-corte p-7 sm:p-8 self-start">
          <h2 className="text-2xl text-fg">Zona de atención</h2>
          <p className="mt-3 text-fg-muted leading-relaxed">{EMPRESA.modalidad}</p>
          <p className="mt-3 text-sm text-fg-subtle leading-relaxed">{EMPRESA.domicilioNota}</p>
          <h2 className="mt-7 text-2xl text-fg">¿Prefieres un formulario?</h2>
          <p className="mt-3 mb-4 text-fg-muted leading-relaxed">Completa tus datos y te dejamos el mensaje de WhatsApp listo para enviar.</p>
          <Link href="/solicitar" className="btn btn-terciario">Ir al formulario</Link>
        </section>
      </div>
    </div>
  )
}
