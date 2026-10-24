# SEO técnico, Search Console y analítica

## Dominio canónico

El dominio oficial es **https://www.teckware.cl** (`lib/site.ts`). Vercel redirige
`teckware.cl` → `www.teckware.cl` con 308. Toda URL absoluta (canonical, sitemap,
robots, JSON-LD, Open Graph) sale de `SITE_URL`.

Cada página declara su propio canonical relativo:

```ts
export const metadata: Metadata = {
  title: '...',
  alternates: { canonical: '/mi-ruta' },
}
```

No pongas `alternates` en `app/layout.tsx`: se hereda a todas las rutas que no lo
definan y todas apuntarían a la portada. Páginas `'use client'` (ej. `/agendar`)
llevan su metadata en un `layout.tsx` hermano.

## Google Search Console (recomendado: verificación por DNS)

1. https://search.google.com/search-console → **Agregar propiedad** → **Dominio** → `teckware.cl`.
2. Google entrega un registro `TXT` (`google-site-verification=...`).
3. Cloudflare → `teckware.cl` → **DNS** → **Add record** → Type `TXT`, Name `@`, Content: el valor completo.
4. Volver a Search Console → **Verificar** (puede tardar unos minutos).
5. **Sitemaps** → enviar `https://www.teckware.cl/sitemap.xml`.
6. **Inspección de URLs** → pedir indexación de `/`, `/servicios`, `/mantencion-pc-gamer`,
   `/reparacion-notebook-gamer`, `/servicio-tecnico-apple`, `/builds`, `/agendar`.

Alternativa (propiedad "Prefijo de URL"): copiar solo el `content` de la etiqueta HTML
en la variable de entorno `GOOGLE_SITE_VERIFICATION` de Vercel y redeployar.

## Analítica

`components/layout/Analytics.tsx` carga:

| Herramienta | Cómo se activa | Qué mide |
|---|---|---|
| Vercel Web Analytics | Vercel → proyecto → **Analytics** → Enable | Visitas, páginas, origen, país |
| Vercel Speed Insights | Vercel → proyecto → **Speed Insights** → Enable | Core Web Vitals reales (LCP, INP, CLS) |
| Google Analytics 4 | Variable `NEXT_PUBLIC_GA_ID=G-XXXXXXX` en Vercel + redeploy | Visitas + eventos `click_whatsapp`, `click_telefono`, `click_email` |

Los scripts de Vercel solo se insertan en deploys de Vercel (`VERCEL=1`).

En GA4 → **Administrar → Eventos**, marcar `click_whatsapp` como **evento clave**
(conversión) una vez que aparezca (tarda hasta 24 h).

Si se agrega otro servicio externo, actualizar el `Content-Security-Policy` en `next.config.ts`.
