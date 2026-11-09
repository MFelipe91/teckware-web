import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

// Par de acciones de toda la web: WhatsApp es la principal (es donde se cierra el trato) y
// Agendar la secundaria. Un solo componente para que nunca vuelvan a quedar distintos.
// En celular, el WhatsApp genérico se oculta: la barra fija inferior ya lo ofrece siempre.
// Si la página trae un mensaje propio (landings), se muestra igual, porque llega ya escrito.
export function CtaPair({
  waHref,
  centrado = false,
  children,
}: {
  waHref?: string
  /** Centra los botones (bandas de cierre con texto centrado). */
  centrado?: boolean
  /** Acción terciaria opcional (enlace), a continuación del par. */
  children?: React.ReactNode
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-3 ${centrado ? "sm:justify-center" : ""}`}>
      <a
        href={waHref ?? WA.general()}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-whatsapp w-full sm:w-auto ${waHref ? '' : 'max-sm:hidden'}`}
      >
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
