# Plan maestro — teckware.cl

> Documento de contexto completo para cualquier sesión de Claude (chat o terminal) que trabaje
> en este proyecto. **Léelo entero antes de tocar código.** Actualizado: 2026-10-26.

---

## 0. Cómo usar este documento

1. Lee las secciones 1–4 (negocio, stack, reglas, estado). No se re-audita lo que ya está hecho.
2. Trabaja la **primera fase sin terminar** (hoy: Fase 3, rediseño — sección 6).
3. Para cada bloque de la Fase 3 usa el flujo de superpowers:
   `brainstorming` (spec en `docs/superpowers/specs/`) → `writing-plans` → ejecución →
   `verification-before-completion`. Para lo visual, la skill `frontend-design`.
4. Al terminar un bloque, marca su casilla aquí y anota el commit.
5. Lee `node_modules/next/dist/docs/` antes de usar una API de Next.js (ver `AGENTS.md`):
   es Next 16 y cambió respecto a lo que conoces.

---

## 1. El negocio

| Dato | Valor |
|---|---|
| Empresa | TECKWARE SpA — RUT 78.398.912-3 |
| Dueño | Mario Felipe Busques Araya |
| Zona | **La Serena y Coquimbo** (Región de Coquimbo, Chile) |
| Modalidad | **Taller en La Serena con hora coordinada por WhatsApp** (sin atención de público sin cita; la dirección se entrega al agendar). A domicilio es poco común: solo trabajos simples (formateo, configuración) y con recargo |
| Domicilio legal | Colón 352, La Serena — **solo** en `/privacidad`. Nunca mostrarlo en otro lado |
| Horario | Lunes a viernes, 10:00–18:30 |
| Teléfono / WhatsApp | +56 9 3020 9427 · https://wa.me/56930209427 |
| Email | mariofelipe@teckware.cl |
| Instagram | https://instagram.com/teckware.cl |
| Garantía / boleta | 30 días en todos los servicios · se emite boleta |

**Prioridad de mensajes (en este orden):**

1. **Mantención preventiva** especializada (PC gamer, computadores, notebooks, consolas).
2. Armado de PC gamer.
3. Asesoría informática integral para empresas y particulares.
4. Integración tecnológica y automatización con IA.
5. Desarrollo de soluciones informáticas (web, QA).
6. Reparación.

**Precios:** la única fuente de verdad es `lib/constants.ts`. Si cambias un precio, cámbialo
también en el prompt del chatbot (`app/api/chat/route.ts`) y en `lib/whatsapp.ts`.
Referencia: Diagnóstico $30.000 · Mantención Lógica/Formateo **$45.000** · Mantención Full $75.000 ·
GPU desde $45.000 · Recuperación de datos desde $35.000 · Armado estándar $75.000 /
alta gama $90.000 · PS3/PS4 $55.000 · PS5 $80.000.

---

## 2. Stack e infraestructura

- **Next.js 16.2.4** (App Router), React 19.2, Tailwind 4, shadcn, framer-motion, three.js,
  Supabase (servicios destacados y solicitudes), Groq (chatbot "Teck").
- **Deploy:** push a `main` de github.com/MFelipe91/teckware-web → Vercel lo publica solo
  (proyecto `mfelipe91s-projects/teckware-web`, Hobby). Las otras ramas generan una Preview.
- **Dominio:** canónico `https://www.teckware.cl` (`lib/site.ts`); el apex hace 308 a www.
  DNS en Cloudflare (www es CNAME a Vercel, "DNS only").
- **Medición:**
  - Search Console: propiedad de dominio `teckware.cl`, con el sitemap enviado.
  - GA4: G-SY6YXTBH09, en la variable `NEXT_PUBLIC_GA_ID`. Eventos: `click_whatsapp`
    (evento clave), `click_telefono` y `click_email`.
  - Vercel Web Analytics y Speed Insights. Todo esto está en `components/layout/Analytics.tsx`.
