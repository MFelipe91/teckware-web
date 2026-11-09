# Plan de seguridad de teckware.cl

Actualizado: 2026-11-09. Objetivo: que el sitio, los formularios, el chatbot y tus cuentas no puedan
usarse para dañar a TECKWARE ni a tus clientes.

## 1. Lo que ya está aplicado en el sitio

### Navegador y servidor (cabeceras, `next.config.ts`)
| Protección | Qué evita |
|---|---|
| **HSTS con preload** (2 años, subdominios) | Que alguien fuerce una conexión sin HTTPS |
| **Content-Security-Policy** (scripts, imágenes y conexiones solo de orígenes permitidos; `object-src 'none'`; `upgrade-insecure-requests`; sin `unsafe-eval` en producción) | Inyección de scripts (XSS) y carga de código de terceros |
| **`frame-ancestors 'none'` y `X-Frame-Options: DENY`** | Que metan tu sitio dentro de otra página para engañar clics (clickjacking) |
| **`X-Content-Type-Options: nosniff`** | Que un archivo se ejecute como otro tipo |
| **`Cross-Origin-Opener-Policy: same-origin`** | Que otra pestaña manipule tu sitio |
| **`Referrer-Policy` estricta y `Permissions-Policy`** (sin cámara, micrófono ni ubicación) | Fugas de datos de navegación y acceso a sensores |
| **Sin `X-Powered-By`** | Dar pistas de la tecnología a un atacante |

### Formularios y APIs (`app/api/*`, `lib/security.ts`)
- **Solo desde el propio sitio.** `/api/chat`, `/api/solicitudes`, `/api/cotizaciones` y `/api/upload` rechazan llamadas que vienen de otras webs (`mismoOrigen`).
- **Límite de uso por IP.** Los formularios aceptan 10 por minuto. El chat acepta 15 por minuto y 80 por hora. Esto frena bots y abusos.
- **Validación en el servidor con Zod.** Nombres, teléfonos chilenos, largos máximos y rutas de fotos con formato fijo. Nada depende de que el navegador valide.
- **Fotos.** Se guardan en un bucket privado de Supabase con tipos y tamaño limitados.
- **Panel `/admin`.** Usa contraseña desde la variable de entorno, sin contraseña de respaldo, con límite de intentos.

### Chatbot Teck (`app/api/chat/route.ts`, `lib/chat-filtros.ts`)
- **Filtro de entrada.** Los intentos de cambiarle el rol o sacarle sus instrucciones ("ignora las instrucciones", "system prompt", "modo desarrollador", etc.) reciben una respuesta fija y **no llegan a la IA**.
- **Datos sensibles.** Los números de tarjeta y las contraseñas se ocultan antes de enviarse a la IA, y se le avisa al usuario.
- **Reglas de seguridad en sus instrucciones.** Solo habla de TECKWARE, nunca revela sus instrucciones, no pide datos bancarios ni contraseñas y no escribe código.
- **Filtro de salida.** Solo permite enlaces a teckware.cl y al WhatsApp oficial. Si la respuesta contiene trozos de las instrucciones, no se muestra.
- **Límites.** Historial de 10 mensajes, 600 caracteres por mensaje y 20 s de espera máxima.
- **Pruebas.** `node --test tests/unit/chat-filtros.test.mjs`.

## 2. Lo que debes activar tú (cuentas)

Los ataques reales a una pyme casi siempre entran por una cuenta, no por el código.

- [ ] **Verificación en dos pasos (2FA)** en GitHub, Vercel, Cloudflare, Google (Search Console, Analytics, Perfil de Empresa), Supabase, Groq e Instagram. Usa una app autenticadora, no SMS.
- [ ] **Contraseñas únicas y largas** en cada servicio, guardadas en un gestor de contraseñas.
- [ ] **Cloudflare.** Activa *Bot Fight Mode*, en Seguridad → Bots. Si algún día pasas el sitio por el proxy de Cloudflare (nube naranja), activa también las reglas WAF gratuitas.
- [ ] **Supabase.** Revisa que todas las tablas tengan **RLS activado** (Table editor → cada tabla → "RLS enabled"). El sitio escribe con la clave de servicio desde el servidor; el navegador no debe poder leer solicitudes.
- [ ] **Vercel.** Confirma que `ADMIN_PASSWORD` sea larga (16 caracteres o más) y que las Preview mantengan la protección con inicio de sesión de Vercel.
- [ ] **Rotación de claves** cada 6 meses, o de inmediato si sospechas una filtración: `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY` y `ADMIN_PASSWORD` (en Vercel, Settings → Environment Variables).
- [ ] **Correo `@teckware.cl`.** Activa SPF, DKIM y DMARC en Google Workspace y Cloudflare, para que nadie envíe correos falsos a tu nombre.

## 3. Rutina de mantenimiento

| Cada | Qué hacer |
|---|---|
| Mes | Revisar en Vercel los registros de errores 4xx/5xx raros y las alertas de Supabase |
| Mes | Pedir a Claude `npm audit` y actualizar dependencias con parches de seguridad |
| 3 meses | Revisar quién tiene acceso a GitHub, Vercel, Supabase y Cloudflare, y quitar accesos que sobren |
| 6 meses | Rotar las claves de la sección 2 |

## 4. Si algo pasa (respuesta a incidentes)

1. **Contener.** Cambia la contraseña de la cuenta afectada, cierra las sesiones activas y rota las claves de la sección 2.
2. **Revertir.** En Vercel → Deployments, "Promote to Production" de la versión anterior sana. Toma un minuto.
3. **Revisar.** Revisa los registros de Vercel y Supabase (qué IP, qué ruta, desde cuándo).
4. **Avisar.** Si se expusieron datos de clientes (nombre o teléfono de solicitudes), avísales y deja registro de lo ocurrido.
5. **Corregir.** Corrige la causa y documenta aquí qué pasó y qué se cambió.

## 5. Pendientes técnicos (siguientes mejoras)

- Llevar el límite de uso por IP a un almacén compartido (Upstash Redis o una tabla en Supabase), porque el actual es por instancia del servidor.
- Usar CSP con *nonce* para quitar `'unsafe-inline'` de los scripts. Requiere ajustar el layout de Next.
- Agregar un *captcha* invisible (Cloudflare Turnstile) a `/agendar` y `/solicitar` si aparecen envíos falsos.
