import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Titulares: geométrica y técnica, combina con el wordmark del logo.
const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-sora',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TECKWARE | Servicio Técnico, PC Gamer y Hardware — La Serena, Chile',
    template: '%s | TECKWARE La Serena',
  },
  description:
    'Servicio técnico de computadores y PC Gamer en La Serena. Reparación de notebooks, armado de PC Gaming, upgrade RTX y Ryzen, mantenimiento y diagnóstico profesional. Expertos en hardware AMD, Intel y NVIDIA.',
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
    title: 'TECKWARE SpA | Servicio Técnico La Serena',
    description: 'Reparación de notebooks, PC Gamer, MacBook y consolas en La Serena.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CL" className={`${inter.variable} ${sora.variable}`}>
      <head>
        {/* Preload hero image for LCP — only on desktop (54vw panel) */}
        <link
          rel="preload"
          as="image"
          href="/images/hardware.jpg"
          media="(min-width: 1024px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}
