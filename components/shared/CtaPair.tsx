import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

// Par de acciones de toda la web: WhatsApp es la principal (es donde se cierra el trato) y
// Agendar la secundaria. Un solo componente para que nunca vuelvan a quedar distintos.
export function CtaPair({
  waHref = WA.general(),
  children,
}: {
  waHref?: string
  /** Acción terciaria opcional (enlace), a continuación del par. */
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-3">
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full sm:w-auto">
        <MessageCircle size={18} aria-hidden="true" />
        Escríbenos por WhatsApp
      </a>
      <Link href="/agendar" className="btn btn-secundario w-full sm:w-auto">
        Agendar servicio
      </Link>
      {children}
    </div>
  )
}
