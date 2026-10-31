// Espacios para las fotos reales del taller (plan maestro, 6.7). Mientras estén en null la
// sección se muestra sin imagen, sin dejar un hueco. Al tener la foto en public/images/real/:
//   mesaTrabajo: { src: '/images/real/mesa-trabajo-teckware.webp', alt: 'Mesa de trabajo del taller' }
export type Foto = { src: string; alt: string }

export const FOTOS: { mesaTrabajo: Foto | null; duenio: Foto | null } = {
  mesaTrabajo: null,
  duenio: null,
}
