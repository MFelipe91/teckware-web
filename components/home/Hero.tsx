import type { CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { EMPRESA, PLAZO, precioServicio } from '@/lib/constants'
import { FOTOS } from '@/lib/fotos'
import { CtaPair } from '@/components/shared/CtaPair'
import { HeroFondo } from '@/components/home/HeroFondo'

// Server Component: el texto llega visible en el HTML, así el H1 es el LCP.

const PRECIOS = [
  { nombre: 'Mantención de PC gamer', detalle: 'Test, limpieza, pasta Thermal Grizzly, BIOS, Windows limpio y test final', precio: precioServicio('mantencion-full'), href: '/mantencion-pc-gamer' },
  { nombre: 'Mantención de notebook', detalle: 'Desarmado, limpieza de ventilador y disipador, y pasta térmica', precio: precioServicio('mantencion-full'), href: '/reparacion-notebook-la-serena' },
  { nombre: 'Mantención de PS5', detalle: 'Limpieza física y cambio de metal líquido', precio: precioServicio('consola-ps5'), href: '/mantencion-ps5-la-serena' },
  { nombre: 'Armado de PC gamer', detalle: 'Cable management y pruebas de estabilidad. Componentes aparte', precio: precioServicio('armado-estandar'), href: '/armado-pc-gamer-la-serena' },
]

const SELLOS = [`Entrega en ${PLAZO}`, 'Informe técnico', 'Garantía de 30 días', 'Con boleta', 'Pagas al retirar', EMPRESA.horario]

export function Hero() {
  return (
    <section className="bg-ink-950" aria-label="Inicio">
      <div className="hero-banda px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 sm:pb-28 lg:pb-16">
        <div className="relative max-w-[76rem] mx-auto">
          <HeroFondo />
          <h1 className="relative max-w-[20ch]">Mantención y servicio técnico de computadores en La Serena y Coquimbo</h1>
        </div>
      </div>

      <div className="max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8 lg:box-content pb-10 sm:pb-14 lg:pb-20">
        <div className="pt-8 grid gap-8 sm:gap-10 lg:gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <p className="font-display text-xl sm:text-[1.375rem] leading-snug font-semibold text-fg">
              Reparamos tu hardware. Construimos tu software. Somos TECKWARE.
            </p>
            <p className="mt-3 mb-7 max-w-xl leading-relaxed text-fg-muted">
              Mantención de PC gamer, notebooks y PS5, y armado a pedido. Te explicamos qué tiene tu equipo, cuánto cuesta y cómo evitar que vuelva a fallar. Taller en La Serena, con hora coordinada por WhatsApp.
            </p>
            <CtaPair>
              <Link href="/servicios" className="btn btn-terciario self-start sm:self-auto max-sm:hidden">Ver precios</Link>
            </CtaPair>
          </div>

          {/* En celular los precios van primero: la barra fija ya ofrece WhatsApp. */}
          <div className="order-first lg:order-none">
            <ul>
              {PRECIOS.map((p, i) => (
                <li key={p.nombre} className="entrada border-b border-white/10" style={{ '--i': i } as CSSProperties}>
                  <Link href={p.href} className="group grid grid-cols-[14px_minmax(0,1fr)_auto] gap-x-3 items-baseline py-3.5">
                  <span className="hex transition-transform duration-150 ease-salida group-hover:scale-150" aria-hidden="true" />
                  <span>
                    <span className="block font-display text-[1.0625rem] font-semibold text-fg group-hover:text-brand-bright transition-colors">{p.nombre}</span>
                    <span className="block text-sm text-fg-muted">{p.detalle}</span>
                  </span>
                  <span className="price text-xl text-fg">{p.precio}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-fg-muted">
              {SELLOS.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>

        {FOTOS.mesaTrabajo && (
          <div className="panel-corte relative mt-12 h-56 sm:h-80 overflow-hidden">
            <Image src={FOTOS.mesaTrabajo.src} alt={FOTOS.mesaTrabajo.alt} fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
