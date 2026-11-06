import Link from 'next/link'
import { IVA_NOTA } from '@/lib/constants'
import type { Servicio } from '@/lib/services'
import { WA } from '@/lib/whatsapp'

function enlaceWa(s: Servicio): string {
  const fn = WA[s.whatsappKey as keyof typeof WA]
  return typeof fn === 'function' ? (fn as () => string)() : WA.servicio(s.nombre)
}

// Lo que el título de la portada ya muestra con precio (PC gamer, notebook, PS5 y armado) no se repite.
const EN_PORTADA = ['mantencion-full', 'consola-ps5', 'armado-estandar']
// Primero lo que más conviene mostrar; el resto, según lo destacado en el panel.
const PRIMERO = ['mantencion-logica', 'diagnostico', 'mantencion-gpu']

export function ServiciosDestacados({ servicios }: { servicios: Servicio[] }) {
  const disponibles = servicios.filter((s) => !EN_PORTADA.includes(s.id))
  const prioritarios = PRIMERO
    .map((id) => disponibles.find((s) => s.id === id))
    .filter((s): s is Servicio => !!s)
  const extras = disponibles.filter((s) => s.featured && !prioritarios.includes(s))
  const lista = [...prioritarios, ...extras].slice(0, 4)
  if (!lista.length) return null

  return (
    <section className="bg-ink-900 px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
      <div className="max-w-[76rem] mx-auto grid gap-8 lg:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="text-fg">Otros servicios con precio fijo</h2>
          <p className="mt-4 text-fg-muted max-w-md">Sabes el costo antes de que empecemos. {IVA_NOTA}</p>
          <Link href="/servicios" className="btn btn-terciario mt-4 max-lg:hidden">Ver todos los servicios</Link>
        </div>

        <div>
          <ul className="border-t border-white/10">
            {lista.map((s, i) => (
              <li key={s.id} className={`py-5 border-b border-white/10 ${i >= 3 ? "max-sm:hidden" : ""} grid gap-x-6 gap-y-2 grid-cols-[minmax(0,1fr)_auto]`}>
                <h3 className="text-fg">{s.nombre}</h3>
                <span className="price text-xl text-fg text-right">{s.precio}</span>
                <p className="text-sm text-fg-muted leading-relaxed max-sm:hidden">{s.descripcion}</p>
                <a href={enlaceWa(s)} target="_blank" rel="noopener noreferrer" className="btn btn-terciario justify-self-end self-start max-sm:col-span-2 max-sm:justify-self-start" aria-label={`Cotizar ${s.nombre}`}>
                  Cotizar
                </a>
              </li>
            ))}
          </ul>
          <Link href="/servicios" className="btn btn-terciario mt-4 lg:hidden">Ver todos los servicios</Link>
        </div>
      </div>
    </section>
  )
}