- **Ficha de Google (Perfil de Empresa):** creada como zona de servicio. Estado "Verificación
  requerida" (la verificación por video la hace el dueño). Detalle en `docs/ficha-google.md`.
- **Ramas:**
  - `main` → producción.
  - `feat/diseno` → rediseño, rama actual; el commit `f97f474` agrega el logo 2026.
  - `feat/pagos` → sistema de pagos Flow/Khipu, **archivado, no se publica**.
  - `diseno-3d` → ya está integrada en main.
- **Entorno local:** Windows. Node y Git están en `C:\Program Files\...`. Servidor de desarrollo:
  `npm run dev` (puerto 3000, definido en `.claude/launch.json`).

### Mapa del código que importa

| Archivo | Qué es |
|---|---|
| `lib/site.ts` | `SITE_URL` (www) |
| `lib/constants.ts` | EMPRESA, precios, servicios, NAV_LINKS, REVIEWS, STATS |
| `lib/landings.ts` | Lista de landings locales (alimenta el footer, el sitemap y "Otros servicios") |
| `lib/blog.ts` | Guías del blog (alimenta `/blog`, `/blog/[slug]` y el sitemap) |
| `lib/structured-data.ts` | JSON-LD: `businessLd`, `serviceLd`, `articleLd`, `faqLd` |
| `components/landing/ServiceLanding.tsx` | Plantilla de las landings (requiere la prop `path`) |
| `components/home/*` | Secciones de la home: Hero, Ticker, BookingStrip, ServiciosDestacados, PorQueElegirnos, Proceso, Reviews, CTABanner |
| `components/three/HeroCanvas.tsx` | Escena 3D del hero (22 KB de código, más three.js) |
| `app/layout.tsx` | metadataBase, verificación de Google, `<Analytics />` |
| `app/sitemap.ts`, `app/robots.ts` | Generados a partir de `LANDINGS` y `POSTS` |
| `app/api/chat/route.ts` | Prompt del chatbot (horario, precios, zona) |

---

## 3. Reglas inamovibles

- [ ] **Nunca** `git add -A` ni `git add .`: agrega solo los archivos de la tarea.
- [ ] El sistema de pagos (`/pagar`, `app/api/payments`, `lib/flow.ts`, `lib/khipu.ts`,
      `lib/payments*.ts`, `components/pagos`, `db/schema-payments.sql`) **no va a main**.
- [ ] No publicar la dirección de calle. El schema `LocalBusiness` lleva solo la localidad,
      la región y el país.
- [ ] Cada página nueva lleva su `alternates.canonical` relativo (`'/ruta'`) y un `title` único.
- [ ] Una landing nueva se registra en `lib/landings.ts` y una guía nueva en `lib/blog.ts`.
      Nada de páginas huérfanas.
- [ ] Horario, teléfono y zona deben coincidir **exactamente** entre la web, la Ficha de
      Google, el chatbot y los directorios (NAP).
- [ ] No inventar reseñas, cifras ni testimonios (ver 6.6).
- [ ] Antes de cerrar una tarea: `npx tsc --noEmit` y `npm run build` sin errores.
      Después, verificar en el navegador (escritorio y móvil, sin consola roja).
