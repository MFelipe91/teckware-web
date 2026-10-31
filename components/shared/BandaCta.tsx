import { CtaPair } from '@/components/shared/CtaPair'

// Cierre de cada página: el único cambio fuerte de superficie del sitio.
export function BandaCta({
  titulo,
  texto,
  waHref,
  nota,
}: {
  titulo: string
  texto: string
  waHref?: string
  nota?: string
}) {
  return (
    <section className="banda-plata px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="max-w-[76rem] mx-auto grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
        <h2 className="text-ink-900">{titulo}</h2>
        <div>
          <p className="text-ink-800 leading-relaxed mb-6 max-w-xl">{texto}</p>
          <CtaPair waHref={waHref} />
          {nota && <p className="mt-5 text-sm text-ink-700">{nota}</p>}
        </div>
      </div>
    </section>
  )
}
