// Espacios para las fotos reales del taller (plan maestro, 6.7). Mientras estén en null la
// sección se muestra sin imagen, sin dejar un hueco. Al tener la foto en public/images/real/:
//   mesaTrabajo: { src: '/images/real/mesa-trabajo-teckware.webp', alt: 'Mesa de trabajo del taller' }
export type Foto = { src: string; alt: string }

export const FOTOS: { mesaTrabajo: Foto | null; duenio: Foto | null } = {
  mesaTrabajo: null,
  duenio: null,
}

// Fotos de stock de uso libre (licencia Unsplash: uso comercial sin atribución obligatoria).
// Se sirven desde el CDN de Unsplash a través de next/image. Para cambiar una por una foto real
// del taller basta con reemplazar `src` por la ruta en public/images/real/.
type FotoStock = Foto & { autor: string }

const unsplash = (id: string, ancho = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${ancho}&q=80`

export const STOCK = {
  hero: { src: unsplash('1622013378145-e8d89cfbd990', 2000), alt: 'PC gamer con iluminación azul sobre un escritorio', autor: 'Unsplash' },
  tecnico: { src: unsplash('1721332154191-ba5f1534266e'), alt: 'Técnico desarmando un notebook con herramientas de precisión', autor: 'Unsplash' },
  pcGamer: { src: unsplash('1738245494097-9b1e3971c3eb', 1000), alt: 'PC gamer con refrigeración líquida y ventiladores azules', autor: 'Unsplash' },
  notebook: { src: unsplash('1721333089073-215a56fd710c', 1000), alt: 'Notebook abierto durante una mantención', autor: 'Unsplash' },
  macbook: { src: unsplash('1785245566050-8aaa947c74b8', 1000), alt: 'Notebook de aluminio encendido en un ambiente oscuro', autor: 'Unsplash' },
  ps5: { src: unsplash('1731405858377-6de0070d8d65', 1000), alt: 'Consola PS5 con su control sobre un mueble', autor: 'Unsplash' },
  armado: { src: unsplash('1632749042303-7f7a18ed6ff0', 1000), alt: 'Interior de un PC armado con iluminación RGB', autor: 'Unsplash' },
  formateo: { src: unsplash('1603302576837-37561b2e2302', 1000), alt: 'Notebook con teclado iluminado', autor: 'Unsplash' },
  redes: { src: unsplash('1681383064412-171e5bee5f6e', 1000), alt: 'Router WiFi con antenas', autor: 'Unsplash' },
  ciber: { src: unsplash('1550751827-4bd374c3f58b', 1000), alt: 'Circuito iluminado en azul', autor: 'Unsplash' },
  placa: { src: unsplash('1562408590-e32931084e23', 1000), alt: 'Placa electrónica con iluminación azul', autor: 'Unsplash' },
} satisfies Record<string, FotoStock>

/** Miniatura de cada guía del blog, por slug. Sin entrada, la tarjeta usa la placa. */
export const FOTO_BLOG: Record<string, Foto> = {
  'cada-cuanto-hacer-mantencion-pc-gamer': STOCK.pcGamer,
  'senales-notebook-necesita-mantencion': STOCK.notebook,
  'mantencion-ps5-metal-liquido': STOCK.ps5,
  'mantencion-preventiva-computadores-empresa': STOCK.formateo,
}
