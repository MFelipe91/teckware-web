import Link from 'next/link'
import { EMPRESA, POR_QUE_ELEGIRNOS } from '@/lib/constants'

export function PorQueElegirnos() {
  return (
    <section className="bg-ink-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <div className="max-w-[76rem] mx-auto grid gap-10 lg:gap-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <h2 className="text-fg">Quién trabaja en tu equipo</h2>
          <p className="mt-5 text-fg-muted leading-relaxed">
            {EMPRESA.responsable}, {EMPRESA.tituloProfesional}, se hace cargo de cada trabajo.
          </p>
          <Link href="/nosotros" className="btn btn-terciario mt-5">Conocer TECKWARE</Link>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2 border-t border-white/10">
          {POR_QUE_ELEGIRNOS.map((item) => (
            <li key={item.titulo} className="py-5 border-b border-white/10">
              <h3 className="text-[1.125rem] text-fg">{item.titulo}</h3>
              <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{item.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
