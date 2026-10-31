import { PROCESO } from '@/lib/constants'

export function Proceso({ titulo = 'Cómo funciona' }: { titulo?: string }) {
  return (
    <section className="bg-ink-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-[76rem] mx-auto">
        <h2 className="text-fg mb-10 sm:mb-14">{titulo}</h2>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PROCESO.map((paso) => (
            <li key={paso.numero} className="pt-4 border-t-2 border-brand-bright">
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
