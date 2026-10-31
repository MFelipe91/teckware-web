# Bloque A: auditoría automática de cierre (teckware.cl)

## Contexto

La Fase 3 ya está en producción (8ce1b62). Antes de cambiar el diseño, Mario quiere una foto medida del
sitio: un informe OK / falla / mejora en `docs/auditoria-cierre.md`, que después sirva para comparar
antes y después. **Este bloque no cambia nada del sitio:** solo agrega herramientas de prueba y el informe.
Las fallas se informan; no se corrigen sin aprobación. Al terminar, me detengo y espero tu aprobación.
Los bloques B y C se planifican después.

## Hallazgo que cambia cómo se prueba

`.env.local` tiene un solo proyecto Supabase, `kkibglmqzpfaecnmwevx`, el mismo que `next.config.ts:48`
deja fijo para las imágenes del sitio. No pude confirmarlo desde el HTML público, pero **lo trato como la
base de producción**. Las variables de la Preview no las puedo ver y podrían apuntar a la misma base.

Consecuencia: enviar `/agendar` en `npm run dev` o en la Preview podría crear filas reales en
`service_requests` y subir fotos reales, y eso está prohibido.

**Decisión:** el servidor local de pruebas apunta a un Supabase falso.
- Un script levanta un servidor falso en `127.0.0.1`, que registra lo que recibe y responde como Supabase.
- `next dev` arranca con `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `ADMIN_PASSWORD` de
  prueba **solo para ese proceso**. No se edita `.env.local` ni nada en Vercel.
- Así corre el código real de `/api/solicitudes`, `/api/upload` y `/admin` sin tocar producción.
- **Límite:** no se comprueba el guardado en la base real. El informe lo dirá, y esa prueba sigue en tus
  manos (ya está pendiente en el punto 6.10 del plan maestro).
- El chat sí usa Groq real con la clave local, como autorizaste, con unas 10 preguntas y respetando el
  límite de 15 por minuto. No guarda nada en la base.

## Reglas de seguridad durante las pruebas

- **En www.teckware.cl solo lectura:** abrir páginas, medir y leer los `href`. Sin enviar formularios, sin
  abrir el chat y sin hacer clic en WhatsApp. No se visita `/admin` en producción.
- **Analítica bloqueada en producción:** se bloquean GA4 y Vercel Analytics en Playwright y Lighthouse, para
  no ensuciar tus visitas ni la conversión `click_whatsapp`. El peso de `gtag.js` se mide aparte y se suma al
  informe, porque Lighthouse no lo verá.
- **Sin WhatsApp real:** en `/solicitar` se intercepta `window.open` y en `/agendar` se lee el `href`. Se
  valida el mensaje sin abrir wa.me.
- **Git:** nunca `git add -A`. No se incluye `.claude/settings.local.json`. Sin push en este bloque, porque
  todavía no hace falta una Preview.

## Pasos

1. **Rama y dependencias**
   - `git checkout -b feat/cierre-pro` desde `main`.
   - `npm i -D @playwright/test @axe-core/playwright` y `npx playwright install chromium`.
   - Lighthouse se usa con `npx lighthouse@13`, sin instalarlo en el proyecto. Usa el Chromium de Playwright.
   - Agregar `test-results/` y `playwright-report/` a `.gitignore`.
2. **Spec y plan:** guardar este plan en `docs/superpowers/specs/2026-10-31-auditoria-cierre-design.md`, que
   hace de spec y plan del bloque. Es una tarea de medición, sin decisiones de diseño.
3. **Pruebas repetibles** en `tests/auditoria/`, con `AUDIT_BASE_URL` y `AUDIT_ETAPA=antes|despues`:
   - `rutas.ts`: lista de rutas sacada de `sitemap.xml`, más `/solicitar`, `/privacidad`, `/terminos` y una 404
     a propósito. Si una página existe pero falta en el sitemap, se informa.
   - `supabase-falso.mjs` y `playwright.config.ts`: el servidor falso y el arranque local en un puerto propio.
4. **Ejecutar y anotar los 8 puntos** (tabla de abajo).
5. **Informe:** escribir `docs/auditoria-cierre.md` con un resumen, una tabla OK / falla / mejora por punto
   (evidencia y archivo), lo que no se pudo probar y las capturas. Datos crudos en
   `docs/auditoria/datos/antes.json`, para el comparativo final.
6. **Commits** solo con los archivos de cada tarea, en español y con `Co-Authored-By`.
7. **Verificación:** `npx tsc --noEmit`, `npm run lint` y `npm run build`, porque `tests/` entra en el tsconfig.
   Si `next build` falla con el error de fuentes ya conocido, reintentar antes de investigar.
8. **Entrega:** informe con las fallas ordenadas por impacto, y me detengo a esperar tu aprobación.

## Qué se mide

| # | Punto | Dónde | Cómo |
|---|---|---|---|
| 1 | Enlaces internos y externos | Producción | Recorre todas las rutas y revisa cada `href` y `src`. Si un sitio externo bloquea robots (Instagram, wa.me: 403/429), queda "revisar a mano", no "roto". |
| 2 | `/agendar` y `/solicitar` | Local + Supabase falso | Campos vacíos e inválidos, fin de semana, fotos (tipo, tamaño, máximo 3), datos enviados a la API, y mensaje de WhatsApp: número, servicio y precio según `lib/constants.ts`. |
| 2b | Formulario PC Gamer | No aplica aún | Se crea en el Bloque C. Queda "pendiente" y se prueba en el cierre. |
| 2c | `/admin` | Local + Supabase falso | Contraseña incorrecta, límite de intentos y entrada correcta. |
| 3 | Chatbot | Local + Groq real | Preguntas de precio por servicio, horario, zona, plazo y dirección (no debe darla). Se compara con `SERVICIOS`, `EMPRESA.horario` y `PLAZO`. Lo que no coincida se marca para revisar y se transcribe en el informe. |
| 4 | 375 y 1440 px | Producción | Todas las rutas: scroll horizontal y errores de consola. Capturas JPEG de las páginas principales, para que el repo no pese de más. |
| 5 | Accesibilidad | Producción + local | axe en todas las rutas y en los pasos del formulario y el chat (estos en local). Teclado y foco: navegación, menú móvil, wizard y chat. |
| 6 | Rendimiento | Producción | Lighthouse móvil, 3 corridas por página y mediana, en `/`, `/mantencion`, `/agendar`, `/builds` y una landing: LCP, CLS, TBT y peso de JS. Presupuesto: 150 KB gzip. |
| 7 | SEO | Producción | `title`, `description`, `canonical` y Open Graph presentes y **únicos** por página; `canonical` igual a la URL; imagen OG accesible; un solo H1. |
| 8 | Imágenes | Producción | Respuestas rotas y peso real de cada imagen servida. Más de 200 KB se marca; también originales en `public/`. Sugerencia de arreglo sin aplicarla. |

Se revisa además que el domicilio legal (Colón 352) aparezca solo en `/privacidad`, como pide la sección 3.

## Cosas ya vistas, por confirmar en el informe

- `/api/solicitudes` no usa Zod ni limita el largo de los textos.
- `registrarSolicitud` en `app/agendar/page.tsx:182` no revisa si la API responde con error: una solicitud no
  guardada pasaría inadvertida, y el flag `registrada` impide reintentar.
- `/api/upload` crea el bucket como público (ya autorizaste hacerlo privado; se corrige en el Bloque C).
- `/builds` todavía dice "Disponible" y "Cotizamos gratis" (Bloque C).
- `/solicitar` no está en `app/sitemap.ts`; hay que ver si es intencional o si es una página huérfana.

## Archivos

- **Nuevos:** `playwright.config.ts`, `tests/auditoria/*`, `docs/auditoria-cierre.md`,
  `docs/auditoria/{capturas,datos}/antes/*`, spec en `docs/superpowers/specs/`.
- **Modificados:** `package.json`, `package-lock.json`, `.gitignore`.
- **Sin tocar:** `app/`, `components/`, `lib/`, `.env.local`, variables de Vercel y `main`.
- `docs/plan-maestro.md` se marca al cierre, como pediste.

## Verificación de este bloque

- El informe tiene los 8 puntos con evidencia, y nada aparece como OK sin haberse medido.
- El registro del Supabase falso muestra los envíos de prueba, y el proceso de pruebas no apunta a la URL real.
- `git status` muestra solo los archivos anteriores, y `git diff main --stat` no incluye `app/`, `components/` ni `lib/`.
- `tsc`, `lint` y `build` pasan.
