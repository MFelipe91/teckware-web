import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, Saira } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { ChatWidget } from '@/components/layout/ChatWidget'
import { Analytics } from '@/components/layout/Analytics'
import { businessLd } from '@/lib/structured-data'
import { SITE_URL } from '@/lib/site'

// Código de la etiqueta HTML de Search Console (solo si se verifica por "Prefijo de URL").
// Con verificación por DNS (propiedad de Dominio, vía Cloudflare) no hace falta.
const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex',
})

// Titulares, botones y precios: técnica y levemente condensada, combina con el logo.
const saira = Saira({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-saira',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mantención PC Gamer, Notebooks y PS5 en La Serena | TECKWARE',
    template: '%s | TECKWARE',
  },
  description:
    'Mantención de PC gamer, notebooks y PS5 y armado de PC en La Serena y Coquimbo. Informe técnico, boleta y garantía de 30 días.',
  keywords: [
    // Servicio técnico local
    'servicio técnico La Serena',
    'servicio técnico computadores La Serena',
    'reparación notebook La Serena',
    'reparación computador La Serena',
    'técnico computadores La Serena',
    'mantención PC La Serena',
    'técnico informático La Serena',
    'servicio técnico Coquimbo',
    'reparación MacBook La Serena',
    // Gaming
    'PC Gamer La Serena',
    'PC Gaming La Serena',
    'armado PC Gamer La Serena',
    'PC Gamer Chile',
    'computador gamer La Serena',
    'gaming La Serena',
    'gamer Chile',
    // Hardware
    'RTX La Serena',
    'RTX 4070 La Serena',
    'RTX 4090 La Serena',
    'NVIDIA La Serena',
    'AMD Ryzen La Serena',
    'Ryzen La Serena',
    'Intel La Serena',
    'hardware gaming Chile',
    'hardware computacional La Serena',
    'upgrade PC La Serena',
    'upgrade GPU La Serena',
    'procesador Ryzen La Serena',
    'entusiastas gaming Chile',
    // Servicios
    'mantenimiento PC gamer La Serena',
    'formateo PC La Serena',
    'ciberseguridad empresas Chile',
    'QA testing Chile',
    'consultoría tecnológica La Serena',
    'TECKWARE',
    'TECKWARE SpA',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: 'TECKWARE SpA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TECKWARE SpA - Servicio Técnico La Serena',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TECKWARE | Mantención y servicio técnico en La Serena y Coquimbo',
    description: 'Mantención preventiva de PC gamer, notebooks y consolas. Informe técnico, boleta y garantía de 30 días.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  // Sin canonical aquí: se hereda a todas las rutas. Cada página declara el suyo.
  manifest: '/manifest.json',
  // Íconos: app/favicon.ico, app/icon.svg y app/apple-icon.png (convención de archivos).
  ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
}

export const viewport: Viewport = {
  themeColor: '#060B19', // ink-900
  // El contenido llega hasta el notch y la barra de gestos; los fijos se apartan con env(safe-area-inset-*).
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CL" className={`${plex.variable} ${saira.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd) }}
        />
      </head>
      <body className="min-h-svh antialiased">
        <a href="#contenido" className="saltar">Saltar al contenido</a>
        <Navbar />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <Footer />
        <aside aria-label="Contacto rápido">
          <WhatsAppFloat />
          <ChatWidget />
        </aside>
        <Analytics />
      </body>
    </html>
  )
}
