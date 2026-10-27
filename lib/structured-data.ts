import { EMPRESA, SERVICIOS } from './constants'
import { SITE_URL as SITE } from './site'
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
    'Mantención preventiva especializada de PC gamer, computadores y notebooks en La Serena y Coquimbo. Armado de PC gamer, reparación, asesoría informática integral, automatización con IA y desarrollo de soluciones informáticas.',
  url: SITE,
  telephone: PHONE_E164,
  email: EMPRESA.email,
  image: `${SITE}/og-image.png`,
  logo: `${SITE}/icon-512.png`,
  priceRange: '$$',
  currenciesAccepted: 'CLP',
  paymentAccepted: 'Efectivo, Transferencia, Tarjeta',
  // Negocio de zona de servicio: sin calle ni coordenadas (coincide con la Ficha de Google).
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'La Serena',
    addressRegion: 'Región de Coquimbo',
    addressCountry: 'CL',
  },
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
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '10:00',
    closes: '18:30',
  },
  sameAs: [EMPRESA.instagram],
  founder: { '@type': 'Person', name: EMPRESA.responsable, jobTitle: EMPRESA.tituloProfesional },
  hasOfferCatalog: buildOfferCatalog(),
}

/** JSON-LD de un servicio concreto (landing de servicio × ciudad). */
export function serviceLd(s: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    url: `${SITE}${s.path}`,
    serviceType: s.name,
    provider: { '@id': `${SITE}/#business` },
    areaServed: [
      { '@type': 'City', name: 'La Serena' },
      { '@type': 'City', name: 'Coquimbo' },
    ],
  }
}

/** JSON-LD de una guía del blog. */
export function articleLd(a: { title: string; description: string; path: string; date: string; author: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    url: `${SITE}${a.path}`,
    mainEntityOfPage: `${SITE}${a.path}`,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: 'es-CL',
    author: { '@type': 'Person', name: a.author, jobTitle: EMPRESA.tituloProfesional },
    publisher: { '@id': `${SITE}/#business` },
    image: `${SITE}/og-image.png`,
  }
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
