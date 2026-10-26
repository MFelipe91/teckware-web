# Entorno automatizado TECKWARE: WhatsApp + agente + n8n + MCP

> Diseño para revisión del dueño. Fecha: 2026-10-26. Estado: **borrador, sin construir.**
> Nada de esto se implementa hasta que el dueño apruebe este documento y existan las cuentas
> de la sección 8 (las crea el dueño).

---

## 1. Para qué

Hoy toda la atención pasa por el WhatsApp del dueño, a mano. Cada cliente nuevo repite las
mismas preguntas (precio, plazo, cómo funciona) y el agendamiento se coordina mensaje a mensaje.
El objetivo es que un asistente atienda **al instante, a cualquier hora**, con el tono cercano de
TECKWARE, y deje cada caso **listo para trabajar**: necesidad clara, datos del equipo, síntomas,
fotos, cita en el calendario y ficha en el sistema. El dueño entra solo cuando aporta valor
(diagnóstico, casos complejos, empresas, reclamos).

**Éxito, medido:**
- El 100 % de los mensajes nuevos recibe respuesta en menos de 1 minuto, también fuera de horario.
- Al menos el 70 % de las consultas de precio y agendamiento se resuelven sin que el dueño escriba.
- Cada cita queda en Google Calendar **y** en Supabase con equipo, síntoma y contacto.
- Cero promesas falsas: el bot solo usa precios y plazos de `lib/constants.ts`
  (48 h hábiles, garantía 30 días, boleta).

**Lo que se busca transmitir** (del brief del dueño): confianza, cercanía, expertise, rapidez
y prevención.

## 2. No-objetivos y anti-objetivos

- **No** es un asistente general: solo atiende temas de TECKWARE. Además, Meta prohíbe en la
  WhatsApp Business Platform los asistentes de IA de propósito general; los de atención y
  agendamiento de un negocio sí están permitidos.
- **No** cobra en línea (el sistema de pagos `feat/pagos` sigue archivado).
- **No** diagnostica a distancia ni promete reparaciones: orienta, cotiza con la lista oficial y
  agenda. El diagnóstico real lo hace el dueño (48 h hábiles, con informe técnico).
- **Anti-objetivo:** que el cliente sienta que habla con un robot torpe **o** que descubra que lo
  engañaron. El asistente conversa de forma natural y cálida (frases cortas, español chileno,
  sin menús de "marque 1"), pero **se presenta como el asistente de TECKWARE y nunca dice ser
  una persona**. Si el cliente pregunta, lo reconoce y ofrece pasar con el dueño. Esto cuida la
  confianza (el valor número uno de la marca), cumple la política de Meta y evita problemas con la
  Ley del Consumidor.
- **Anti-objetivo:** que el bot siga hablando cuando el dueño ya tomó la conversación.

## 3. Arquitectura recomendada

```
Cliente (WhatsApp)                         Dueño (app WhatsApp Business en el celular)
      │                                              ▲  ve todo y responde cuando quiere
      ▼                                              │  (coexistencia: mismo número)
Meta WhatsApp Cloud API ──webhook──► n8n ───────────┘
                                      │  1. junta mensajes seguidos (espera ~8 s)
                                      │  2. ¿el dueño tomó el chat? → no responde
                                      │  3. llama al agente
                                      ▼
                        teckware.cl/api/agente  (Next.js, Vercel)
                        Claude + herramientas propias:
                          · precios_y_plazos   (lee lib/constants.ts)
                          · disponibilidad     (Google Calendar)
                          · agendar_cita       (Google Calendar + Supabase)
                          · registrar_caso     (Supabase: cliente, equipo, síntomas, fotos)
                          · estado_de_orden    (Supabase)
                          · pasar_a_humano     (marca el chat y avisa al dueño)
                                      │
                                      ▼
                        Supabase (historial, clientes, órdenes, citas)
                                      ▲
n8n (automatizaciones programadas) ───┤  recordatorio 24 h antes · "tu equipo está listo"
                                      │  + informe técnico · pedir reseña en Google
                                      │  · resumen diario para el dueño
n8n MCP Server ◄──── Claude (Desktop / Code) del dueño:
                     "¿qué citas tengo mañana?", "resume los casos nuevos",
                     "marca la orden 123 como lista", "redacta el informe técnico"
```

### Por qué el agente vive en el código y no dentro de n8n

n8n tiene un nodo "AI Agent", pero hoy hay tres riesgos concretos con los modelos actuales de
Claude:

1. **`temperature` rechazado.** Desde el 2026-10-21 la API rechaza `temperature`, `top_p` y
   `top_k`; muchos nodos los envían por defecto.
2. **Historial con razonamiento.** Los modelos actuales exigen devolver la respuesta completa del
   modelo en cada turno ("preserved thinking"). La memoria de chat de n8n guarda solo el texto, y
   en cuentas nuevas editar el historial devuelve error.
3. **Uso forzado de herramientas.** Forzar una herramienta (`tool_choice` de tipo `any`) da error
   en Opus 5.5; algunos agentes lo usan.

Con el agente en `app/api/agente` (SDK oficial `@anthropic-ai/sdk`, TypeScript, mismo repo):

