# Entorno automatizado TECKWARE: WhatsApp + asistente + n8n + MCP

> Diseño para revisión del dueño. Fecha: 2026-10-26 (v2, con las respuestas del dueño).
> Estado: **borrador, sin construir.** Nada se implementa hasta que el dueño apruebe este
> documento y existan las cuentas de la sección 9 (las crea el dueño).

---

## 1. Para qué

Hoy toda la atención pasa por el WhatsApp del dueño, a mano. Cada cliente nuevo repite las
mismas preguntas (precio, plazo, cómo funciona) y hay que pedir uno por uno los datos del equipo.
El objetivo es un asistente que **responda al instante, a cualquier hora**, con el tono cercano de
TECKWARE, y **deje cada caso listo para que el dueño lo confirme**: necesidad clara, datos del
equipo, síntomas, fotos y horario preferido. **El asistente no confirma citas: propone y recaba;
el dueño confirma.**

**Éxito, medido:**
- El 100 % de los mensajes nuevos recibe respuesta en menos de 1 minuto, también fuera de horario.
- Al menos el 70 % de las consultas llegan al dueño como **solicitud completa**: equipo, marca y
  modelo, síntoma, servicio sugerido con precio oficial y horario preferido. Sin tener que
  preguntar nada más.
- El dueño confirma una solicitud en menos de 30 segundos: un toque en `/admin` o una frase a su
  Claude.
- Cero promesas falsas: el asistente solo usa precios, plazos y modalidad de `lib/constants.ts`
  (48 h hábiles, taller en La Serena, garantía 30 días, boleta).

**Lo que debe transmitir** (brief del dueño): confianza, cercanía, expertise, rapidez y
prevención.

## 2. Cómo trabaja TECKWARE (lo que el asistente debe saber)

- **Taller en La Serena con hora coordinada.** El cliente trae su equipo; la dirección se envía
  **solo cuando el dueño confirma la hora**. Nunca se publica ni la da el asistente.
- **A domicilio es poco común:** solo trabajos simples que el dueño sabe que resolverá (formateo,
  configuración) y **con recargo según ubicación**. Los trabajos de hardware se hacen en el taller.
  El asistente no ofrece el domicilio de entrada: lo menciona solo si el cliente lo pide y el
  trabajo es simple, y siempre como algo que el dueño decide.
- **Plazo:** el equipo se entrega terminado en **48 horas hábiles**, con diagnóstico real e
  informe técnico.
- Garantía 30 días, boleta, pago al retirar.
- **Capacidad: máximo 5 equipos por día** (confirmados + pendientes). El asistente no sugiere días
  llenos; si el cliente insiste, lo deja como pendiente para que el dueño decida.
- **El recargo a domicilio lo cotiza siempre el dueño** según día, horario y, sobre todo,
  distancia. El asistente nunca da un valor.

## 3. No-objetivos y anti-objetivos

- **No** confirma citas, no da la dirección y no cierra precios fuera de la lista: eso lo hace
  el dueño.
- **No** es un asistente general: solo temas de TECKWARE. Meta prohíbe en la WhatsApp Business
  Platform los asistentes de IA de propósito general; los de atención de un negocio sí están
  permitidos.
- **No** diagnostica a distancia: orienta, sugiere el servicio y su precio de lista, y deja claro
  que el diagnóstico real se hace en el taller.
- **No** cobra en línea (el sistema de pagos `feat/pagos` sigue archivado).
- **Anti-objetivo:** que el cliente sienta que habla con un robot torpe **o** que descubra que lo
  engañaron. El asistente conversa natural y cálido (frases cortas, español chileno, sin menús
  de "marque 1"), pero **se presenta como el asistente de TECKWARE y nunca dice ser una
  persona**. Si el cliente pregunta, lo reconoce y ofrece pasar con el dueño.
- **Anti-objetivo:** que el asistente siga hablando cuando el dueño ya tomó la conversación.

## 4. Arquitectura recomendada

