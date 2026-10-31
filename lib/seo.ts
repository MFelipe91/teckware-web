import type { Metadata } from 'next'

// El openGraph de una página reemplaza por completo al de layout.tsx, así que se repiten aquí
// los datos del sitio. Título y descripción los completa Next desde la metadata de cada página.
export function ogPagina(path: string): Metadata['openGraph'] {
  return {
    type: 'website',
    locale: 'es_CL',
    siteName: 'TECKWARE SpA',
    url: path,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TECKWARE SpA: mantención y servicio técnico en La Serena y Coquimbo',
      },
    ],
  }
}