- el historial se guarda completo en Supabase;
- los precios y plazos salen de `lib/constants.ts` (la misma fuente que el sitio, así el bot
  nunca promete algo distinto);
- se puede probar con conversaciones de ejemplo antes de conectarlo a clientes reales;
- **el mismo cerebro sirve al chat de la web** (reemplaza a Groq en `app/api/chat`).

**n8n hace lo que mejor sabe:** recibir y enviar WhatsApp, juntar mensajes, decidir si responde
el bot o el dueño, tareas programadas, conectar Google y exponer herramientas por MCP.

## 4. Decisiones (las tomadas por el dueño y las mías)

| Tema | Decisión | Quién |
|---|---|---|
| Plazo | Trabajo completo en **48 h hábiles**, con diagnóstico real e informe técnico | Dueño |
| Número | El mismo **+56 9 3020 9427**, que sigue en la app **WhatsApp Business** (coexistencia) | Dueño |
| Agenda | **Google Calendar** (más copia en Supabase) | Dueño |
| n8n | **n8n Cloud** para empezar: sin servidores que mantener. Se puede migrar a un VPS después si el costo lo justifica | Mía |
| Cerebro | Agente en Next.js con el SDK oficial de Anthropic | Mía |
| Modelo | **Claude Opus 5.5** (`claude-opus-5-5`) con esfuerzo `low` para conversar: el más capaz, para que suene natural y no se equivoque al agendar. Si el dueño prioriza costo: Sonnet 5.5 (`claude-sonnet-5-5`, ~mitad de precio) o Haiku 5.5 (`claude-haiku-5-5`, ~40 veces más barato, menos fino) | Mía; **el dueño decide si baja de modelo** |
| Tono | Natural y cercano, transparente sobre ser un asistente | Mía, por confianza y política de Meta |
| Datos | Supabase (ya está en el proyecto) | Existente |

## 5. Cómo conversa el asistente

**Presentación:** "¡Hola! Soy Teck, el asistente de TECKWARE 👋 Te ayudo a cotizar y agendar.
Si prefieres hablar con Mario, me dices y le aviso."

**Lo que tiene que lograr en cada conversación:**
1. Entender qué necesita: mantención, reparación, armado, empresa u otra cosa.
2. Tomar los datos del caso: tipo de equipo, marca/modelo, qué le pasa, desde cuándo, si tiene
   datos importantes, fotos o video (opcional), comuna (La Serena / Coquimbo).
3. Dar precio y plazo **solo** desde la lista oficial. Si no calza, dice "eso lo cotiza Mario"
   y deriva.
4. Ofrecer 2–3 horarios reales del calendario (lunes a viernes, 10:00–18:30) y confirmar uno.
5. Cerrar con un resumen: servicio, precio, fecha, qué llevar o preparar, garantía, boleta.

**Estilo:** mensajes cortos (como escribe una persona por WhatsApp), una pregunta a la vez, usa
el nombre del cliente, empatiza cuando hay un problema ("uf, qué lata que no prenda"), explica
en simple y educa un poco ("la pasta térmica se seca con el tiempo; por eso se calienta"). Sin
tecnicismos innecesarios y sin emojis en exceso.

**Pasa con el dueño cuando:**
- el cliente lo pide o está molesto;
- es una empresa con varios equipos o el caso no está en la lista;
- hay riesgo de datos (disco dañado, ransomware);
- el bot no entiende después de dos intentos.

Al pasar, el bot deja de responder en ese chat hasta que el dueño lo libere, y le envía al dueño
un resumen del caso.

## 6. Datos (Supabase)

Tablas nuevas, mínimas:

- `clientes`: teléfono (clave), nombre, comuna, empresa (opcional), creado.
- `casos`: cliente, equipo (tipo, marca, modelo), síntomas, fotos (Storage), servicio sugerido,
  precio cotizado, estado (`nuevo` → `agendado` → `recibido` → `en_trabajo` → `listo` →
  `entregado`), notas del dueño, informe técnico (PDF).
- `citas`: caso, inicio, fin, id del evento en Google Calendar, estado.
- `conversaciones`: teléfono, canal (whatsapp/web), mensajes completos del modelo, `humano_activo`
  (sí/no), actualizado.

El panel `/admin` existente suma una vista de casos para cambiar el estado. Al marcar un caso como
`listo`, n8n avisa al cliente y le envía el informe técnico.

## 7. Automatizaciones de n8n

| Flujo | Disparador | Qué hace |
|---|---|---|
| Entrada WhatsApp | Webhook de Meta | Junta mensajes, revisa `humano_activo`, llama a `/api/agente`, envía la respuesta |
| Recordatorio | Programado | 24 h antes de la cita, plantilla aprobada por Meta |
| Equipo listo | Cambio de estado a `listo` | Mensaje + informe técnico en PDF |
| Reseña | 2 días después de `entregado` | Pide reseña con el enlace de la Ficha de Google (reseñas reales, plan 6.6) |
| Resumen diario | Lun–Vie 9:30 | Al dueño: citas del día, casos nuevos, pendientes |
| MCP Server | Claude del dueño | Herramientas: citas de hoy/mañana, buscar cliente, casos por estado, cambiar estado, redactar informe |

