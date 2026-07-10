import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.teckware.cl'
  const now = new Date()

  return [
    { url: base,                      lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/servicios`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/builds`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/agendar`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/web-qa`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ciberseguridad`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/nosotros`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacto`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
