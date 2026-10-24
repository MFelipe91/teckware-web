import type { Metadata } from 'next'

// page.tsx es 'use client' y no puede exportar metadata; va aquí.
export const metadata: Metadata = {
  title: 'Agendar Servicio Técnico',
  description:
    'Agenda tu servicio técnico en La Serena y Coquimbo: diagnóstico, mantención, formateo, PC Gamer y consolas. Te confirmamos por WhatsApp en menos de 2 horas.',
  alternates: { canonical: '/agendar' },
}

export default function AgendarLayout({ children }: { children: React.ReactNode }) {
  return children
}