**Costo de WhatsApp (Meta):** responder dentro de las 24 h desde que escribe el cliente no se
cobra. Los mensajes que inicia el negocio (recordatorio, "equipo listo", reseña) usan plantillas
aprobadas y Meta los cobra por mensaje según categoría y país. Hay que confirmar la tarifa
vigente para Chile al activar la cuenta.

## 8. Lo que tiene que hacer el dueño (cuentas y permisos)

Claude no crea cuentas ni acepta términos en nombre del dueño.

1. **Meta Business Manager** verificado a nombre de TECKWARE SpA.
2. **Conectar el número a la Cloud API en modo coexistencia** (la app WhatsApp Business sigue
   funcionando en el celular). Se hace con "Embedded Signup" desde un proveedor (BSP / Tech
   Provider) o desde n8n según lo que soporte al momento de activarlo; lo vemos juntos en la
   fase 0. Antes, respaldar los chats.
3. **Cuenta de n8n Cloud.**
4. **Cuenta en la consola de Anthropic** con una API key y un límite de gasto mensual.
5. **Google Cloud:** proyecto con acceso a la API de Calendar para el calendario de trabajo
   (cuenta de servicio o OAuth).
6. Revisar y aprobar el texto de las plantillas (recordatorio, equipo listo, reseña).

## 9. Costos estimados (a confirmar con uso real)

Supuesto: 300 conversaciones al mes, ~10 mensajes cada una, prompt del sistema en caché.

| Concepto | Estimado mensual |
|---|---|
| Claude Opus 5.5 (esfuerzo bajo, caché) | ~US$ 40–70 |
| Alternativa Sonnet 5.5 | ~US$ 20–35 |
| Alternativa Haiku 5.5 | ~US$ 1–3 |
| n8n Cloud (plan de entrada) | verificar precio vigente |
| WhatsApp: respuestas a clientes | US$ 0 (dentro de 24 h) |
| WhatsApp: plantillas (recordatorios, etc.) | según tarifa de Meta para Chile |
| Supabase / Vercel | planes actuales (sin cambio esperado al inicio) |

Precios por millón de tokens (entrada / salida), Claude API, 2026-10: Opus 5.5 US$4 / US$20 ·
Sonnet 5.5 US$2 / US$10 · Haiku 5.5 US$0,10 / US$0,50. La lectura desde caché cuesta mucho menos
que la entrada normal. Las cifras son estimaciones gruesas; en la fase 1 se miden con el uso real
(`usage` de cada respuesta) antes de decidir el modelo final.

## 10. Fases

| Fase | Entrega | Depende de |
|---|---|---|
| 0. Cuentas | Sección 8 lista; número en coexistencia probado con un número de prueba | Dueño |
| 1. Cerebro | `/api/agente` con herramientas, prompt y **set de conversaciones de prueba** (precio, agendar, empresa, cliente molesto, pide humano, fuera de tema). Reemplaza a Groq en el chat web | Anthropic key, Calendar |
| 2. WhatsApp | Flujo de entrada en n8n, junta mensajes, toma de control por el dueño. Piloto 1–2 semanas solo fuera de horario | Fase 0 y 1 |
| 3. Operación | Tablas de casos, vista en `/admin`, "equipo listo" con informe técnico PDF, recordatorios | Fase 2 |
| 4. MCP y reseñas | MCP Server de n8n conectado al Claude del dueño, pedido de reseñas y resumen diario | Fase 3 |

**Seguridad:**
- Secretos solo en variables de entorno (Vercel y n8n), nunca en el repo.
- El endpoint `/api/agente` acepta solo llamadas firmadas desde n8n y desde el sitio.
- Límite de gasto mensual en Anthropic.
- Los datos personales quedan en Supabase con RLS.
- La política de privacidad (`/privacidad`) se actualiza para mencionar el asistente y el uso de
  los datos.

## 11. Lo que queda para quien construya

- La redacción final del prompt del sistema y de las descripciones de herramientas, siguiendo la
  sección 5.
- El esquema exacto de las tablas, las políticas RLS y la firma del webhook.
- Cuántos segundos esperar para juntar mensajes seguidos (empezar con 8 s).
- El formato del informe técnico PDF (plantilla con logo, equipo, hallazgos, trabajo realizado,
  recomendaciones de prevención, garantía).

## 12. Preguntas abiertas para el dueño

1. ¿El asistente puede **confirmar** citas directamente, o solo proponer horarios y tú confirmas?
2. Cuando el servicio es "a domicilio", ¿quién va a dónde? ¿Retiras el equipo, el cliente lo
   lleva o se atiende en el lugar? ¿Hay costo extra por distancia?
3. ¿Qué incluye hoy tu informe técnico? Si tienes uno de ejemplo, lo usamos de base para la
   plantilla PDF.
4. ¿Quieres un tope de cuántas citas por día puede agendar el bot?
5. ¿Te avisamos los casos derivados por WhatsApp a tu número personal, por correo o por ambos?
