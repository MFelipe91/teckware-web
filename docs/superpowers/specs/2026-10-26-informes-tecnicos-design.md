# Sistema de documentos TECKWARE: recepción, informe técnico y propuesta

> Diseño para revisión del dueño. Fecha: 2026-10-26. Estado: **borrador, sin construir.**
> Se basa en dos documentos reales del dueño: un informe técnico final de taller (PC gamer AM5)
> y una propuesta Etapa 1 de Plan Maestro TI para una empresa. Esos documentos tienen datos de
> clientes: **no se copian al repo.**

---

## 1. Para qué

Los informes actuales ya son de nivel profesional: folio, indicadores de estado, mediciones
reales, contexto técnico explicado en simple, detalle económico, garantía y firmas. Son
exactamente la señal de confianza y expertise que la marca quiere transmitir. El problema es
otro:

- Cada documento se arma a mano y con estilos distintos: el de taller usa titulares serif sobre
  blanco; el de empresas, una banda navy con letra sans.
- No hay orden de recepción al ingresar el equipo.
- Algunos datos no coinciden entre documentos y con la web (sección 6).

**Objetivo:** un mismo sistema visual y de estructura para los tres documentos, que se llena
desde datos (del caso en Supabase, más adelante) y sale como PDF con un clic. Así cada informe
toma minutos en vez de horas, siempre se ve igual de profesional, y Claude puede redactar el
borrador desde las notas del dueño.

## 2. Los tres documentos

| Documento | Cuándo | Folio propuesto |
|---|---|---|
| **A. Orden de recepción** | Al recibir el equipo en el taller | `OR-2026-0001` |
| **B. Informe técnico** | Diagnóstico (si hay que cotizar algo) y entrega final | `IT-2026-0001` (+ `-D` diagnóstico, `-F` final) |
| **C. Propuesta / informe de consultoría** | Empresas: levantamiento, cotización, plan | `PT-2026-0001` |

Sobre el folio: hoy es `IT-2026-NICOLAS-002`. Se propone un correlativo numérico por año
(`IT-2026-0001`, **elegido por el dueño**) porque:
- ordena solo;
- no expone el nombre del cliente en el nombre del archivo ni en el pie de cada página;
- permite unir recepción, diagnóstico y entrega bajo la misma orden.

El nombre del cliente va adentro del documento. **El dueño decide.**

## 3. Estructura

### A. Orden de recepción (1 página)

- Folio, fecha y hora de ingreso; cliente (nombre, RUT opcional, teléfono).
- Equipo: tipo, marca, modelo, n.º de serie.
- Accesorios recibidos (casillas): cargador, cables, mouse, bolso, otros.
- Estado visible: golpes, rayas, piezas faltantes, con fotos adjuntas.
- Falla declarada por el cliente, con sus palabras.
- Datos: ¿hay información importante sin respaldo? ¿Autoriza respaldo?
- Servicio solicitado, precio de lista y plazo (48 h hábiles).
- Condiciones: garantía, bodegaje según `/terminos`, riesgo inherente.
- Firma del cliente (conformidad de recepción).

### B. Informe técnico (se mantiene la estructura del dueño)

1. **Portada:** título del caso, equipo, cliente, y 4 indicadores (Estado · Estabilidad ·
   Componente clave · Almacenamiento) con color semántico: verde ok, azul instalado o nuevo,
   ámbar observación, rojo falla.
2. **Ficha:** folio, fecha, cliente, informe relacionado, técnico responsable, resumen del caso
   en una línea.
3. **01 Resumen ejecutivo**, con recuadro de conclusión.
4. **02 Antecedentes:** síntoma declarado, síntoma observado en taller y protocolo de descarte.
5. **03 Trabajo realizado:** físico y de sistema.
6. **04 Inventario del equipo:** tabla de componentes, con su estado.
7. **05 Validación (protocolo de pruebas):**

   | Prueba | Herramienta | Qué valida |
   |---|---|---|
   | CPU y memoria | OCCT | Estabilidad, temperaturas, voltajes, rieles |
   | GPU | FurMark | Temperatura, hotspot, VRAM, consumo, artefactos |
   | GPU / sistema | Superposition | Rendimiento y estabilidad en carga real |
   | Almacenamiento | CrystalDiskInfo | Salud %, temperatura, horas de uso, encendidos |

   Cada prueba con tabla de resultado y, cuando hay mantención, columnas **antes / después**.
   Es la prueba concreta de la prevención.
