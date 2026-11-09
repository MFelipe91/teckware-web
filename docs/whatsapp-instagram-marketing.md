# WhatsApp, Instagram y clientes: guía de TECKWARE

Actualizado: 2026-11-09. Reemplaza a `whatsapp-business-kit.md` y `whatsapp-business-mensajes.md`, que
tenían datos viejos: horario de sábado, dirección pública, visita a domicilio ofrecida como normal y
precios antiguos.

**Idea central:** automatiza lo repetitivo (saludar, pedir datos, precios, confirmar, avisar que está
listo) y guarda tu tiempo para lo que te diferencia: **el audio personal, de tú a tú**. El cliente
siente rapidez y, a la vez, que habla con el técnico, no con un robot.

> Si cambia un precio en el sitio (`lib/constants.ts`), actualiza también `/precios`.

---

## 1. Recomendación general: qué usar y qué no

| Herramienta | ¿Usar? | Por qué |
|---|---|---|
| **App WhatsApp Business** (gratis): bienvenida, ausencia, respuestas rápidas, etiquetas, catálogo y listas de difusión | **Sí, ya** | Cubre el 90 % de la automatización que necesitas, sin costo |
| **Meta Business Suite** (gratis): bandeja única para Instagram y WhatsApp, respuestas automáticas de Instagram y programación de posts | **Sí** | Respondes los mensajes de Instagram y WhatsApp desde un solo lugar y programas los posts de la semana |
| **API de WhatsApp con chatbot** (pagada, Twilio, 360dialog, etc.) | **Todavía no** | Cuesta por conversación, es impersonal y tu fuerte es el trato directo. Conviene recién con más de 20 o 30 chats nuevos al día |
| **Chatbot Teck del sitio** | **Ya está** | Responde precios y plazos en la web y deriva a WhatsApp |

El sitio ya envía mensajes **pre-escritos según el servicio**, por ejemplo: "Me interesa: *Mantención
Full* ($75.000 c/IVA)". Cuando llega uno así, ya sabes qué busca: responde con la respuesta rápida de
ese servicio.

---

## 2. Configuración de WhatsApp Business (una sola vez)

*WhatsApp Business → Configuración → Herramientas para la empresa.*

### Perfil
- **Descripción:** Mantención y servicio técnico de computadores en La Serena y Coquimbo. PC gamer,
  notebooks, MacBook y PS5. Taller con hora coordinada · Entrega en 48 h hábiles con informe técnico ·
  Garantía 30 días · Boleta.
- **Horario:** lunes a viernes, 10:00 a 18:30.
- **Dirección:** **no** la pongas. Se envía solo al confirmar la hora.
- **Sitio:** https://www.teckware.cl · **Correo:** mariofelipe@teckware.cl
- **Catálogo:** los servicios principales con su precio. Mantenlo igual que en `/servicios`.

### Mensaje de bienvenida
Se envía solo la primera vez que alguien escribe, o tras 14 días sin conversar.
```
¡Hola! 👋 Gracias por escribir a TECKWARE.
Para ayudarte rápido, cuéntame:
1️⃣ Qué equipo es (PC, PC gamer, notebook, MacBook, consola) y su modelo
2️⃣ Qué le pasa o qué servicio buscas
3️⃣ Si puedes, una foto o video 📸
Te respondo con el servicio, el precio y cuándo podemos recibirlo. 🔧
```

### Mensaje de ausencia
Elige *Fuera del horario comercial*.
```
¡Hola! Ahora estamos fuera de horario (lunes a viernes, 10:00–18:30). 🌙
Déjame el detalle de tu equipo y qué le pasa, y te respondo apenas abramos.
Mientras, puedes ver precios en www.teckware.cl/servicios o agendar en www.teckware.cl/agendar
```

### Etiquetas: tu "embudo" de clientes
`🟡 Nuevo` → `🔵 Cotizado` → `🟣 Agendado` → `🟠 En taller` → `🟢 Listo` → `✅ Entregado`, y además
`🏢 Empresa` y `🔁 Recordar mantención`.
En la pestaña de chats filtras por etiqueta y ves en qué etapa está cada uno.

---

## 3. Respuestas rápidas

En el chat escribes `/` y eliges el atajo. Los textos entre [CORCHETES] se completan a mano.

### Para entender qué busca el cliente (levantamiento de requerimientos)

**`/datos`**: cuando no queda claro qué necesita.
```
Para darte el precio exacto necesito:
• Equipo, marca y modelo
• Qué le pasa y desde cuándo
• ¿Se calienta, hace ruido o se apaga solo?
• ¿Tuvo golpes o le cayó líquido?
• ¿Tienes archivos importantes sin respaldo?
• Tu nombre y comuna 🙌
```

