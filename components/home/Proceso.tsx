import { CalendarDays, ChevronRight, CircleCheck, MessageCircle, Wrench } from 'lucide-react'
import { PROCESO } from '@/lib/constants'

const ICONOS = [MessageCircle, CalendarDays, Wrench, CircleCheck]

export function Proceso({ titulo = 'Cómo funciona' }: { titulo?: string }) {
  return (
    <section className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="proceso-titulo">
      <div className="max-w-[76rem] mx-auto">
        <div className="text-center">
          <p className="antetitulo">Nuestro proceso</p>
          <h2 id="proceso-titulo" className="mt-3 text-fg">{titulo}</h2>
        </div>
        {/* En celular los 4 pasos se deslizan de lado (con el borde del siguiente a la vista). */}
        <ol className="mt-8 sm:mt-12 -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 lg:gap-8">
          {PROCESO.map((paso, i) => {
            const Icono = ICONOS[i] ?? CircleCheck
            return (
              <li key={paso.numero} className="tarjeta overflow-visible relative shrink-0 basis-[80%] snap-start p-5 sm:basis-auto">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-bright/50 font-display text-xl font-bold text-brand-bright">
                    {Number(paso.numero)}
                  </span>
                  <Icono size={26} strokeWidth={1.75} className="text-cian" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-fg">{paso.titulo}</h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">{paso.descripcion}</p>
                {i < PROCESO.length - 1 && (
                  <ChevronRight size={22} className="absolute -right-6 top-1/2 hidden -translate-y-1/2 text-brand-bright/60 lg:block" aria-hidden="true" />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