```
Cliente (WhatsApp)                         Dueño (app WhatsApp Business en el celular)
      │                                              ▲  ve todo y responde cuando quiere
      ▼                                              │  (coexistencia: mismo número)
Meta WhatsApp Cloud API ──webhook──► n8n ───────────┘
                                      │  1. junta mensajes seguidos (espera ~8 s)
                                      │  2. ¿el dueño tomó el chat? → no responde
                                      │  3. llama al asistente
                                      ▼
                        teckware.cl/api/agente  (Next.js, Vercel)
                        Claude + herramientas propias:
                          · precios_y_plazos      (lee lib/constants.ts)
                          · horarios_disponibles  (Google Calendar, solo lectura: para sugerir)
                          · registrar_solicitud   (Supabase: cliente, equipo, síntomas, fotos,
                                                   servicio sugerido, horario preferido)
                          · estado_de_orden       (Supabase)
                          · pasar_a_humano        (marca el chat y avisa al dueño)
                                      │
                                      ▼
                        Supabase (historial, clientes, solicitudes, órdenes)
                                      ▲
Dueño confirma ──► /admin  o  "confirma la de Juan el martes 11:00" (su Claude, vía MCP)
                                      │
n8n ──────────────────────────────────┤  crea el evento en Google Calendar, envía al cliente la
                                      │  confirmación con la dirección del taller y qué traer;
                                      │  recordatorio 24 h antes; "tu equipo está listo" +
                                      │  informe técnico; pide reseña; resumen diario
n8n MCP Server ◄──── Claude (Desktop / Code) del dueño
```

### Por qué el asistente vive en el código y no dentro de n8n

n8n tiene un nodo "AI Agent", pero hoy hay tres riesgos concretos con los modelos actuales de
Claude:

1. **`temperature` rechazado.** Desde el 2026-10-21 la API rechaza `temperature`, `top_p` y
   `top_k`; muchos nodos los envían por defecto.
2. **Historial con razonamiento.** Los modelos actuales exigen devolver la respuesta completa en
   cada turno ("preserved thinking"). La memoria de n8n guarda solo el texto, y en cuentas nuevas
   editar el historial da error.
3. **Uso forzado de herramientas.** Forzar una herramienta (`tool_choice` de tipo `any`) da error
   en Opus 5.5.

Con el asistente en `app/api/agente` (SDK oficial `@anthropic-ai/sdk`, mismo repo):

- el historial se guarda completo en Supabase;
- los precios, plazos y la modalidad salen de `lib/constants.ts`, la misma fuente que el sitio;
- se prueba con conversaciones de ejemplo antes de tocar clientes reales;
- **el mismo cerebro atiende el chat de la web** (reemplaza a Groq).

n8n hace lo que mejor sabe: el canal de WhatsApp, decidir si responde el asistente o el dueño,
tareas programadas, Google y MCP.

## 5. Decisiones

| Tema | Decisión | Quién |
|---|---|---|
| Plazo | Trabajo completo en **48 h hábiles**, con diagnóstico real e informe técnico | Dueño |
| Confirmación | **El dueño confirma** cada cita; el asistente solo recaba y propone | Dueño |
| Modalidad | **Taller en La Serena** con hora coordinada; domicilio solo para trabajos simples, con recargo | Dueño |
| Número | El mismo **+56 9 3020 9427**, que sigue en la app **WhatsApp Business** (coexistencia) | Dueño |
| Agenda | **Google Calendar** (más copia en Supabase) | Dueño |
| Informe técnico | Estandarizar sobre los informes que el dueño ya usa (sección 8) | Dueño |
| Avisos al dueño | **Solo WhatsApp** a su número personal para cada solicitud nueva y cada caso derivado. Las citas confirmadas quedan en **Google Calendar** (Google Workspace) con su recordatorio estándar: notificación el mismo día (por defecto 1 h antes) | Dueño |
| Capacidad | Máximo **5 equipos por día** | Dueño |
| Recargo a domicilio | Lo cotiza el dueño caso a caso | Dueño |
| n8n | **n8n Cloud** para empezar: sin servidores que mantener | Mía |
| Cerebro | Asistente en Next.js con el SDK oficial de Anthropic | Mía |
| Modelo | **Claude Opus 5.5** (`claude-opus-5-5`) con esfuerzo `low`: el más capaz, para que suene natural y recabe bien los datos. Si el dueño prioriza costo: Sonnet 5.5 (`claude-sonnet-5-5`, ~mitad de precio) o Haiku 5.5 (`claude-haiku-5-5`, mucho más barato, conversa menos fino) | Mía; **el dueño decide si baja de modelo** |
| Tono | Natural y cercano, transparente sobre ser un asistente | Mía, por confianza y política de Meta |

## 6. Cómo conversa el asistente

**Presentación:** "¡Hola! Soy Teck, el asistente de TECKWARE 👋 Te ayudo con tu consulta y le
dejo todo listo a Mario para que te confirme. Si prefieres hablar directo con él, me dices."

