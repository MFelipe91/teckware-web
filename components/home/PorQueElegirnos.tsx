import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { EMPRESA, POR_QUE_ELEGIRNOS } from '@/lib/constants'
import { STOCK } from '@/lib/fotos'

// Maqueta B: texto a la izquierda, foto de trabajo técnico al centro y lista de razones a la derecha.
export function PorQueElegirnos() {
  return (
    <section className="relative overflow-hidden bg-ink-950 border-y border-white/10" aria-labelledby="porque-titulo">
      <div className="max-w-[76rem] mx-auto grid lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,3.4fr)] lg:items-center">
        <div className="px-4 sm:px-6 lg:px-8 pt-12 lg:py-16">
          <p className="antetitulo">¿Por qué elegir TECKWARE?</p>
          <h2 id="porque-titulo" className="mt-3 text-fg">
            Experiencia, confianza y <span className="acento">tecnología</span>
          </h2>
          <p className="mt-5 text-fg-muted leading-relaxed">
            {EMPRESA.responsable}, {EMPRESA.tituloProfesional}, se hace cargo de cada trabajo: diagnóstico con método, precio claro antes de empezar y tu equipo de vuelta probado.
          </p>
          <Link href="/nosotros" className="btn btn-secundario mt-6 w-full sm:w-auto">
            Conoce más sobre nosotros <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mt-8 aspect-[16/9] lg:mt-0 lg:aspect-auto lg:h-full lg:min-h-[26rem]">
          <Image src={STOCK.tecnico.src} alt={STOCK.tecnico.alt} fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40 lg:bg-gradient-to-r lg:from-ink-950 lg:via-transparent lg:to-ink-950" aria-hidden="true" />
        </div>

        <ul className="px-4 sm:px-6 lg:px-8 py-8 lg:py-16 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-1 lg:gap-4">
          {POR_QUE_ELEGIRNOS.map((item) => (
            <li key={item.titulo} className="flex items-start gap-3">
              <CircleCheck size={24} strokeWidth={1.75} className="text-cian shrink-0" aria-hidden="true" />
              <span className="text-lg text-fg leading-snug">{item.titulo}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
