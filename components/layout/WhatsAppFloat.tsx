import { MessageCircle } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

export function WhatsAppFloat() {
  return (
    <a
      href={WA.general()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fab fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-whatsapp-solid hover:bg-whatsapp-hover transition-colors"
    >
      <MessageCircle size={24} className="text-white" aria-hidden="true" />
    </a>
  )
}
