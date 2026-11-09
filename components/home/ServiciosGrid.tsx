import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { STOCK, type Foto } from '@/lib/fotos'

type Tarjeta = { titulo: string; detalle: string; href: string; foto: Foto }

// Las 8 líneas que el dueño quiere mostrar, cada una hacia su página de servicio.
const SERVICIOS: Tarjeta[] = [
  { titulo: 'Mantención de PC gamer', detalle: 'Limpieza, pasta térmica y pruebas', href: '/mantencion-pc-gamer', foto: STOCK.pcGamer },
  { titulo: 'Mantención de notebooks', detalle: 'Limpieza, ventilación y diagnóstico', href: '/reparacion-notebook-la-serena', foto: STOCK.notebook },
  { titulo: 'MacBook y Apple', detalle: 'Equipos Intel y Apple Silicon', href: '/servicio-tecnico-apple', foto: STOCK.macbook },
  { titulo: 'PlayStation 5 y 4', detalle: 'Limpieza y metal líquido', href: '/mantencion-ps5-la-serena', foto: STOCK.ps5 },
  { titulo: 'Armado de PC gamer', detalle: 'A pedido, según tu presupuesto', href: '/armado-pc-gamer-la-serena', foto: STOCK.armado },
  { titulo: 'Formateo y optimización', detalle: 'Windows o macOS limpio', href: '/formateo-pc-la-serena', foto: STOCK.formateo },
  { titulo: 'Redes y WiFi', detalle: 'Mejor señal en casa u oficina', href: '/redes-wifi-la-serena', foto: STOCK.redes },
  { titulo: 'Ciberseguridad', detalle: 'Protege tus datos y equipos', href: '/ciberseguridad', foto: STOCK.ciber },
]

export function ServiciosGrid() {
  return (
    <section id="servicios" className="halo px-4 sm:px-6 lg:px-8 py-14 sm:py-20 scroll-mt-20" aria-labelledby="servicios-titulo">
      <div className="max-w-[76rem] mx-auto">
        <div className="text-center">
          <p className="antetitulo">
            <span className="h-px w-8 bg-brand-bright/60" aria-hidden="true" />
            Nuestros servicios
            <span className="h-px w-8 bg-brand-bright/60" aria-hidden="true" />
          </p>
          <h2 id="servicios-titulo" className="mt-3 text-fg">
            Soluciones completas para <span className="acento">tus equipos</span>
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {SERVICIOS.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="tarjeta tarjeta-enlace group flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.foto.src}
                    alt={s.foto.alt}
                    fill
                    sizes="(min-width: 1216px) 290px, (min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-300 ease-salida group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                  <h3 className="text-lg sm:text-xl text-fg">{s.titulo}</h3>
                  <p className="mt-1 text-sm text-fg-muted leading-snug">{s.detalle}</p>
                  <span className="mt-auto pt-3 inline-flex items-center gap-1.5 font-display font-bold text-brand-bright">
                    Saber más <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-fg-muted">
          ¿Tienes una empresa o una pyme?{' '}
          <Link href="/empresas" className="btn btn-terciario">Soluciones para empresas</Link>
        </p>
      </div>
    </section>
  )
}
