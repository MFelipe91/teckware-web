# Auditoría móvil — teckware.cl

> Bloque 1 del trabajo en celular (rama `feat/movil`). Diagnóstico de producción
> (`https://www.teckware.cl`) del 2026-11-06, **antes** de corregir. Este bloque no cambia código del sitio.

## Cómo se midió

- **Prueba:** `tests/auditoria/prod.movil.spec.ts`. Corre solo lectura con Playwright, con la analítica bloqueada. Para repetirla:
  `npx playwright test prod.movil` (con `AUDIT_ETAPA=despues` genera la medición "después").
- **Páginas:** 24. Son 14 principales (portada, Mantención, Servicios, Empresas, PC Gamer, Agendar, Solicitar, Contacto, Nosotros, Blog, una guía, Web & QA, Ciberseguridad y la 404) más las 10 landings de `lib/landings.ts`.
- **Anchos:** 360, 375, 390 y 412 px, en modo celular táctil. Se agregan 768 y 1440 px para comparar.
- **Qué se mide en cada página y ancho:**
  - Desplazamiento horizontal.
  - Textos de menos de 16 px.
  - Títulos cortados.
  - Botones y enlaces de menos de 44×44 px, o a menos de 8 px de otro.
  - Choques entre el menú, la barra de WhatsApp y el chat.
  - Si el pie queda tapado.
  - El título (H1) en la primera pantalla.
  - Los campos de formulario.
  - Imágenes sobredimensionadas.
  - CLS, recorriendo la página completa.
- **Resultados guardados:**
  - Datos: `docs/movil/datos/antes/<ancho>.json`.
  - Lighthouse móvil: `docs/movil/datos/antes/lighthouse.json` (mediana de 3 corridas).
  - Capturas: `docs/movil/antes/pantalla/` (primera pantalla) y `docs/movil/antes/completa/` (página entera).
- Las capturas se revisaron una por una a 360 px, que es el peor caso.

## Resumen

La parte **técnica** del móvil está bien. En los 6 anchos:

- No hay desplazamiento horizontal.
- El diseño no salta mientras carga (CLS 0,000).
- No hay errores de JavaScript.
- El título se ve en la primera pantalla de todas las páginas.
- Los campos de formulario miden 16 px y tienen etiqueta.
- Los elementos fijos no chocan entre sí.

El problema de que "se ve mal en el celular" está en el **diseño para pantalla chica**:

- **Páginas demasiado largas:** 12,6 pantallas la portada y 14,2 Servicios.
- **Información repetida.**
- **Letra de 13–14 px** en casi todos los textos de apoyo.
- **Enlaces de 24–28 px de alto**, difíciles de tocar con el dedo.
- **Dos colores para el mismo botón de WhatsApp.**
- **Un menú que no se siente como una app.**

En celular el escritorio no se "rompe"; simplemente se apila, sin adaptarlo.

| Gravedad | Cantidad | Qué es |
|---|---|---|
| Crítico | 0 | Nada impide usar el sitio |
| Alto | 5 | Afecta a todo cliente que llega desde Instagram o WhatsApp |
| Medio | 7 | Molesta en páginas concretas |
| Bajo | 5 | Detalles y requisitos técnicos |

---

## Alto

### A1. La portada mide 12,6 pantallas a 360 px y repite los precios
- **Dónde:** `/` en todos los anchos de celular (11,2 pantallas a 390 px y 10,2 a 412 px). Captura `completa/home-360.jpg`.
- **Qué pasa:** la portada muestra la lista de 4 precios (`Hero`). Una pantalla más abajo vuelve a listar los mismos servicios con precio en "Precios fijos, sin sorpresas" (`ServiciosDestacados`). Después vienen "Cómo funciona" (4 pasos), Instagram, "Quién trabaja" (6 razones), PC Gamer, Soporte para empresas, 3 guías y el cierre. En el celular cada bloque ocupa 1 a 2 pantallas completas. Quien llega desde Instagram tiene que desplazarse mucho para encontrar algo que no vio arriba.
- **Causa:** `app/page.tsx:27-34` apila 8 secciones pensadas para escritorio, donde se ven en 6 pantallas. `components/home/ServiciosDestacados.tsx:29` repite la tabla de precios de `components/home/Hero.tsx:10-16`.
- **Propuesta:**
  - En celular, dejar una sola lista de precios.
  - Compactar "Quién trabaja" a 3 razones.
  - Mostrar las guías como carrusel horizontal o con un solo enlace.
  - Meta: 7 pantallas o menos a 360 px.

