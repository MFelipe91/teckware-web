const items = [
  '✓ Diagnóstico en el día',
  '✓ Formateo + instalación limpia',
  '✓ Mantenimiento físico completo',
  '✓ PC Gamer a medida',
  '✓ MacBook reparación',
  '✓ Consolas PS4 / PS5 / Xbox',
  '✓ Sin cobros ocultos',
  '✓ Garantía 30 días',
  '✓ Respuesta en 2 horas',
]

export function Ticker() {
  const doubled = [...items, ...items]

  return (
    <div
      className="bg-[#0D1120] border-y border-white/10 py-3 overflow-hidden"
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 mx-8 text-sm font-medium text-[#94A3B8]"
          >
            {item}
            <span className="text-[#00D4FF] opacity-40">|</span>
          </span>
        ))}
      </div>
    </div>
  )
}