**`/pc`**: PC gamer o de escritorio.
```
¡Buenísimo! Para tu PC cuéntame:
• ¿Hace cuánto no tiene mantención?
• ¿Qué temperaturas o problemas notas (ruido, lentitud, se apaga, baja FPS)?
• Procesador y tarjeta de video, si los sabes
Nuestra Mantención Full ($75.000) incluye test inicial, limpieza profunda, pasta Thermal Grizzly, BIOS al día, respaldo + Windows limpio y test final. Entrega en 48 h hábiles con informe y garantía de 30 días.
```

**`/notebook`**
```
Para tu notebook cuéntame marca, modelo y qué le pasa (se calienta, ventilador ruidoso, lento, no enciende).
La mantención física con pasta térmica es la Mantención Full ($75.000), y si solo necesitas formateo e instalación limpia, la Mantención Lógica ($35.000). Ambas con informe técnico y 30 días de garantía.
```

**`/ps5`**
```
La mantención de PS5 ($80.000) incluye limpieza interna y cambio de metal líquido; PS4/PS3 $55.000.
¿Tu consola se calienta, hace mucho ruido o se apaga? Cuéntame y vemos si es lo que necesita. 🎮
```

**`/armado`**: PC a pedido.
```
¡Vamos con tu PC! 🖥️ Para proponerte una configuración real cuéntame:
• Presupuesto aproximado
• Qué juegas o usas (y en qué resolución: 1080p, 1440p, 4K)
• Si ya tienes alguna pieza (gabinete, fuente, monitor)
El armado con cable management y pruebas de estrés es $75.000 (alta gama $90.000). Si prefieres, completa el formulario en www.teckware.cl/builds
```

**`/empresa`**
```
Para tu empresa cuéntame:
• Cuántos equipos son y de qué tipo
• Qué necesitas (mantención preventiva, soporte, redes, asesoría o automatización)
• Comuna
Te preparo una propuesta por escrito con precio claro y boleta/factura.
```

**`/wifi`**
```
Para revisar tu WiFi cuéntame: si es casa u oficina, comuna, en qué parte no llega la señal o se corta, y qué router tienes (si sabes).
Se cotiza según el lugar y los equipos; te doy el valor antes de empezar.
```

### Para cerrar y coordinar

**`/precios`**
```
Valores con IVA incluido y boleta:
• Mantención Full: $75.000
• Mantención Lógica (formateo): $35.000
• Diagnóstico: $30.000 (se descuenta si reparas con nosotros)
• Mantención GPU: desde $45.000
• PS5: $80.000 · PS4/PS3: $55.000
• Recuperación de datos: desde $35.000
• Armado PC gamer: $75.000 · alta gama $90.000
Entrega en 48 h hábiles con informe técnico y 30 días de garantía. Pagas al retirar.
```

**`/taller`**
```
Trabajamos en nuestro taller en La Serena, con hora coordinada. ¿Qué día y horario te acomoda para traerlo? Te confirmo la hora y te envío la dirección. 📍
```

**`/confirmar`**
```
¡Listo! Te espero el [DÍA] a las [HORA] en [DIRECCIÓN]. ✅
Trae tu equipo con su cargador. Lo revisamos juntos al recibirlo y te lo entrego en 48 horas hábiles con informe técnico.
```

**`/recordatorio`**: el día antes de la cita.
```
¡Hola [NOMBRE]! Te recuerdo tu hora de mañana [DÍA] a las [HORA] en el taller. Si necesitas cambiarla, avísame por aquí. 🙌
```

**`/recibido`**: al recibir el equipo.
```
Recibimos tu [EQUIPO] ✅ Ya comenzamos el test inicial. Te aviso cualquier novedad antes de hacer algo fuera de lo cotizado.
```

**`/listo`**
```
¡Tu equipo está listo! ✅ Quedó probado y estable; te adjunto el informe técnico.
Coordinemos la hora de retiro. Pagas al retirar y emitimos boleta.
```

**`/resena`**: al entregar. Es lo que más te sube en Google Maps.
```
¡Gracias por confiar en TECKWARE! 🙌 Si quedaste conforme, una reseña en Google nos ayuda muchísimo (toma 1 minuto): [ENLACE DE LA FICHA]
Y si quieres ver más trabajos, estamos en Instagram @teckware.cl
```

**`/domicilio`**
```
La visita a domicilio es solo para trabajos simples, como formateo o configuración, con un recargo según día, horario y distancia. Los trabajos de hardware los hacemos en el taller para hacerlos bien. ¿Qué necesitas y en qué comuna?
```

