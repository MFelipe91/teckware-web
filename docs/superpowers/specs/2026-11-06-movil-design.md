# Diseño — Bloque 2: corrección móvil de teckware.cl

Fecha: 2026-11-06 · Rama `feat/movil` · Origen: `docs/auditoria-movil.md` (aprobado por el dueño).

## Intención

Casi todos los clientes llegan desde Instagram y WhatsApp **en el celular**. Hoy el sitio no está roto en celular (no hay desplazamiento lateral, CLS 0, Lighthouse 92–97), pero se siente como un escritorio apilado:

- La portada mide 12,6 pantallas y muestra los precios dos veces.
- La letra de apoyo es de 13–14 px.
- Los enlaces miden 24–28 px de alto.
- El botón de WhatsApp aparece en dos colores.
- El menú no ocupa la pantalla y el pie mide unas 2 pantallas.

El objetivo es que en un teléfono de 360–412 px el sitio se lea sin esfuerzo, se toque sin errores y lleve rápido a WhatsApp o a Agendar.

**Éxito (medible con `npx playwright test prod.movil` y Lighthouse, con `AUDIT_ETAPA=despues`):**

- Ningún texto de frase bajo 16 px en páginas públicas. Se aceptan 14 px solo en metadatos cortos: RUT, ©, "Paso 1 de 4", notas del chat.
- Lo tocable mide al menos 44 px de alto y hay 8 px o más entre objetivos.
- Portada de 8 pantallas o menos a 360 px (hoy 12,6) y `/servicios` de 10 o menos (hoy 14,2).
- Un solo estilo visual para todo botón que abre WhatsApp.
- Se mantienen CLS < 0,1, LCP ≤ 2,5 s, Accesibilidad 100 y SEO 100, sin desplazamiento horizontal.

## No objetivos

- No se cambia el logo, la paleta, las tipografías Saira/Plex, la forma de "corte" ni los textos del negocio, salvo recortes de repetición.
- No se agregan dependencias. Tampoco GSAP: framer-motion ya no se usa en lo público y no se reintroduce.
- No se toca `/admin`, que es privado y de escritorio.
- No se tocan precios, plazos ni reglas del negocio (`lib/constants.ts` sigue siendo la fuente).

## Anti-objetivos (fracaso aunque "funcione")

- Que el escritorio a 1440 px empeore: hoy está bien y debe quedar igual o mejor.
- Que la letra de 16 px descuadre el escritorio (navbar o pie en varias líneas).
- Que se pierda contenido SEO (H1 local, textos de las landings, enlaces internos del pie) por "acortar".
  Se reordena y compacta; no se borra lo que posiciona.

## Decisiones (criterio delegado por el dueño)

### 1. Base global (`app/globals.css`, `app/layout.tsx`)

- **Escala de texto:** en `@theme`, `--text-sm: 1rem` (line-height 1.5) y `--text-xs: 0.875rem`. Así el texto "chico" del sitio pasa a 16 px de una vez. Las frases que hoy usan `text-xs`, `text-[13px]` o `text-[12px]` pasan a `text-sm`, y `text-xs` queda solo para metadatos cortos.
- **H1 en celular:** bajo 40rem, `--titulo-h1: clamp(2.125rem, 9.4vw, 2.5rem)`, unos 34 px a 360 px, para que quepa en 4 líneas. Sobre 40rem queda la fórmula actual, porque el hexágono del escritorio depende de ella.
- **Enlaces de texto (`.btn-terciario`):** `min-height: 44px`, subrayado con `text-decoration` en vez de sombra, para que la línea siga pegada al texto.
- **Alto de pantalla:** `min-h-screen` pasa a `min-h-svh` en el body y en las páginas públicas, con respaldo `@supports not (height: 100svh) { .min-h-svh { min-height: 100vh } }`.
- **Notch y barra de gestos:** `viewport.viewportFit = 'cover'`.
  - Barra de WhatsApp y botón del chat: alto `3.5rem + env(safe-area-inset-bottom)` con relleno inferior.
  - Pie: reserva el mismo espacio.
  - Navbar: `padding-top: env(safe-area-inset-top)`.
  - Laterales con `env(safe-area-inset-left/right)` en `html`.
- **Táctil:** los `:hover` siguen solo con `(hover: hover)`, como ya hace Tailwind 4. Se agregan estados `active:` visibles en filas tocables (listas de precios, pie, guías).
- **Espaciado de secciones:** `py-16` pasa a `py-12` en celular. Desde `sm:` no cambia nada.

### 2. Contacto: un solo WhatsApp, menú y chat

