import { EMPRESA, SERVICIOS } from './constants'

const SITE = 'https://teckware.cl'
const PHONE_E164 = '+56930209427'

/** Convierte "$30.000" / "Desde $45.000" → { min, exact } en CLP. */
function parsePrecio(precio: string): { value?: number; isFrom: boolean } {
  const digits = precio.replace(/[^\d]/g, '')
  if (!digits) return { isFrom: false } // "A cotizar" / "A coordinar"
  return { value: Number(digits), isFrom: /desde/i.test(precio) }
}

/** Catálogo de ofertas a partir de los servicios reales (con precios). */
function buildOfferCatalog() {
  return {
    '@type': 'OfferCatalog',
    name: 'Servicios técnicos TECKWARE',
    itemListElement: SERVICIOS.map((s) => {
      const { value, isFrom } = parsePrecio(s.precio)
      const offer: Record<string, unknown> = {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.nombre,
          description: s.descripcion,
          areaServed: 'La Serena, Coquimbo',
          provider: { '@id': `${SITE}/#business` },
        },
      }
      if (value) {
        offer.priceCurrency = 'CLP'
        offer.price = value
        if (isFrom) {
          offer.priceSpecification = {
            '@type': 'PriceSpecification',
            minPrice: value,
            priceCurrency: 'CLP',
          }
        }
      }
      return offer
    }),
  }
}

/** JSON-LD del negocio (LocalBusiness) — enriquecido para rich results locales. */
export const businessLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE}/#business`,
  name: EMPRESA.nombre,
  legalName: EMPRESA.nombre,
  description:
    'Servicio técnico de computadores, PC Gamer y notebooks en La Serena. Reparación, mantención, armado de PC Gaming, upgrade de hardware, MacBook y consolas.',
  url: SITE,
  telephone: PHONE_E164,
  email: EMPRESA.email,
  image: `${SITE}/og-image.png`,
  logo: `${SITE}/icon.png`,
  priceRange: '$$',
  currenciesAccepted: 'CLP',
  paymentAccepted: 'Efectivo, Transferencia, Tarjeta',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Colón 352',
    addressLocality: 'La Serena',
    addressRegion: 'Región de Coquimbo',
    postalCode: '1700000',
    addressCountry: 'CL',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -29.9027, longitude: -71.2519 },
  areaServed: [
    { '@type': 'City', name: 'La Serena' },
    { '@type': 'City', name: 'Coquimbo' },
  ],
  knowsAbout: [
    'Reparación de notebooks',
    'Mantención de PC Gamer',
    'Reparación de notebook gamer',
    'Servicio técnico MacBook y Apple',
    'Armado de PC Gaming',
    'Upgrade de hardware (GPU, RAM, SSD)',
    'Mantención de consolas PlayStation',
    'Recuperación de datos',
    'Ciberseguridad para empresas',
    'Desarrollo web y QA',
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  sameAs: [EMPRESA.instagram],
  hasOfferCatalog: buildOfferCatalog(),
}

/** Genera JSON-LD de FAQ (para páginas con preguntas frecuentes → rich snippet). */
export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
