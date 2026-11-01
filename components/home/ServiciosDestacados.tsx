import Link from 'next/link'
import Image from 'next/image'
import { IVA_NOTA } from '@/lib/constants'
import type { Servicio } from '@/lib/services'
import { WA } from '@/lib/whatsapp'
import { BLUR_DARK } from '@/lib/imageBlur'

function enlaceWa(s: Servicio): string {
  const fn = WA[s.whatsappKey as keyof typeof WA]
  return typeof fn === 'function' ? (fn as () => string)() : WA.servicio(s.nombre)
}

// La mantención es lo principal del negocio: va como pieza grande y el resto en lista de precios.
export function ServiciosDestacados({ servicios }: { servicios: Servicio[] }) {
  // Primero lo que más conviene mostrar; el resto, según lo destacado en el panel.
  const primero = ['consola-ps5', 'armado-estandar', 'mantencion-logica', 'diagnostico', 'mantencion-gpu']
  const principal = servicios.find((s) => s.id === 'mantencion-full') ?? servicios[0]
  if (!principal) return null
  const prioritarios = primero
    .map((id) => servicios.find((s) => s.id === id))
    .filter((s): s is Servicio => !!s && s.id !== principal.id)
  const extras = servicios.filter((s) => s.featured && s.id !== principal.id && !prioritarios.includes(s))
  const resto = [...prioritarios, ...extras].slice(0, 5)

  return (
    <section className="bg-ink-900 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-[76rem] mx-auto">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end mb-10 sm:mb-14">
          <h2 className="text-fg">Precios fijos, sin sorpresas</h2>
          <p className="text-fg-muted max-w-md">Sabes el costo antes de que empecemos. {IVA_NOTA}</p>
        </div>

        <div className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <article className="panel-corte flex flex-col self-start w-full">
            <div className="relative h-52 sm:h-64">
              <Image
                src="/images/mantencionpc2.jpg"
                alt="Mantención física de un PC con limpieza y pasta térmica"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={72}
                placeholder="blur"
                blurDataURL={BLUR_DARK}
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl text-fg">{principal.nombre}</h3>
                <span className="price text-2xl text-fg">{principal.precio}</span>
              </div>
              <p className="mt-3 text-fg-muted leading-relaxed">{principal.descripcion}</p>
              <p className="mt-3 text-sm text-fg-subtle">Entrega en {principal.tiempo}</p>
              <a href={enlaceWa(principal)} target="_blank" rel="noopener noreferrer" className="btn btn-primario w-full sm:w-auto mt-6">
                Cotizar {principal.nombre}
              </a>
            </div>
          </article>

          <div>
            <ul className="border-t border-white/10">
              {resto.map((s) => (
                <li key={s.id} className="py-5 border-b border-white/10 grid gap-x-6 gap-y-2 grid-cols-[minmax(0,1fr)_auto]">
                  <h3 className="text-fg">{s.nombre}</h3>
                  <span className="price text-xl text-fg text-right">{s.precio}</span>
                  <p className="text-sm text-fg-muted leading-relaxed">{s.descripcion}</p>
                  <a href={enlaceWa(s)} target="_blank" rel="noopener noreferrer" className="btn btn-terciario justify-self-end self-start" aria-label={`Cotizar ${s.nombre}`}>
                    Cotizar
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/servicios" className="btn btn-terciario mt-6">Ver todos los servicios</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