- **Nueva clase `.btn-whatsapp`:** verde `whatsapp-solid` con el corte de la marca. La usa **todo** botón que abre WhatsApp: `CtaPair`, menú, navbar de escritorio y los "Cotizar …" rellenos. El azul `btn-primario` queda para acciones que no son WhatsApp.
  - **Por qué verde:** el cliente llega desde WhatsApp y reconoce el verde al instante, y la barra fija ya es verde. El azul sigue en la marca (logo, enlaces, chat, banda de Instagram).
- **En celular `CtaPair` oculta su botón de WhatsApp** (`max-sm:hidden`), porque la barra fija ya está siempre visible. Así se evita mostrar dos botones iguales en la misma pantalla y "Agendar" sube.
- **Menú móvil:**
  - Ocupa toda la pantalla bajo el navbar (`fixed`, alto `100dvh` menos el navbar, desplazable).
  - Bloquea el desplazamiento del fondo y cierra con Esc.
  - Mientras está abierto oculta `.fab` (`html[data-menu-abierto]`).
  - Mantiene los botones de WhatsApp (verde) e Instagram.
- **Chat en celular:** hoja inferior de ancho completo, sobre la barra fija. Desde `sm:` queda como hoy (340 px).

### 3. Portada (≤ 8 pantallas a 360 px)

- **Hero:**
  - El hexágono de celular deja de salirse por la derecha (`right: 0`) y es algo más chico.
  - El relleno inferior del título se ajusta a ese tamaño.
  - Orden en celular: título, lista de 4 precios, sellos, texto y "Agendar".
- **`ServiciosDestacados`** deja de repetir lo que ya muestra el hero. Excluye `mantencion-full`, `consola-ps5` y `armado-estandar` y muestra el resto (Lógica, Diagnóstico, GPU…) como lista compacta, con el título "Otros servicios con precio fijo".
  - Se quita la tarjeta grande con foto, porque repetía la Mantención Full ($75.000 = "Mantención de PC gamer" del hero).
  - Cambia también en escritorio, porque era repetición en todos los anchos.
- **`PorQueElegirnos`:** en celular muestra 3 razones; las 6 siguen desde `sm:`.
- **`GuiasBlog`:** en celular, 2 guías sin la descripción.
- **`Proceso`:** en celular, menos espacio entre pasos.

### 4. Páginas

- **`/servicios`:**
  - Barra de atajos horizontal y fija bajo el navbar (`sticky`), con un enlace por servicio (`#id`) y `scroll-margin` en cada artículo.
  - Foto de 128 px de alto en celular (hoy 176 px).
  - Se elimina el hueco entre la cabecera y la lista.
  - Las viñetas y notas pasan a 16 px.
- **`/agendar`:**
  - En celular, en vez de 4 botones de 12 px: "Paso N de 4 · Nombre" y la barra de progreso. Desde `sm:` siguen los botones, con 44 px de alto.
  - La tarjeta usa `p-5` en celular.
  - Etiquetas y descripciones a 16 px.
  - El botón "Siguiente" desactivado muestra la razón ("Elige un servicio").
- **Landings (`ServiceLanding`):**
  - Bajo el título: "Desde $X · {plazo}", tomado de `precios[0]` si existe.
  - En celular, "Qué incluye" va antes de los párrafos (`order-first lg:order-none`).
- **Pie:**
  - En celular, Navegación y Servicios van en 2 columnas.
  - Filas de enlace de 44 px.
  - Logo de 112 px.
  - Contacto antes de las listas en celular.
- **Formularios:**
  - `inputmode="tel"` en los teléfonos.
  - `enterkeyhint` en el último campo.
  - Casillas de "usos" con fila tocable de 44 px.

### 5. Movimiento

- **Lo que se conserva:** las entradas CSS actuales, con `prefers-reduced-motion` ya respetado.
- **Lo que se agrega:** solo el fundido del menú y la hoja del chat, que ya existen; en ambos se revisa que respeten la preferencia.

## Lo que queda al implementador

- Los nombres de clase concretos, mientras salgan de tokens: no se escriben colores hex.
- El orden exacto de los commits por bloque.
- Las medidas finas (alto del hexágono, separación de los atajos), siempre que cumplan los criterios de éxito.

## Verificación

1. Las pruebas de siempre: `npx tsc --noEmit`, `npm run lint` y `npm run build`.
2. Contra `next start` local: `AUDIT_BASE_URL=http://localhost:3000 AUDIT_ETAPA=despues npx playwright test prod.movil`. La prueba es de solo lectura y no envía formularios.
3. Comparar contra `docs/movil/datos/antes/` y revisar a mano las capturas de 360 y 1440 px.
4. Lighthouse móvil "después" contra la Preview de Vercel de la rama.
