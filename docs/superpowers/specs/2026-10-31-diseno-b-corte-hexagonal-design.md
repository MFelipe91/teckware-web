# Bloque B: dirección "Corte hexagonal" (elegida por el dueño)

Maqueta y alternativas en `docs/auditoria/direcciones/`.

## Decisiones del dueño
- Dirección B: navy del logo, titulares plateados a todo el ancho y corte a 45° del hexágono como forma propia.
- Sistema de botones: primario (WhatsApp), secundario (Agendar), terciario (enlace). Mismo alto, peso y forma en todo el sitio, con estados hover, foco, presionado y desactivado.
- Cero colores hex fuera de `app/globals.css`.
- Prohibido: degradados morados o arcoíris, neón, glassmorphism, todo centrado, filas de 3 tarjetas idénticas, emojis como íconos, relleno de marketing, animaciones en cada elemento, badges sin respaldo.

## Decisiones de ejecución (mías)
- Tipografías: Saira (titulares, botones, precios) e IBM Plex Sans (texto), con `next/font`.
- Se eliminan `CircuitBackground`, halos, `glass-card`, degradados de texto y el morado de PC Gamer.
- Se eliminan las fotos de stock al 10–22 % de opacidad en las cabeceras: casi no se ven y eran el candidato a LCP.
- Cabeceras alineadas a la izquierda con un componente único (`PageHeader`).
- Precios y servicios en filas con líneas finas, no en tarjetas. Una sola banda plateada (`BandaCta`) cierra cada página.
- Fotos reales: `lib/fotos.ts` deja cada espacio en `null`; con foto se muestra y sin foto no se reserva un hueco vacío en producción.
- `/builds` solo recibe la limpieza general: su contenido se rehace en el Bloque C.
- Se aprovecha para resolver los hallazgos de accesibilidad y SEO de `docs/auditoria-cierre.md` que dependen del marcado.

## Listo cuando
- `tsc`, `lint` y `build` pasan, y se mantienen formularios, chat y `/admin`.
- 0 hex fuera de `globals.css`, 0 usos de los patrones eliminados.
- Sin scroll horizontal en 375 y 1440 px, y contraste AA en los pares nuevos.
- Se repiten las pruebas del Bloque A con `AUDIT_ETAPA=despues` para comparar.