**Lo que tiene que lograr:**
1. Entender qué necesita: mantención, reparación, armado, empresa u otra cosa.
2. Recabar el caso, de a una pregunta:
   - tipo de equipo, marca y modelo;
   - qué le pasa y desde cuándo (si se apaga, se calienta, no enciende, está lento, ruido…);
   - si hubo golpes o líquido, y si tiene datos importantes sin respaldo;
   - fotos o video (opcional);
   - nombre y comuna.
3. Sugerir el servicio y su precio **de la lista oficial**, explicando que el diagnóstico real se
   hace en el taller y que la entrega es en 48 horas hábiles con informe técnico. Si el caso no
   calza en la lista, dice "eso lo cotiza Mario".
4. Preguntar cuándo le acomoda traer el equipo. Puede sugerir 2–3 horarios libres del calendario
   (lunes a viernes, 10:00–18:30), pero **siempre como propuesta**: "Le paso tu solicitud a Mario
   y te confirma la hora y la dirección del taller por aquí".
5. Cerrar con un resumen corto y registrar la solicitud.

**Estilo:** mensajes cortos, como escribe una persona por WhatsApp. Una pregunta a la vez, usa el
nombre del cliente y empatiza ("uf, qué lata que no prenda"). Explica en simple y educa un poco
("la pasta térmica se seca con los años; por eso se calienta"). Sin tecnicismos de más ni exceso
de emojis.

**Pasa con el dueño (y se calla en ese chat) cuando:**
- el cliente lo pide o está molesto;
- es una empresa con varios equipos;
- pide domicilio;
- el caso no está en la lista;
- hay riesgo de datos (disco dañado, ransomware);
- no entiende después de dos intentos.

Le envía al dueño un resumen del caso.

## 7. Datos (Supabase)

Tablas nuevas, mínimas:

- `clientes`: teléfono (clave), nombre, comuna, empresa (opcional), creado.
- `solicitudes`: cliente, equipo (tipo, marca, modelo), síntomas, fotos (Storage), servicio
  sugerido, precio de lista, horario preferido, modalidad (taller/domicilio), estado
  (`pendiente` → `confirmada` / `descartada`).
- `ordenes`: nace de una solicitud confirmada.
  - Estados: `agendada` → `recibida` → `en_trabajo` → `lista` → `entregada`.
  - Guarda la recepción del equipo (sección 8), el informe técnico (PDF) y el id del evento en
    Google Calendar.
- `conversaciones`: teléfono, canal (whatsapp/web), mensajes completos del modelo, `humano_activo`
  (sí/no), actualizado.

El panel `/admin` existente suma:
- **Bandeja de solicitudes:** ver el caso, ajustar la hora y **Confirmar** (o descartar).
- **Órdenes:** cambiar el estado y cargar el informe.

## 8. Recepción del equipo e informe técnico estandarizados

Se propone un formato único con dos documentos que se arman desde la orden y salen como PDF con
el logo:

**A. Orden de recepción** (al recibir el equipo en el taller). Protege al dueño y al cliente:
- N.º de orden, fecha y hora, datos del cliente.
- Equipo: tipo, marca, modelo y n.º de serie.
- Accesorios recibidos: cargador, mouse, cables, bolso…
- Estado visible: golpes, rayas, piezas faltantes, con fotos.
- Falla declarada por el cliente.
- Si respaldar datos: sí/no. Contraseña: se pide solo si es necesaria.
- Servicio solicitado y precio de lista, plazo (48 h hábiles), garantía y condiciones
  (bodegaje según `/terminos`).
- Conformidad del cliente.

**B. Informe técnico** (al entregar):
- N.º de orden y equipo.
- Diagnóstico real: pruebas hechas y hallazgos.
- Trabajo realizado y repuestos usados.
- Mediciones cuando aplique: temperaturas, estado del disco o la batería.
- Fotos antes y después.
- **Recomendaciones de prevención y fecha sugerida para la próxima mantención** (alimenta el
  recordatorio automático: prevención como valor de marca).
- Garantía: 30 días desde la entrega. Firma TECKWARE SpA.

