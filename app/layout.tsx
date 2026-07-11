import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'
import { ChatWidget } from '@/components/layout/ChatWidget'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://teckware.cl'),
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
    url: 'https://teckware.cl',
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
  alternates: { canonical: 'https://teckware.cl' },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'PENDIENTE-AGREGAR-VERIFICATION-CODE',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'TECKWARE SpA',
  description:
    'Servicio técnico informático en La Serena. Reparación de notebooks, PC, MacBook y consolas.',
  url: 'https://teckware.cl',
  telephone: '+56930209427',
  email: 'mariofelipe@teckware.cl',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Colón 352',
    addressLocality: 'La Serena',
    addressRegion: 'Región de Coquimbo',
    addressCountry: 'CL',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -29.9027,
    longitude: -71.2519,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  sameAs: ['https://instagram.com/teckware.cl'],
  priceRange: '$$',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CL" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload hero image for LCP — only on desktop (54vw panel) */}
        <link
          rel="preload"
          as="image"
          href="/images/gpubkn.jpg"
          media="(min-width: 1024px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ChatWidget />
      </body>
    </html>
  )
}
