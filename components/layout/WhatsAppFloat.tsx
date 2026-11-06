import { MessageCircle } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

// Desde lg el navbar ya muestra WhatsApp fijo arriba: el botón flotante sobra y tapaba precios.
export function WhatsAppFloat() {
  return (
    <a
      href={WA.general()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fab fixed z-50 flex items-center justify-center gap-2.5 bottom-0 left-0 right-14 h-[calc(3.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] font-display font-semibold text-white bg-whatsapp-solid hover:bg-whatsapp-hover sm:left-auto sm:bottom-6 sm:right-6 sm:w-14 sm:h-14 sm:pb-0 lg:hidden"
    >
      <MessageCircle size={22} aria-hidden="true" />
      <span className="sm:hidden">Escríbenos por WhatsApp</span>
    </a>
  )
}