8. **Contexto técnico** (opcional): el recuadro que explica en simple, por ejemplo por qué 94 °C
   es normal en un Ryzen 7000. Es lo que más educa al cliente.
9. **Recomendaciones de prevención** y **fecha sugerida para la próxima mantención**. Esta fecha
   alimenta el recordatorio automático del asistente.
10. **Detalle económico:** ítems con IVA incluido, lo ya pagado y el saldo.
11. **Conclusión final.**
12. **Condiciones y garantía**, más la cláusula de riesgo inherente.
13. **Firmas:** técnico responsable y recepción conforme del cliente.

### C. Propuesta para empresas (se mantiene la estructura del dueño)

KPIs arriba (inversión, puestos, plazo) · resumen ejecutivo · levantamiento · criterio técnico ·
especificación y cotización por gama · presupuesto consolidado (neto, IVA, total) · planes de
servicios (correo, IA, software) · red y oficina · plan de implementación por semana · resumen
económico (único / mensual, en UF cuando aplique) · decisiones requeridas del cliente · firmas ·
anexo de enlaces.

## 4. Sistema visual común (marca 2026, pensado para imprimir)

- **Papel blanco** (se imprime y se lee en el celular). Texto navy `#0A1226`, acento azul de la
  marca `#0B6BCB`, líneas plata `#CCCFD5`.
- **Encabezado:** isotipo TW + "TECKWARE SpA" + tipo de documento + folio. **Pie:** zona y
  contacto + "Página N de M".
- **Tipografía:** Sora en títulos e Inter en texto (las mismas del sitio), con cifras tabulares
  en las tablas.
- **Componentes:** indicadores de estado, tabla de datos con encabezado navy, recuadro
  "Conclusión" (verde), recuadro "Contexto técnico" (azul), recuadro "Riesgo" (ámbar) y bloque
  de firmas.
- Etiqueta "Documento confidencial" en todos.

## 5. Cómo se generan

- **Plantillas HTML en el repo** (componentes React, mismo sistema de diseño del sitio), en una
  ruta privada del panel.
- **Datos:** al inicio, un archivo por caso (JSON) que el dueño o su Claude llenan; después, desde
  la orden en Supabase (fase 3 del asistente).
- **PDF:** con Chrome en modo de impresión. Ya está instalado en el PC del dueño, así que no hace
  falta ningún servicio pagado.
- **Borrador con Claude:** el dueño dicta notas ("cambié pasta, BIOS al día, OCCT sin errores,
  CPU de 92 a 71 °C") y Claude arma el informe completo para que el dueño lo revise. Las
  mediciones las pone siempre el dueño desde sus capturas: Claude no inventa cifras.

## 6. Decisiones del dueño (2026-10-26)

1. **Garantía: 30 días para todo**, igual que la web, el chatbot y la Ficha de Google. Las
   plantillas la toman de la misma constante del sitio; no se escribe a mano. Los componentes
   nuevos llevan además la garantía del fabricante.
2. **Nombre en todos los documentos: Mario Felipe Busques Araya.** El sitio ya lo usa así.
   Título: **Ingeniero Informático con certificaciones en ciberseguridad** (`EMPRESA.tituloProfesional`).
3. **Folio: `IT-2026-0001`**, correlativo por año, compartido por la orden (`OR-`), el
   diagnóstico y la entrega. El nombre del cliente va solo dentro del documento.
4. **Riesgo inherente:** se sugiere redactarlo sin porcentaje fijo ("toda intervención sobre
   equipos electrónicos conlleva un riesgo inherente por el desgaste previo no detectable…").
   Si se quiere mantener la cifra, revisarlo antes con un abogado (Ley del Consumidor).