### A2. Textos de 13–14 px en todo el sitio
- **Dónde:** las 24 páginas y los 4 anchos de celular. Hay 15 a 48 textos por página bajo 16 px. En `/servicios` hay 37 textos de 13 px y 14 de 12 px (listas con ✓ y notas "ⓘ").
- **Ejemplos:** las descripciones de la portada ("Test, limpieza, pasta Thermal Grizzly…") a 14 px; los sellos ("Entrega en 48 h hábiles", "Con boleta") a 14 px; los enlaces del pie a 14 px.
- **Causa:** se usan `text-sm` (14 px) y `text-xs` (12 px) sin variante por tamaño de pantalla. Son 49 usos de `text-xs`, 9 de `text-[10px]` y otros `text-[11px]`, `text-[13px]` y `text-[0.8rem]` en `components/` y `app/`.
- **Propuesta:**
  - Escala de texto con `clamp()` en `app/globals.css`, donde el cuerpo y las descripciones nunca bajan de 16 px.
  - Reservar 14 px solo para etiquetas cortas (precio "desde", "Paso 1") y nunca para frases.

### A3. Enlaces y botones chicos o pegados (24–36 px de alto)
- **Dónde:** todas las páginas, con 25 a 36 casos por página.
  - **Pie:** cada enlace mide 28 px de alto y no hay separación entre uno y otro. Son unos 20 por página, porque el pie se repite en todas. Causa en `components/layout/Footer.tsx:51` y `:63` (`inline-block py-1`).
  - **Enlaces "Cotizar", "Solicitar", "Ver precios" y "Ver todos los servicios":** miden 27 px de alto. Causa en `.btn-terciario`, `app/globals.css:254-257`, con `min-height: 0` y `padding: 0.25rem 0`.
  - **Pasos de `/agendar` ("Servicio · Equipo · Agenda · Resumen"):** son botones de 24 px de alto con letra de 12 px. Causa en `app/agendar/page.tsx:253`.
  - **Casillas de "usos" en la cotización de PC Gamer:** miden 20×20 px (`components/builds/CotizacionForm.tsx:118`). La etiqueta también es tocable, pero la fila no llega a 44 px.
  - **Logo del navbar:** 36 px de alto.
- **Propuesta:**
  - Mínimo 44×44 px para todo lo tocable y 8 px entre objetivos.
  - En `.btn-terciario`, `min-height: 44px` con el área ampliada, manteniendo el aspecto de enlace.
  - Pie con filas de 44 px.
  - Pasos de agenda como barra de progreso legible.

### A4. El botón de WhatsApp tiene dos colores
- **Dónde:** todas las páginas en celular. Capturas `pantalla/home-360.jpg` y `pantalla/home-menu-360.jpg`.
- **Qué pasa:** la barra fija inferior es **verde** WhatsApp ("Escríbenos por WhatsApp"). El mismo botón dentro de la página, en el menú y en las landings es **azul** de la marca, con el mismo texto. El cliente ve dos botones iguales con distinto color y no sabe si hacen lo mismo. Con el menú abierto aparecen los dos a la vez.
- **Causa:** `components/layout/WhatsAppFloat.tsx:11` (`bg-whatsapp-solid`) contra `.btn-primario`, usado en `CtaPair`, `Navbar.tsx` y `BandaCta`.
- **Propuesta:** un solo estilo para "WhatsApp" en todo el sitio. Recomendación: verde, porque el usuario lo reconoce al instante. Mientras la barra fija esté visible, no repetir el botón grande en la misma pantalla.

### A5. El pie ocupa unas 2 pantallas en celular
- **Dónde:** todas las páginas. Captura `completa/home-360.jpg`, parte final.
- **Qué pasa:** el pie lista uno debajo de otro el logo grande, el lema, el RUT, Instagram, 10 enlaces de navegación, 10 servicios y 4 datos de contacto. A 360 px eso son unos 1.600 px. En páginas cortas, como `/contacto` o `/agendar`, el pie es más largo que el contenido.
- **Causa:** `components/layout/Footer.tsx` usa una sola columna en celular (`grid-cols-1`).
- **Propuesta:**
  - Navegación y servicios en 2 columnas, o como acordeones (`<details>`).
  - Logo más chico.
  - Contacto primero.

---

## Medio

