import { ChevronDown } from 'lucide-react'

// Preguntas frecuentes: título a la izquierda y respuestas plegables a la derecha.
export function ListaFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
      <h2 className="text-fg">Preguntas frecuentes</h2>
      <div className="border-t border-white/10">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group border-b border-white/10">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-medium text-fg">
              {q}
              <ChevronDown size={18} className="shrink-0 text-brand-bright transition-transform duration-200 ease-salida group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="pb-5 max-w-3xl text-fg-muted leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