**Para estandarizar:** el dueño comparte 1–2 informes que ya usa. Se arma la plantilla sobre
ellos, conservando lo que le funciona, y su Claude puede redactar el borrador del informe desde
sus notas por MCP ("redacta el informe de la orden 123: cambié pasta, limpié ventiladores, bajó
de 92 a 71 °C").

## 9. Lo que tiene que hacer el dueño (cuentas y permisos)

Claude no crea cuentas ni acepta términos en nombre del dueño.

1. **Meta Business Manager** verificado a nombre de TECKWARE SpA.
2. **Conectar el número a la Cloud API en modo coexistencia** (la app WhatsApp Business sigue
   funcionando en el celular). Se hace con "Embedded Signup" desde un proveedor (BSP / Tech
   Provider) o desde n8n, según lo que se soporte al activarlo; lo vemos juntos en la fase 0.
   Antes, respaldar los chats.
3. **Cuenta de n8n Cloud** (no existe aún; tiene prueba gratis).
4. **Cuenta en la consola de Anthropic (console.anthropic.com)** con API key y límite de gasto
   mensual. **Ojo:** es distinta de la suscripción a Claude (claude.ai). Se factura aparte, por
   uso.
5. **Google Workspace** (ya existe): habilitar la API de Calendar en un proyecto de Google Cloud
   del mismo Workspace y autorizar el calendario de trabajo.
6. Aprobar el texto de las plantillas de Meta: confirmación con dirección, recordatorio, equipo
   listo y reseña.
7. Compartir 1–2 informes técnicos actuales.

## 10. Costos estimados (a confirmar con uso real)

Supuesto: 300 conversaciones al mes, ~10 mensajes cada una, prompt del sistema en caché.

| Concepto | Estimado mensual |
|---|---|
| Claude Opus 5.5 (esfuerzo bajo, caché) | ~US$ 40–70 |
| Alternativa Sonnet 5.5 | ~US$ 20–35 |
| Alternativa Haiku 5.5 | ~US$ 1–3 |
| n8n Cloud (plan de entrada) | verificar precio vigente |
| WhatsApp: respuestas a clientes | US$ 0 (dentro de las 24 h desde que escribe el cliente) |
| WhatsApp: plantillas (confirmación, recordatorio, listo, reseña) | según tarifa de Meta para Chile |
| Supabase / Vercel | planes actuales al inicio |

Precios por millón de tokens (entrada / salida), Claude API, 2026-10: Opus 5.5 US$4 / US$20 ·
Sonnet 5.5 US$2 / US$10 · Haiku 5.5 US$0,10 / US$0,50. Las cifras de la tabla son gruesas; en la
fase 1 se miden con el uso real antes de elegir el modelo final.

## 11. Fases

| Fase | Entrega | Depende de |
|---|---|---|
| 0. Cuentas | Sección 9 lista; coexistencia probada con un número de prueba | Dueño |
| 1. Cerebro | `/api/agente` con herramientas, prompt y **set de conversaciones de prueba** (precio, mantención, notebook que no prende, empresa, pide domicilio, cliente molesto, pide humano, fuera de tema). Reemplaza a Groq en el chat web | Anthropic key, Calendar |
| 2. WhatsApp + bandeja | Flujo de entrada en n8n, toma de control por el dueño, **bandeja de solicitudes en `/admin` con botón Confirmar** que crea el evento y envía la confirmación. Piloto 1–2 semanas solo fuera de horario | Fases 0 y 1 |
| 3. Taller | Orden de recepción e informe técnico estandarizados (PDF), estados de la orden, "equipo listo", recordatorios | Fase 2 + informes del dueño |
| 4. MCP y reseñas | MCP Server de n8n en el Claude del dueño, pedido de reseñas, recordatorio de próxima mantención y resumen diario | Fase 3 |

**Seguridad:**
- Secretos solo en variables de entorno (Vercel y n8n), nunca en el repo.
- `/api/agente` acepta solo llamadas firmadas desde n8n y desde el sitio.
- Límite de gasto en Anthropic.
- Datos personales en Supabase con RLS.
- La política de privacidad se actualiza para mencionar el asistente y el uso de datos.

## 12. Lo que queda para quien construya

- La redacción final del prompt del sistema y de las herramientas, siguiendo las secciones 2 y 6.
- El esquema exacto de las tablas, las políticas RLS y la firma del webhook.
- La espera para juntar mensajes seguidos (empezar con 8 s).
- El diseño visual de los PDF (siguiendo la marca 2026).

## 13. Respuestas del dueño (2026-10-26)

- Confirma él; el asistente solo recaba y propone.
- Taller primero; domicilio poco común, solo para trabajos simples, con recargo que cotiza él.
- Avisos solo por WhatsApp; citas en Google Calendar con su recordatorio del mismo día.
- Máximo 5 equipos por día.
- Ya tiene WhatsApp Business, Claude y Google Workspace. Falta n8n y confirmar la cuenta de la
  API de Anthropic y la verificación del Meta Business Manager.
- Informes técnicos: los comparte para estandarizar.