- [ ] Mensajes de commit en español, estilo `feat: …` / `fix: …`, terminando con
      `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- [ ] Términos de servicios de terceros, cuentas nuevas o contraseñas: solo los hace el dueño,
      o se hacen con su "sí" explícito.

---

## 4. Estado: lo que ya está hecho

### Fase 1 — SEO técnico crítico ✅ (2026-10-24)
- Dominio único www, `metadataBase` y canonical por página (antes todas apuntaban a la home).
- Metadata para `/agendar` y `/solicitar`, que son `'use client'`.
- Search Console verificado y sitemap enviado.
- GA4 con eventos de contacto, Vercel Analytics y Speed Insights. CSP actualizada para GA.

### Fase 2 — SEO local ✅ en código (2026-10-26)
- 7 landings servicio × ciudad, más 3 que existían y estaban huérfanas, todas enlazadas desde
  el footer y entre sí:
  - `/servicio-tecnico-computadores-la-serena`, `/servicio-tecnico-coquimbo`
  - `/reparacion-notebook-la-serena`, `/formateo-pc-la-serena`
  - `/mantencion-pc-gamer`, `/armado-pc-gamer-la-serena`, `/reparacion-notebook-gamer`
  - `/servicio-tecnico-apple`, `/mantencion-ps5-la-serena`, `/recuperacion-de-datos-la-serena`
- JSON-LD `Service` en cada landing y `FAQPage` donde corresponde.
- Blog `/blog` con 4 guías de mantención preventiva (JSON-LD `BlogPosting`).
- Negocio de zona de servicio en todo el sitio. Horario real Lun–Vie 10:00–18:30.
- Formateo a $45.000 en todos lados (web, chatbot, WhatsApp).
- Ficha de Google creada: categorías, servicios y descripción con prioridad en mantención.
- Documentación: `docs/ficha-google.md`, `docs/directorios-nap.md` y
  `docs/seo-search-console-analitica.md`.
- Commits: 6c41fb4, cddd8fb, 36a2c9c, 56349ce, cf1bba3, 809be62, 98fd9b0.

---

## 5. Reseña del sitio actual (auditoría web)

### Lo que está bien
- Base técnica sólida: Next 16 con páginas estáticas, JSON-LD completo, sitemap dinámico y
  canonicals correctos.
- Estructura SEO local muy buena: 10 landings, blog y enlazado interno.
- Hay mucha información útil: precios claros, garantía, boleta y tiempos de entrega.
- Los CTA de WhatsApp están medidos como conversión.
- Chatbot propio con datos consistentes.

### Problemas, por impacto

| # | Problema | Dónde | Impacto |
|---|---|---|---|
| 1 | **El H1 no dice qué ni dónde.** "Soporte y Servicios Informáticos Especializados" no tiene ciudad ni la palabra "mantención" | `components/home/Hero.tsx` | SEO local y claridad en 3 segundos |
| 2 | **LCP ≈ 5 s.** El hero es `'use client'`, el H1 arranca con `opacity: 0` (framer-motion) y three.js compite por la CPU, sobre todo en celulares de gama media | `Hero.tsx`, `HeroCanvas.tsx` | Core Web Vitals, rebote en móvil |
| 3 | **La identidad no calza con el logo 2026.** El logo es azul real, plata y navy; el sitio usa cian neón #00D4FF, rojo AMD #E61E32 y morado ROG #A855F7, con estética "gamer RGB" | `app/globals.css`, todos los componentes con colores hex a mano | Marca poco profesional para empresas |
| 4 | **La navegación no refleja el negocio.** Aparecen primero "Web & QA" y "Ciberseguridad"; la mantención (lo principal) no tiene entrada propia y el blog no está en el menú | `NAV_LINKS` en `lib/constants.ts`, `Navbar.tsx` | Conversión y señales de relevancia |
| 5 | **Fotos de stock** (Unsplash/Pexels). No hay fotos del taller, del trabajo ni del dueño | `public/images/*` | Confianza local; Google premia lo auténtico |
| 6 | **Prueba social sin respaldo.** REVIEWS ("Carlos G.", etc.) y STATS ("200+", "5★", "100%") están escritos a mano y no está confirmado que sean reales | `lib/constants.ts:316-345` | Riesgo legal (SERNAC, publicidad engañosa) y con Google |
| 7 | **Promesas sin respaldo.** "Disponible hoy" y "Respuesta en 2 horas" aparecen fijas, sin importar el día ni la hora | `Hero.tsx` | Expectativa incumplida |
| 8 | **Colores escritos a mano en cada componente** (`text-[#94A3B8]`…), aunque existen tokens `tw-*` en `globals.css` | Todo `components/` | Cada cambio de marca es lento y propenso a errores |
| 9 | **Logos duplicados y pesados.** Hay 6 PNG en `public/` más un pack; `logo-full.png` pesa 880 KB y el nuevo 1,5 MB, con fondo sólido (no transparente) | `public/` | Peso y consistencia |
| 10 | El home tiene 3 CTA de igual peso (Agendar, WhatsApp, PC Gamer) | `Hero.tsx` | Diluye la acción principal |

---

## 6. Fase 3 — Rediseño (EN CURSO, rama `feat/diseno`)

**Objetivo:** que en 3 segundos se entienda *"mantención y servicio técnico de computadores en
La Serena y Coquimbo, profesional y confiable"* y que la acción obvia sea WhatsApp o agendar.
Estética: profesional-tecnológica (azul y plata del logo), no "RGB gamer". El mundo gamer queda
como una sección, no como la identidad entera.

**Orden recomendado:** 6.1 → 6.2 → 6.3 → 6.4 → 6.5. Los puntos 6.6 a 6.9 pueden ir en
paralelo cuando haya material.

### 6.1 Branding con el logo 2026
Fuente: `public/images/logo-principal-2026.png` (1254×1254, RGB **sin transparencia**, fondo
navy). Hay un pack anterior en `public/images/teckware_logos_pack_1/`.

- [x] Pedir al dueño (o generar) una versión **con fondo transparente**, idealmente en SVG o
      PNG con alfa. Sin eso, el logo se ve como un cuadrado navy sobre otros fondos.
      → Generada y aprobada por el dueño (2026-10-26). Es para fondos oscuros; el master
      queda en `design/brand/` (no se versiona) y todo se regenera con
      `node scripts/brand/generate-assets.mjs`.
- [x] Derivar estos recursos, en WebP/PNG optimizados:
  - [x] Isotipo TW solo (navbar en móvil, favicon). → `public/brand/isotipo*.svg`, plano.
  - [x] Versión horizontal "isotipo + TECKWARE" para el navbar (alto de unos 40 px).
        → `public/brand/logo-horizontal.webp` (17 KB).
  - [x] Favicons 16/32/48, `app/icon.png`, `apple-touch-icon` 180, `icon-192`/`icon-512`
        (`manifest.json`). → `app/favicon.ico`, `app/icon.svg`, `app/apple-icon.png`,
        `public/icon-192/512.png` y `icon-maskable-512.png`.
  - [x] Nueva `og-image` 1200×630 con el logo y el texto "Mantención y servicio técnico ·
        La Serena y Coquimbo" (revisar también `app/og`). → `app/og` eliminada (sin uso).
- [x] Reemplazar `/logo.png` (Navbar) y `/logo-full.png` (Footer). Eliminar los logos viejos que
      no se usen (`logo-v1..v7.svg`, `logo-tw*.png`, `logo-emblem.png`), revisando antes con
      grep que nada los referencie. → Commit `20682ba`.
- **Listo cuando:** ningún logo pesa más de 100 KB y se ve nítido en el navbar, el footer,
  la pestaña del navegador, al compartir en WhatsApp y en la pantalla de inicio del celular.

### 6.2 Sistema de diseño (tokens)
- [x] Sacar la paleta del logo y definirla como tokens en `app/globals.css` (`@theme`):
  - `--color-brand` (azul real, aprox. #1F6FEB a #2B8CFF; muestrear del PNG)
  - `--color-brand-bright` (azul claro del brillo)
  - `--color-silver` (plata del "TECK")
  - `--color-ink` (navy de fondo, aprox. #0A1226)
  - Superficies, bordes y textos.
- [x] Quitar el rojo AMD y el morado ROG como colores de marca. Si se quiere, dejar el morado
      solo como acento de la sección PC Gamer. → Morado solo en `/builds` y el CTA PC Gamer;
      verde solo para WhatsApp.
- [x] Reemplazar los colores hex escritos a mano por clases de token (buscar con
      `grep -rn "\[#" components app`). → 0 restantes; los canvas leen los tokens en runtime.
- [x] Tipografía: titulares con carácter técnico (que combine con el "TECKWARE" del logo;
      evaluar con `frontend-design`) y una fuente de texto legible. Máximo 2 familias, con
      `next/font`. → Sora (titulares) + Inter (texto).
- [x] Contraste AA en todos los textos: el gris actual #475569 sobre #03040A **no pasa**.
      → Verificado con `node scripts/brand/contrast.mjs` (todos los pares ≥ 4,5:1).
- **Listo cuando:** cambiar el color de marca en un solo lugar cambia todo el sitio.
  → Hecho, commit `186beec`.

### 6.3 Hero nuevo (rendimiento y mensaje)
- [x] H1 local: **"Mantención y servicio técnico de computadores en La Serena y Coquimbo"**,
      o una variante que conserve la ciudad y la palabra "mantención". → Con el tagline del
      dueño: "Reparamos tu hardware. Construimos tu software. Somos TECKWARE."
- [x] El subtítulo menciona: PC gamer, notebooks, consolas y empresas; a domicilio; garantía
      30 días; boleta. (Entre el eyebrow, el párrafo y los sellos.)
- [x] Hero como **Server Component**. El texto se renderiza visible desde el HTML: nada de
      `opacity: 0` inicial en el H1 ni en el párrafo. La animación, si la hay, va solo en
      decoraciones. → Verificado en el HTML servido.
- [x] three.js: quitarlo del hero, o cargarlo solo en escritorio y después del LCP
      (`requestIdleCallback` / `IntersectionObserver`), respetando `prefers-reduced-motion`.
      Ideal: reemplazarlo por una **foto real** optimizada con `next/image` y `priority`.
      → three.js eliminado del proyecto. Mientras no haya fotos, el visual es el emblema
      (`public/brand/emblem.webp`, solo escritorio). Pendiente: foto real (6.7).
- [x] Un CTA principal (WhatsApp o Agendar) y uno secundario. "PC Gamer" pasa a una tarjeta
      de servicio. → WhatsApp principal, Agendar secundario.
- [x] Cambiar "Disponible hoy" por algo siempre cierto ("Atención a domicilio · Lun–Vie
      10:00–18:30"), o calcularlo según la hora de Chile. → Sellos: garantía 30 días ·
      boleta · taller en La Serena · entrega en 48 h hábiles (`PLAZO`) · horario (`EMPRESA.horario`).
- [ ] Medir en la Preview de Vercel: LCP móvil, CLS y Lighthouse SEO/Accesibilidad.
- **Listo cuando:** LCP < 2,5 s en móvil (PageSpeed o Speed Insights), CLS < 0,1, el H1 es
  visible sin JavaScript y Lighthouse SEO y Accesibilidad dan 100.

### 6.4 Arquitectura de información y navegación
Propuesta de `NAV_LINKS`:

| Menú | Destino |
|---|---|
| **Mantención** | `/mantencion-pc-gamer` o un hub nuevo `/mantencion` que liste PC, notebook, PS5 y GPU |
| Servicio técnico | `/servicios` (todas las reparaciones y las landings) |
| PC Gamer | `/builds` (armado y cotización) |
| Empresas | Hub nuevo `/empresas`: asesoría integral, mantención empresarial, automatización con IA, desarrollo; ahí se integran Web & QA y Ciberseguridad |
| Blog | `/blog` |
| Contacto | `/contacto` |

- [x] El botón fijo del navbar dice "WhatsApp" o "Agendar". → WhatsApp.
- [x] Si se crean `/mantencion` y `/empresas`, se agregan al sitemap y al footer. Las URLs
      actuales **no se borran** (tienen SEO); solo cambian de lugar en el menú.
      → Hubs creados con `components/landing/HubPage.tsx`; menú en `NAV_LINKS`. Web & QA,
      Ciberseguridad y Nosotros quedan en el footer y enlazados desde `/empresas`.

### 6.5 Home, sección por sección
Orden sugerido:

1. **Hero** (6.3).
2. **Franja de confianza:** garantía 30 días · boleta · taller en La Serena · pago al retirar · informe técnico.
3. **Servicios principales** con precio "desde", con la mantención primero y enlaces a las
   landings.
4. **Cómo funciona** (`Proceso`): escribes → diagnóstico → aprobación → entrega.
5. **Antes / después de una mantención** con fotos reales (temperaturas, polvo, pasta térmica).
   Es lo que más vende la mantención preventiva.
6. **Empresas:** asesoría, mantención de flota, automatización con IA.
7. **PC Gamer:** armados.
8. **Reseñas reales de Google** (6.6).
9. **Guías del blog:** las 3 últimas.
10. **Zona de atención** (La Serena / Coquimbo) y CTA final.

- [x] Revisar si el Ticker y el BookingStrip aportan o sobran. → Sobraban (duplicaban servicios
      con precios escritos a mano). Reemplazados por `TrustStrip`; nuevas secciones `Segmentos`
      (Empresas / PC Gamer) y `GuiasBlog`; `Proceso` con el flujo real del taller.
- [x] `revalidate = 30` en la home consulta Supabase cada 30 s. Evaluar si conviene subirlo
      (por ejemplo a 300). → 300.
- [x] Sin animaciones que oculten contenido (framer-motion eliminado del proyecto).
- [ ] Antes / después y reseñas reales: cuando existan fotos (6.7) y la Ficha esté verificada.
- [ ] **Tabla `services` de Supabase desactualizada** (Mantención Lógica $40.000, plazos viejos):
      decidir la fuente de precios y plazos (ver conversación del 2026-10-26).

### 6.6 Prueba social honesta
- [x] **El dueño debe confirmar** si las REVIEWS y STATS de `lib/constants.ts` son reales.
      → No lo eran: eliminadas junto con la sección de reseñas de la home (commit `bdf6883`).
  - [ ] Reemplazarlas por reseñas reales de Google cuando la ficha esté verificada (texto,
        nombre como aparece en Google y enlace "Ver en Google").
  - Cifras: usar solo las verificables (años de experiencia, equipos atendidos según los
    registros reales).
- [ ] No agregar `aggregateRating` al JSON-LD con datos propios: Google lo prohíbe para
      reseñas auto-alojadas de un LocalBusiness.

### 6.7 Fotos reales (las toma el dueño)
Lista de fotos (horizontales, buena luz, sin datos de clientes visibles):

- [ ] Dueño trabajando (retrato para el hero y para `/nosotros`).
- [ ] Mesa de trabajo y herramientas.
- [ ] PC gamer abierto antes y después de la limpieza.
- [ ] Aplicación de pasta térmica / metal líquido en un PS5.
- [ ] Notebook desarmado.
- [ ] Armado terminado con cable management.
- [ ] Recepción de un equipo en el taller.

Ruta sugerida: `public/images/real/`. Usar con `next/image` y nombres descriptivos
(`mantencion-pc-gamer-la-serena.webp`). Las mismas fotos se suben a la Ficha de Google.

### 6.8 Landings, blog y páginas internas
- [ ] Aplicar los nuevos tokens a `ServiceLanding.tsx`, que hereda en las 10 landings.
- [ ] Agregar una foto real por landing cuando existan.
- [ ] `/nosotros`: historia real, foto del dueño, RUT y zona; es la señal de E-E-A-T.
- [ ] Blog: diseño de lectura cómodo (ancho de unos 70 caracteres por línea, tipografía
      de lectura).
- [ ] `/agendar` y `/solicitar`: formularios con los nuevos estilos; probar que se envían.

### 6.9 Rendimiento y accesibilidad (presupuesto)
- [ ] JS inicial de la home < 150 KB gzip (revisar la salida de `next build`).
- [ ] Imágenes en WebP/AVIF vía `next/image`, con `sizes` correcto.
- [ ] `prefers-reduced-motion` desactiva las animaciones decorativas.
- [ ] Foco visible y navegación con teclado en el menú móvil y el chatbot.
- [ ] Probar a 375 px de ancho sin scroll horizontal.

### 6.10 Cierre de la fase
- [ ] `npx tsc --noEmit`, `npm run lint` y `npm run build` sin errores.
- [ ] Revisión en la Preview de Vercel de la rama (escritorio y móvil).
- [ ] PR `feat/diseno` → `main` con capturas antes y después.
- [ ] Después de publicar: comprobar en www.teckware.cl, pedir reindexación de la home en
      Search Console y medir el LCP en Speed Insights al cabo de unos días.

---

## 7. Fase 4 — Crecimiento (después del rediseño)

- [ ] **Revisión mensual:** consultas y páginas en Search Console, conversiones `click_whatsapp`
      en GA4 y Core Web Vitals. Puede hacerse como tarea programada de Claude.
- [ ] **Una guía de blog cada 2 semanas.** Temas:
  - Limpieza de notebook.
  - Cuándo cambiar la pasta térmica.
  - SSD vs HDD.
  - Mantención de PS4.
  - PC para empresa pyme.
  - Respaldo de datos.
  - Automatizar tareas con IA en una pyme.
- [ ] **Hub `/empresas`** con un caso de éxito real.
- [ ] **Publicaciones semanales en la Ficha de Google**, con la misma foto que en Instagram.
- [ ] **Google Ads local** (opcional, presupuesto pequeño) solo para "servicio técnico
      computadores La Serena", cuando el rediseño convierta bien.
- [ ] Evaluar si reactivar el sistema de pagos (`feat/pagos`) para pagar el diagnóstico en línea.

---

## 8. Tareas del dueño (no las puede hacer Claude)

- [ ] Completar la **verificación de la Ficha de Google** (video). Hasta entonces la ficha no
      aparece en Maps.
- [ ] Subir el logo y las fotos reales a la Ficha.
- [ ] Logo 2026 con **fondo transparente** (o el archivo original del diseñador o la IA).
- [ ] Tomar las fotos de la sección 6.7.
- [ ] Confirmar si las REVIEWS y STATS son reales (6.6).
- [ ] Inscribirse en los directorios (`docs/directorios-nap.md`): Bing Places, Apple Business
      Connect, Cronoshare, Mercantil y Amarillas.
- [ ] Empezar la rutina de reseñas con cada cliente (plantilla en `docs/directorios-nap.md`).
- [ ] (Opcional) Conectar los conectores **Vercel** y **Supabase** en Claude: Ajustes →
      Conectores.

---

## 9. Decisiones abiertas

| Tema | Opciones | Recomendación |
|---|---|---|
| Fondo del hero | three.js / foto real / ilustración ligera | **Foto real**; three.js como mucho en escritorio y después del LCP |
| CTA principal | WhatsApp / Agendar | **WhatsApp** (es donde se cierra hoy; ya se mide) |
| Mantención en el menú | Hub `/mantencion` nuevo / landing existente | **Hub nuevo**: posiciona "mantención La Serena" y enlaza a las específicas |
| Web & QA y Ciberseguridad | Mantener en el menú / mover a `/empresas` | **Mover a `/empresas`** |
| Estética | Gamer RGB / profesional azul y plata | **Profesional azul y plata**, alineada al logo |

---

## 10. Prompt para pegar en la terminal

```
Lee docs/plan-maestro.md completo y AGENTS.md. Estamos en la rama feat/diseno, Fase 3 (rediseño).
Respeta la sección 3 (reglas inamovibles). Empieza por 6.1 (branding con el logo
public/images/logo-principal-2026.png) y 6.2 (tokens de diseño), usando superpowers:brainstorming
y frontend-design. Pregúntame solo lo que dependa de mí (sección 8). Marca las casillas del plan
a medida que avances y no hagas commit de archivos ajenos a la tarea.
```
