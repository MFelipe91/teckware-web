import { MessageCircle } from 'lucide-react'
import { WA } from '@/lib/whatsapp'

export function WhatsAppFloat() {
  return (
    <a
      href={WA.general()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#22C55E] rounded-full shadow-lg shadow-green-900/30 wa-pulse hover:scale-110 transition-transform duration-200"
    >
      <MessageCircle size={26} strokeWidth={2} className="text-white" />
    </a>
  )
}
