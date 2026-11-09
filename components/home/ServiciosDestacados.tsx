import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { IVA_NOTA, precioServicio } from '@/lib/constants'
import { STOCK, type Foto } from '@/lib/fotos'

type Destacado = { nombre: string; detalle: string; precio: string; href: string; foto: Foto }

// Precios siempre desde lib/constants.ts (fuente única). Maqueta B: tarjetas con foto y cifra grande.
const DESTACADOS: Destacado[] = [
  { nombre: 'Mantención PC gamer', detalle: 'Test, limpieza, pasta Thermal Grizzly', precio: precioServicio('mantencion-full'), href: '/mantencion-pc-gamer', foto: STOCK.pcGamer },
  { nombre: 'Mantención notebook', detalle: 'Limpieza, ventilador y pasta térmica', precio: precioServicio('mantencion-full'), href: '/reparacion-notebook-la-serena', foto: STOCK.notebook },
  { nombre: 'Mantención PS5', detalle: 'Limpieza y cambio de metal líquido', precio: precioServicio('consola-ps5'), href: '/mantencion-ps5-la-serena', foto: STOCK.ps5 },
  { nombre: 'Armado PC gamer', detalle: 'Cable management y pruebas', precio: precioServicio('armado-estandar'), href: '/armado-pc-gamer-la-serena', foto: STOCK.armado },
]

export function ServiciosDestacados() {
  return (
    <section className="bg-ink-900 px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="precios-titulo">
      <div className="max-w-[76rem] mx-auto grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:items-center">
        <div>
          <p className="antetitulo">Precios destacados</p>
          <h2 id="precios-titulo" className="mt-3 text-fg">
            Precios claros, <span className="acento">sin sorpresas</span>
          </h2>
          <p className="mt-4 text-fg-muted">Sabes el costo antes de que empecemos. {IVA_NOTA}</p>
          <Link href="/servicios" className="btn btn-secundario mt-6 w-full sm:w-auto">
            Ver todos los precios <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {DESTACADOS.map((d) => (
            <li key={d.nombre}>
              <Link href={d.href} className="tarjeta tarjeta-enlace group flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden max-sm:hidden">
                  <Image src={d.foto.src} alt={d.foto.alt} fill sizes="(min-width: 768px) 18vw, 50vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 to-transparent" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <h3 className="text-lg text-fg">{d.nombre}</h3>
                  <span className="price mt-1 text-2xl sm:text-3xl text-fg">{d.precio}</span>
                  <span className="mt-1 text-sm text-fg-muted leading-snug">{d.detalle}</span>
                </div>
              </Link>
            </li>
          ))}
          <li className="col-span-2 md:col-span-1">
            <div className="tarjeta flex h-full items-center gap-4 p-4 border-brand-bright/40 md:flex-col md:justify-center md:gap-2 md:p-5 md:text-center">
              <ShieldCheck size={44} strokeWidth={1.5} className="text-cian" aria-hidden="true" />
              <p className="font-display text-2xl font-bold leading-tight text-fg">Garantía de 30 días</p>
              <p className="text-sm text-fg-muted">En todos los trabajos, con boleta</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