---

## 4. Tu flujo con cada cliente (dónde va el audio personal)

1. **Llega el mensaje.** Sale la bienvenida automática, o el cliente viene con el mensaje del sitio. Etiqueta `🟡 Nuevo`.
2. **Entiendes qué busca.** Usas `/pc`, `/notebook`, `/ps5`, `/armado`, `/empresa`, `/wifi` o `/datos`.
3. **🎙️ Audio personal (30 a 60 s).** Es tu sello. Estructura que funciona:
   - Saludo con su nombre: "Hola Juan, te habla Mario de TECKWARE".
   - Lo que entendiste de su problema, en simple.
   - Lo que recomiendas y por qué: "por lo que me cuentas, lo que necesita es…".
   - Precio y plazo: "son $75.000, te lo entrego en 48 horas hábiles con informe y garantía".
   - Cierre con pregunta: "¿qué día te acomoda traerlo?".
4. **Precio por escrito.** Siempre deja el valor por escrito después del audio (`/precios` o el de su servicio), para que no haya dudas. Etiqueta `🔵 Cotizado`.
5. **Coordinas.** `/taller`, luego `/confirmar` (`🟣 Agendado`) y `/recordatorio` el día antes.
6. **En el taller.** `/recibido` (`🟠 En taller`). Si encuentras algo extra, otro audio corto antes de hacerlo.
7. **Entrega.** `/listo` con el informe (`🟢 Listo`). Al retirar, `/resena` (`✅ Entregado`).
8. **Seguimiento.** Ponle `🔁 Recordar mantención` y escríbele a los 6 a 12 meses (sección 6).

**Cotizados que no respondieron:** a las 48 h, un mensaje corto:
```
¡Hola [NOMBRE]! ¿Pudiste ver lo de tu [EQUIPO]? Si quieres te reservo una hora esta semana. 🙌
```
Un solo recordatorio; nunca insistas más.

---

## 5. Plan de marketing en Instagram

### Perfil (optimizarlo una vez)
- **Nombre:** `TECKWARE · Servicio técnico La Serena`. El campo "nombre" también se busca en Instagram.
- **Bio:**
  ```
  🔧 Mantención PC gamer · notebooks · PS5
  🖥️ Armados a pedido · 🏢 Empresas
  📍 La Serena y Coquimbo · Garantía 30 días
  👇 Agenda o cotiza
  ```
- **Enlace:** `https://www.teckware.cl/?utm_source=instagram&utm_medium=bio`. Así ves en Google Analytics cuántas visitas llegan desde Instagram.
- **Botones de contacto:** WhatsApp (el de la empresa) y correo.
- **Historias destacadas:** `Precios` · `Antes/Después` · `Armados` · `Reseñas` · `Cómo agendar` · `Empresas`.

### Pilares de contenido (qué publicar)
| Pilar | Ejemplos | Objetivo |
|---|---|---|
| **Antes / después** (el más fuerte) | Polvo dentro del PC, pasta seca, y la captura de temperaturas antes y después (OCCT/HWMonitor: "de 95 °C a 68 °C") | Mostrar el resultado real y vender mantención |
| **Armados** | Time-lapse del armado, cable management, primer encendido con RGB | Atraer gamers y ventas de armado |
| **Tips cortos** | "3 señales de que tu notebook necesita mantención", "¿cada cuánto cambiar la pasta?" (sale de las guías del blog) | Autoridad y alcance; se guardan y se comparten |
| **Detrás del taller** | Tu mesa, herramientas, el test con OCCT/FurMark, tú trabajando | Confianza: hay una persona real y experta |
| **Clientes** | Entrega del equipo y reseña de Google en pantalla, siempre con permiso | Prueba social real |
| **Empresas** | Mantención de una oficina, ordenar una red | Abrir el segmento pyme |

### Frecuencia (realista para una persona)
- **Reels:** 2 a 3 por semana, de 15 a 30 s, con gancho en el primer segundo:
  - "Mira lo que había dentro de este PC 😱"
  - "Así bajamos 25 °C a esta PS5"
  - "¿Tu notebook suena así? Escucha…"
- **Historias:** casi a diario y simples: lo que está en la mesa hoy, una encuesta ("¿Cada cuánto le haces mantención a tu PC?") o una caja de preguntas.
- **Carrusel:** 1 por semana con un tip o una comparación de precios.
- **Truco para tener material:** graba 10 a 20 segundos de video vertical de cada equipo que pasa por el taller. Con eso tienes contenido de sobra.

