import Link from 'next/link'
import { MessageCircle, CalendarCheck } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

// Par de acciones de toda la web: WhatsApp es la principal (es donde se cierra el trato) y
// Agendar la secundaria. Un solo componente para que nunca vuelvan a quedar distintos.
export function CtaPair({
  waHref = WA.general(),
  align = 'center',
}: {
  waHref?: string
  align?: 'center' | 'start'
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${align === 'center' ? 'items-center justify-center' : ''}`}>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors min-h-[52px]"
      >
        <MessageCircle size={19} aria-hidden="true" />
        Escríbenos por WhatsApp
      </a>
      <Link
        href="/agendar"
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-6 py-4 rounded-xl border border-silver/30 text-fg font-semibold hover:border-silver/60 hover:bg-white/5 transition-colors min-h-[52px]"
      >
        <CalendarCheck size={18} aria-hidden="true" />
        Agendar servicio
      </Link>
    </div>
  )
}
