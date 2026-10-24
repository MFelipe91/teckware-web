import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
// Vercel solo sirve /_vercel/* en sus deploys; en local esos scripts darían 404
const ON_VERCEL = process.env.VERCEL === '1'

// Clics que cuentan como contacto (conversión) en GA4
const GA_INIT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if (!a) return;
  var href = a.getAttribute('href') || '';
  var name = /wa\\.me|whatsapp/i.test(href) ? 'click_whatsapp'
    : href.indexOf('tel:') === 0 ? 'click_telefono'
    : href.indexOf('mailto:') === 0 ? 'click_email'
    : null;
  if (name) gtag('event', name, { link_url: href, page_path: location.pathname });
}, true);
`

/**
 * Analítica del sitio:
 * - Vercel Web Analytics + Speed Insights (se activan en el dashboard del proyecto en Vercel).
 * - Google Analytics 4 si existe NEXT_PUBLIC_GA_ID, con eventos de clic a WhatsApp/teléfono/email.
 */
export function Analytics() {
  return (
    <>
      {ON_VERCEL && (
        <>
          <Script src="/_vercel/insights/script.js" strategy="lazyOnload" />
          <Script src="/_vercel/speed-insights/script.js" strategy="lazyOnload" />
        </>
      )}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {GA_INIT}
          </Script>
        </>
      )}
    </>
  )
}
