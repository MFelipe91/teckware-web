// Cabecera de las páginas internas: titular plateado alineado a la izquierda. El texto llega
// visible en el HTML, así el H1 es el LCP.
export function PageHeader({
  titulo,
  bajada,
  children,
}: {
  titulo: string
  bajada?: string
  children?: React.ReactNode
}) {
  return (
    <section className="bg-ink-950 border-b border-white/8 px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-12 sm:pb-14">
      <div className="max-w-[76rem] mx-auto">
        <h1 className="max-w-5xl text-[clamp(2.25rem,5vw,4.5rem)]">{titulo}</h1>
        {bajada && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">{bajada}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
