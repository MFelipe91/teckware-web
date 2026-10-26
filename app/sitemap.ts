import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { LANDINGS } from '@/lib/landings'
import { POSTS } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL
  const now = new Date()

  return [
    { url: base,                      lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/mantencion`,      lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/servicios`,       lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/empresas`,        lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    ...LANDINGS.map((l) => ({
      url: `${base}${l.href}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.85,
    })),
    { url: `${base}/blog`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    ...POSTS.map((p) => ({
      url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'monthly' as const, priority: 0.6,
    })),
    { url: `${base}/builds`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/agendar`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/web-qa`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ciberseguridad`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/nosotros`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacto`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