### Calendario base semanal
| Día | Publicación |
|---|---|
| Lunes | Reel antes/después de una mantención |
| Miércoles | Carrusel con un tip (desde una guía del blog) |
| Viernes | Reel de un armado o "detrás del taller" |
| Todos los días | 1 a 3 historias de lo que está en la mesa |

Programa los posts de la semana en Meta Business Suite, por ejemplo el domingo en 30 minutos.

### Automatización en Instagram (Meta Business Suite → Bandeja → Respuestas automáticas)
- **Respuesta instantánea a mensajes directos:** "¡Hola! Para atenderte más rápido escríbenos por WhatsApp 👉 wa.me/56930209427 o agenda en teckware.cl/agendar".
- **Preguntas frecuentes** como botones: "¿Precios?", "¿Dónde están?", "¿Cuánto demoran?".
- **Palabra clave en comentarios:** "Comenta **PRECIO** y te envío la lista por DM". Aumenta el alcance del post.

### Hashtags (5 a 8 por post; los locales pesan más)
`#LaSerena #Coquimbo #RegionDeCoquimbo #ServicioTecnico #PCGamer #MantencionPC #PS5 #ArmadoPC #SetupGamer #Chile`

### Crecer localmente
- **Colaboraciones** con gamers o streamers de la zona: mantención a cambio de una mención. También con tiendas de componentes y cibercafés.
- **Concurso** 1 o 2 veces al año: "Mantención gratis: sigue, comenta y etiqueta a 2 amigos de La Serena/Coquimbo". Revisa las reglas de Instagram para concursos.
- **Publicidad pagada (opcional):** cuando tengas 3 o 4 Reels que funcionen, promociónalos con $3.000 a $5.000 diarios durante 7 días, solo a La Serena y Coquimbo, en un radio de 15 km y entre 16 y 45 años. Mide cuántos WhatsApp llegan.

### Medir (una vez al mes, 15 minutos)
- Instagram → Estadísticas: alcance, seguidores nuevos, guardados y compartidos por post.
- Google Analytics: visitas con `utm_source=instagram` y clics en WhatsApp (`click_whatsapp`).
- Repite lo que funcionó y deja de hacer lo que no.

---

## 6. Plan de clientes (fidelizar y que vuelvan)

- **Registro simple:** una planilla de Google Sheets con estas columnas: fecha, nombre, WhatsApp, comuna, equipo, servicio, monto, próxima mantención, ¿reseña? y ¿cómo nos conoció? (Instagram, Google, sitio o recomendación).
- **Recordatorio de mantención:** a los 6 meses (gamers y uso intenso) o 12 meses (uso normal):
  ```
  ¡Hola [NOMBRE]! Ya pasaron [N] meses desde la mantención de tu [EQUIPO]. Es buen momento para revisarlo antes de que suba la temperatura. ¿Te reservo una hora esta semana? 🔧
  ```
- **Listas de difusión de WhatsApp:** `Clientes gamers`, `Clientes notebooks` y `Empresas`. Solo llegan a quienes guardaron tu número. Máximo 1 o 2 mensajes al mes y siempre útiles, por ejemplo: "esta semana tengo horas libres", "tip para el calor del verano".
- **Recomendados:** "Si un amigo viene de tu parte, a los dos les hacemos [BENEFICIO, por ejemplo, revisión de temperaturas gratis]". Esto sí está permitido. Lo que **no** se debe hacer es dar descuentos a cambio de reseñas en Google, porque Google lo castiga.
- **Fechas clave del año:**
  - Marzo, vuelta a clases: notebooks y formateo.
  - Vacaciones de invierno (julio): mantención de PC gamer y consolas.
  - Antes del verano (noviembre y diciembre): limpieza por calor.
  - Cyber Day y Black Friday: armados y upgrades.
- **Empresas:** después del primer trabajo, ofrece un plan de mantención preventiva cada 6 meses por escrito. Es ingreso recurrente.
- **Reseñas:** `/resena` a cada cliente conforme. Meta: 5 reseñas nuevas al mes en la Ficha de Google; respóndelas todas.

---

## 7. Plan de 30 días para partir

| Semana | Tareas |
|---|---|
| 1 | Configurar WhatsApp Business (perfil, bienvenida, ausencia, respuestas rápidas y etiquetas). Optimizar la bio de Instagram, el enlace con UTM y las historias destacadas |
| 2 | Conectar Instagram y WhatsApp en Meta Business Suite y activar las respuestas automáticas. Crear la planilla de clientes |
| 3 | Grabar el material de 5 equipos del taller. Publicar 2 Reels y 1 carrusel. Pedir reseña a cada cliente |
| 4 | Revisar estadísticas, enviar el primer recordatorio de mantención a clientes antiguos y definir si promocionar el Reel que mejor funcionó |
