import type { Metadata } from 'next'

// page.tsx es 'use client' y no puede exportar metadata; va aquí.
export const metadata: Metadata = {
  title: 'Solicitar Servicio',
  description:
    'Cuéntanos qué necesita tu equipo y te respondemos por WhatsApp. Servicio técnico de computadores, notebooks y consolas en La Serena.',
  alternates: { canonical: '/solicitar' },
}

export default function SolicitarLayout({ children }: { children: React.ReactNode }) {
  return children
}
