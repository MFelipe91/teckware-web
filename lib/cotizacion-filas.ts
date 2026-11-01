import type { Cotizacion } from '@/lib/cotizacion'

// Va aparte del esquema: lib/whatsapp.ts lo usa en todas las páginas y así no arrastra Zod.

/** Filas del resumen: se muestran en pantalla y arman el mensaje y el registro. */
export function filasCotizacion(c: Cotizacion): { etiqueta: string; valor: string }[] {
  return [
    { etiqueta: 'Presupuesto', valor: c.presupuesto },
    { etiqueta: 'Uso', valor: c.usos.join(', ') },
    { etiqueta: 'Resolución y FPS', valor: `${c.resolucion}, ${c.fps}` },
    { etiqueta: 'Juegos o programas', valor: c.programas },
    { etiqueta: 'Marcas preferidas', valor: c.marcas || 'Sin preferencia' },
    { etiqueta: 'Componentes que ya tiene', valor: c.componentes || 'Ninguno' },
    { etiqueta: 'Monitor y periféricos', valor: c.monitor },
    { etiqueta: 'Plazo deseado', valor: c.plazo },
  ]
}
