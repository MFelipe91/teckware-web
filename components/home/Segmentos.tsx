import Link from 'next/link'
import { ArrowRight, Building2, Cpu } from 'lucide-react'
import { precioServicio } from '@/lib/constants'

// Los dos públicos además del cliente particular: pymes y gamers. Cada uno a su página.
const SEGMENTOS = [
  {
    icon: Building2,
    eyebrow: 'Empresas',
    titulo: 'Soporte informático para tu pyme',
    desc: 'Mantención preventiva de los equipos de tu oficina, asesoría, automatización con IA, desarrollo web y ciberseguridad. Plan por escrito y boleta.',
    href: '/empresas',
    cta: 'Ver soluciones para empresas',
    accent: 'brand',
  },
  {
    icon: Cpu,
    eyebrow: 'PC Gamer',
    titulo: 'Armamos tu PC gamer',
    desc: `Armado con cable management, pruebas de estrés y control de temperaturas. Desde ${precioServicio('armado-estandar')}, o un build completo a tu medida.`,
    href: '/builds',
    cta: 'Ver builds y armado',
    accent: 'gamer',
  },
] as const

export function Segmentos() {
  return (
    <section className="bg-ink-900 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
        {SEGMENTOS.map(({ icon: Icon, eyebrow, titulo, desc, href, cta, accent }) => (
          <Link
            key={href}
            href={href}
            className={`group relative overflow-hidden flex flex-col p-8 sm:p-10 rounded-2xl border bg-ink-800/60 transition-colors ${
              accent === 'gamer'
                ? 'border-gamer/25 hover:border-gamer/50'
                : 'border-brand-bright/20 hover:border-brand-bright/45'
            }`}
          >
            <div className={`${accent === 'gamer' ? 'glow-gamer' : 'glow-brand'} w-72 h-72 -top-24 -right-24 opacity-60`} aria-hidden="true" />
            <div className="relative">
              <p className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase ${accent === 'gamer' ? 'text-gamer-bright' : 'text-brand-bright'}`}>
                <Icon size={15} aria-hidden="true" />
                {eyebrow}
              </p>
              <h2 className="mt-4 text-fg text-2xl sm:text-3xl">{titulo}</h2>
              <p className="mt-3 text-fg-muted leading-relaxed max-w-lg">{desc}</p>
              <span className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accent === 'gamer' ? 'text-gamer-bright' : 'text-brand-bright'}`}>
                {cta}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
