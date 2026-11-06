import { PROCESO } from '@/lib/constants'

export function Proceso({ titulo = 'Cómo funciona' }: { titulo?: string }) {
  return (
    <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <div className="max-w-[76rem] mx-auto">
        <h2 className="text-fg mb-6 sm:mb-14">{titulo}</h2>
        {/* En celular, los 4 pasos se deslizan de lado (con el borde del siguiente a la vista) en vez de apilarse. */}
        <ol className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 sm:grid sm:gap-8 sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 lg:gap-6">
          {PROCESO.map((paso) => (
            <li key={paso.numero} className="pt-4 border-t-2 border-brand-bright shrink-0 basis-[78%] snap-start sm:basis-auto">
              <span className="price text-sm text-brand-bright">Paso {Number(paso.numero)}</span>
              <h3 className="mt-2 text-fg">{paso.titulo}</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">{paso.descripcion}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