### M1. El menú móvil no se comporta como un menú de app
- **Dónde:** captura `pantalla/home-menu-360.jpg`.
- **Qué pasa:** el menú mide 491 px y debajo se sigue viendo la portada. La página se sigue desplazando detrás (no bloquea el scroll) y la barra verde de WhatsApp sigue visible, junto al botón azul de WhatsApp del menú.
- **Causa:** `components/layout/Navbar.tsx:79-104`.
- **Propuesta:**
  - Menú a pantalla completa (`100dvh`), con el fondo bloqueado y la barra fija oculta mientras está abierto.
  - Cerrar con Esc y al tocar fuera.
  - Enlaces grandes.

### M2. `/servicios` mide 14,2 pantallas y no tiene atajos
- **Dónde:** `/servicios` a 360 px. Captura `completa/servicios-360.jpg`.
- **Qué pasa:** 9 servicios, cada uno con una foto de unos 280 px de alto, descripción, 3–4 viñetas, una nota y el precio con botón. No hay forma de saltar al servicio que interesa. Además hay unos 130 px vacíos entre el título y el primer servicio.
- **Propuesta:**
  - Barra de atajos horizontal, por ejemplo "PC gamer · Notebook · PS5 · Formateo · Armado", que lleve a cada servicio.
  - Foto más baja en celular (16:9 → 3:1) o solo en el servicio destacado.
  - Quitar el espacio vacío.

### M3. `/agendar`: pasos apretados y formulario angosto
- **Dónde:** captura `completa/agendar-360.jpg`.
- **Qué pasa:**
  - Los 4 pasos (12 px) llegan hasta el borde derecho ("Resumen" queda pegado).
  - El formulario va dentro de una tarjeta con su propio margen, lo que quita unos 40 px de ancho útil a 360 px.
  - El botón "Siguiente" desactivado casi no se distingue del fondo.
- **Propuesta:**
  - En celular, mostrar "Paso 1 de 4 · Servicio" con barra de progreso.
  - Tarjeta sin margen interno extra bajo 640 px.
  - Estado desactivado con texto explicativo ("Elige un servicio").

### M4. Portada: la acción principal no aparece en la primera pantalla
- **Dónde:** `/` en todos los anchos de celular. Captura `pantalla/home-360.jpg`.
- **Qué pasa:** la primera pantalla es el título (5 líneas a 40 px), el hexágono con la foto **cortado en el borde derecho** y el inicio de los precios. Los botones "Escríbenos por WhatsApp" y "Agendar servicio" del contenido recién aparecen en la pantalla 2. Solo la barra fija ofrece una acción.
- **Causa:** `components/home/Hero.tsx:45` pone los precios primero en celular (`order-first`). `HeroFondo` posiciona el hexágono sobresaliendo a la derecha.
- **Propuesta:**
  - Título algo más compacto en celular (máximo 4 líneas).
  - Hexágono completo y más chico.
  - Una línea de propuesta más el botón "Agendar" visibles sin desplazarse. WhatsApp ya está en la barra fija.

### M5. Landings: nada visual ni precio en la primera pantalla
- **Dónde:** las 10 landings. Captura `completa/mantencion-pc-gamer-360.jpg`.
- **Qué pasa:** título, párrafo y dos botones. El precio y el "qué incluye" quedan 2–3 pantallas más abajo, después de 3 párrafos largos.
- **Causa:** `components/landing/ServiceLanding.tsx`.
- **Propuesta:**
  - Precio "desde" y plazo junto al título.
  - Mover los párrafos de texto después de "Qué incluye".

### M6. Altos de pantalla con `100vh`
- **Dónde:** `min-h-screen` en `app/layout.tsx:123` y en 17 páginas (`app/*/page.tsx`, `ServiceLanding.tsx`, `HubPage.tsx`).
- **Qué pasa:** hoy no produce saltos medibles (CLS 0), porque el contenido siempre es más alto que la pantalla. Aun así, `100vh` en iOS y en el navegador de Instagram cuenta la barra del navegador, y es frágil si una página queda corta, como la 404.
- **Propuesta:** `min-h-svh`, con `min-h-screen` como respaldo, según lo pedido en el Bloque 2.

### M7. Sin margen para el notch ni la barra de gestos
- **Dónde:** `app/layout.tsx:106-108` (no declara `viewportFit: 'cover'`), `WhatsAppFloat.tsx` y `ChatWidget.tsx`, donde no hay ningún `env(safe-area-inset-*)`.
- **Qué pasa:** hoy Safari deja la página encima de la barra de gestos, así que no tapa nada. Pero la barra fija queda pegada a la línea de inicio del iPhone y no se puede pintar la zona inferior con el color de la barra.
- **Propuesta:**
  - `viewportFit: 'cover'`.
  - Barra fija con `padding-bottom: env(safe-area-inset-bottom)`.
  - Navbar con `env(safe-area-inset-top)`.

---

## Bajo

- **B1. Chat abierto:** el panel mide 340×460 px y a 360 px tapa el título de la portada. No choca con WhatsApp y cabe en pantalla. Se puede dejar como hoja inferior de ancho completo en celular (`ChatWidget.tsx:101`, `w-[340px]`).
- **B2. 768 px (tablet):** el hexágono queda cortado a la derecha y hay un espacio vacío grande a la derecha del título. El menú sigue siendo hamburguesa hasta 1024 px. Corresponde al Bloque 3.
- **B3. Escritorio 1440 px:** sin problemas. CLS de la portada 0,047 (bajo 0,1) y todo en la primera pantalla. Mantenerlo como está.
- **B4. Formularios (bien):** en `/solicitar` y la cotización, los campos miden 16 px (sin zoom de iOS), tienen etiqueta, 48–50 px de alto, `type="tel"`/`email` y `autocomplete` correcto. Solo falta `inputmode="tel"` explícito y `enterkeyhint` en el último campo.
- **B5. Imágenes (bien):** ninguna está sobredimensionada más de 1,6× ni sin dimensiones, todas pasan por `next/image` y no hay saltos al cargar.

## Lo que está bien y se mantiene

- No hay desplazamiento horizontal en ninguna página ni ancho.
- CLS 0,000 en celular en todas las páginas.
- El H1 entra completo en la primera pantalla de las 24 páginas, en los 6 anchos.
- La barra de WhatsApp y el chat no se tapan entre sí, y el pie no queda escondido bajo la barra (`Footer.tsx:12` reserva `pb-14`).
- Los efectos al pasar el mouse no se activan en pantallas táctiles: Tailwind 4 aplica `hover:` solo con `@media (hover: hover)`.
- Las animaciones respetan "reducir movimiento" (`app/globals.css:324`, `:389` y `:489`).
- No hay colores hex escritos a mano: todo sale de los tokens.

## Lighthouse móvil (antes)

Mediana de 3 corridas, perfil móvil de Lighthouse 13 (celular de gama media con red 4G lenta) y analítica bloqueada.

| Página | Rendimiento | LCP | CLS | TBT | Accesibilidad | SEO | Peso |
|---|---|---|---|---|---|---|---|
| `/` | 97 | 1,7 s | 0 | 131 ms | 100 | 100 | 435 KB |
| `/mantencion` | 92 | 1,9 s | 0 | 249 ms | 100 | 100 | 449 KB |
| `/agendar` | 93 | 1,6 s | 0 | 273 ms | 100 | 100 | 464 KB |
| `/mantencion-pc-gamer` | 92 | 1,8 s | 0 | 302 ms | 100 | 100 | 450 KB |
| `/servicio-tecnico-computadores-la-serena` | 94 | 1,7 s | 0 | 247 ms | 100 | 100 | 450 KB |

Velocidad, accesibilidad y SEO ya están en verde: el Bloque 2 no debe empeorarlos (meta: LCP ≤ 2,5 s, CLS < 0,1, Accesibilidad y SEO 100). El TBT de 250–300 ms en las landings es lo único a vigilar.

## Orden de corrección propuesto (Bloque 2)

1. **Base:** escala de texto fluida de 16 px o más (A2), áreas táctiles de 44 px (A3), `svh`, `safe-area` y `viewport-fit` (M6, M7). Son cambios en `globals.css` y en el layout que corrigen todo el sitio a la vez.
2. **Contacto:** un solo botón de WhatsApp (A4), menú a pantalla completa (M1) y chat como hoja inferior (B1).
3. **Portada:** acortar a 7 pantallas o menos (A1) y primera pantalla con acción (M4).
4. **Páginas:** atajos en `/servicios` (M2), pasos de `/agendar` (M3), landings con precio arriba (M5) y pie compacto (A5).
5. **Cierre:** medición "después" con la misma prueba y Lighthouse, y Preview para revisar en el celular.
