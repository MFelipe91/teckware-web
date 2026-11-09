import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Laptop, Monitor, Gamepad2, Tablet, Apple, Receipt, Check, ChevronDown, Info, ShieldCheck,
} from 'lucide-react'
import {
  SERVICIOS_ADICIONALES, EQUIPOS, IVA_NOTA, PLAZO, precioServicio,
  CONDICIONES_GENERALES, SERVICIO_CONDICIONES,
} from '@/lib/constants'
import { getServices } from '@/lib/services'
import { WA } from '@/lib/whatsapp'
import { BLUR_DARK } from '@/lib/imageBlur'
import { ogPagina } from '@/lib/seo'
import { faqLd } from '@/lib/structured-data'
import { STOCK } from '@/lib/fotos'
import { HeroInterior } from '@/components/shared/HeroInterior'
import { CtaPair } from '@/components/shared/CtaPair'
import { ListaFaq } from '@/components/shared/ListaFaq'
import { BandaCta } from '@/components/shared/BandaCta'
import { TrustBar } from '@/components/home/TrustBar'
import { ServiciosGrid } from '@/components/home/ServiciosGrid'
import { Proceso } from '@/components/home/Proceso'
import { PorQueMantencion } from '@/components/servicios/PorQueMantencion'

// Revalida cada 30s para reflejar cambios de precios/servicios del panel admin
export const revalidate = 30

// /servicios reúne también lo que era /mantencion (redirige aquí, ver next.config.ts).
export const metadata: Metadata = {
  title: 'Servicio técnico y mantención de computadores en La Serena',
  description:
    'Mantención de PC gamer, notebooks y PS5, formateo, diagnóstico y armado en La Serena y Coquimbo. Precios con IVA, boleta y garantía de 30 días.',
  alternates: { canonical: '/servicios' },
  openGraph: ogPagina('/servicios'),
}

const EQUIPO_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'laptop': Laptop,
  'apple': Apple,
  'monitor': Monitor,
  'monitor-smartphone': Monitor,
  'gamepad-2': Gamepad2,
  'tablet-smartphone': Tablet,
}

const FAQS = [
  { q: '¿Cada cuánto conviene hacer mantención?', a: 'Para la mayoría de los equipos, una vez al año. Si hay mucho polvo, mascotas o el equipo trabaja muchas horas con carga (gaming, render), cada 6 a 8 meses.' },
  { q: '¿Qué diferencia hay entre mantención lógica y mantención full?', a: `La lógica es el software: formateo, instalación limpia del sistema y optimización (${precioServicio('mantencion-logica')}). La full suma la parte física: desarmado, limpieza interna, pasta térmica y pruebas (${precioServicio('mantencion-full')}).` },
  { q: '¿Cuánto demora?', a: `Se entrega en ${PLAZO} (lunes a viernes), con el diagnóstico real y un informe técnico de lo que encontramos e hicimos.` },
  { q: '¿Pierdo mis archivos?', a: 'En la mantención física no se tocan tus archivos. Si el servicio incluye formateo, primero respaldamos lo que necesites.' },
  { q: '¿Atienden a domicilio?', a: 'Preferimos trabajar en el taller, donde tenemos las herramientas para hacerlo bien. Para trabajos simples, como formateo, podemos ir a domicilio en La Serena y Coquimbo con un recargo según ubicación.' },
]

// Foto por servicio (por id). Fallback si alguno no tiene.
const SERVICE_IMAGES: Record<string, string> = {
  'diagnostico': '/images/diagnostico_tester.jpg',
  'mantencion-logica': '/images/Formateo_windows11.jpg',
  'mantencion-full': '/images/mantenimiento.jpg',
  'recuperacion-datos': '/images/recuperacion-datos.jpg',
  'mantencion-gpu': '/images/GPU001.jpg',
  'armado-estandar': '/images/pcgamer01.jpg',
  'armado-alta-gama': '/images/pc-montaje.jpg',
  'consola-ps4': '/images/ps5-consola.jpg',
  'consola-ps5': '/images/ps5-metal-liquido.jpg',
  'upgrade': '/images/upgraderamssd.jpg',
  'domicilio': '/images/mantencionpc2.jpg',
  'workstation': '/images/developer01.jpg',
}
const FALLBACK_IMG = '/images/hardware-amd.jpg'

function Detalle({ cond }: { cond: (typeof SERVICIO_CONDICIONES)[string] | undefined }) {
  return (
    <>
      {/* Qué incluye */}
      {cond?.incluye && (
        <ul className="space-y-1.5 mb-4">
          {cond.incluye.map((linea) => (
            <li key={linea} className="flex items-start gap-2 text-sm text-fg-muted leading-snug">
              <Check size={14} className="text-brand-bright shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>{linea}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Nota / condición específica */}
      {cond?.nota && (
        <p className="flex items-start gap-2 text-sm text-fg-subtle leading-relaxed mb-5 pt-3 border-t border-white/5">
          <Info size={13} className="text-fg-subtle shrink-0 mt-0.5" />
          <span>{cond.nota}</span>
        </p>
      )}
    </>
  )
}

export default async function ServiciosPage() {
  const SERVICIOS = await getServices()
  return (
    <div className="min-h-svh bg-ink-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(FAQS)) }} />

      <HeroInterior
        antetitulo="Servicios y precios"
        titulo={<>Servicio técnico y <span className="acento">mantención</span> de computadores en La Serena y Coquimbo</>}
        bajada="Mantención de PC gamer, notebooks y consolas, formateo, diagnóstico y armado. Precios con IVA incluido: sabes el costo antes de que empecemos."
        foto={STOCK.placa}
      >
        <CtaPair>
          <a href="#precios" className="btn btn-terciario self-start sm:self-auto">Ver precios</a>
        </CtaPair>
      </HeroInterior>
      <TrustBar />
      <PorQueMantencion />
      <ServiciosGrid id="equipos" antetitulo="Por tipo de equipo" titulo={<>¿Qué equipo quieres <span className="acento">mantener</span>?</>} empresas={false} ocultarEnCelular />

      <div id="precios" className="scroll-mt-20 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 text-center">
        <p className="antetitulo">Lista de precios</p>
        <h2 className="mt-3 text-fg">Precios <span className="acento">claros</span>, con IVA incluido</h2>
      </div>

      {/* Atajos: en celular la lista es larga, así se salta directo al servicio que interesa */}
      <nav
        aria-label="Ir a un servicio"
        className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-40 bg-ink-900/95 backdrop-blur border-b border-white/10"
      >
        <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto [scrollbar-width:none] py-2">
          {SERVICIOS.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="flex min-h-11 items-center rounded-full px-4 border border-white/12 bg-ink-800/60 text-sm text-fg-muted whitespace-nowrap hover:text-fg hover:border-brand-bright/50 active:bg-ink-700 transition-colors"
              >
                {s.nombre}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Servicios principales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-10 sm:pb-20">
        <div className="grid gap-4">
          {SERVICIOS.map((servicio) => {
            const img = SERVICE_IMAGES[servicio.id] ?? FALLBACK_IMG
            const cond = SERVICIO_CONDICIONES[servicio.id]
            const waLink = typeof WA[servicio.whatsappKey as keyof typeof WA] === 'function'
              ? (WA[servicio.whatsappKey as keyof typeof WA] as () => string)()
              : WA.servicio(servicio.nombre)
            return (
              <article
                key={servicio.id}
                id={servicio.id}
                className="tarjeta scroll-mt-36 p-5 sm:p-6 grid gap-5 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_200px] lg:gap-8"
              >
                <div className="relative h-36 overflow-hidden rounded max-md:hidden">
                  <Image
                    src={img}
                    alt={`${servicio.nombre} — TECKWARE La Serena`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 240px, (min-width: 768px) 200px, 100vw"
                    quality={72}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DARK}
                  />
                  </div>

                <div className="min-w-0">
                  <h2 className="text-2xl text-fg mb-2">{servicio.nombre}</h2>
                  <p className="text-sm text-fg-muted mb-4 leading-relaxed">{servicio.descripcion}</p>

                  {(cond?.incluye || cond?.nota) && (
                    <>
                      {/* En celular el detalle va plegado: la página no se hace eterna. */}
                      <details className="group md:hidden mb-4 border-y border-white/10">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-fg">
                          Qué incluye
                          <ChevronDown size={18} aria-hidden="true" className="text-fg-subtle transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                        </summary>
                        <div className="pb-3"><Detalle cond={cond} /></div>
                      </details>
                      <div className="hidden md:block"><Detalle cond={cond} /></div>
                    </>
                  )}

                  </div>

                <div className="flex items-center justify-between gap-4 md:col-start-2 lg:col-start-3 lg:flex-col lg:items-end lg:justify-start">
                    <div className="lg:text-right">
                      {servicio.precio === 'A cotizar' ? (
                        <span className="price text-xl text-fg block">A cotizar</span>
                      ) : (
                        <span className="price text-2xl text-fg block">{servicio.precio}</span>
                      )}
                      <span className="text-sm text-fg-subtle">{servicio.tiempo}</span>
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                    >
                      Solicitar
                    </a>
                </div>
              </article>
            )
          })}
        </div>

        {/* Condiciones generales */}
        <div className="tarjeta mt-10 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={18} className="text-brand-bright" />
            <h2 className="text-base font-bold text-fg">Condiciones generales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {CONDICIONES_GENERALES.map((c) => (
              <div key={c} className="flex items-start gap-2.5 text-sm text-fg-muted leading-snug">
                <Check size={15} className="text-brand-bright shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* IVA nota */}
        <div className="flex items-center gap-2 mt-6 text-sm text-fg-subtle">
          <Receipt size={13} />
          <span>{IVA_NOTA}</span>
        </div>
      </section>

      {/* Tech line separator */}
      
      {/* Servicios adicionales */}
      <section className="relative bg-ink-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[76rem] mx-auto">
          <h2 className="text-fg mb-2">Servicios adicionales</h2>
          <p className="text-fg-muted mb-10">Precio a cotizar según requerimiento.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {SERVICIOS_ADICIONALES.map((s) => (
              <div key={s} className="flex items-baseline gap-3 text-fg-muted">
                <span className="hex" aria-hidden="true" />
                {s}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={WA.general()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Consultar precio
            </a>
          </div>
        </div>
      </section>

      {/* Equipos atendidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div>
          <h2 className="text-fg mb-2">Equipos que atendemos</h2>
          <p className="text-fg-muted mb-10">Si tu equipo no está aquí, escríbenos igual.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5">
            {EQUIPOS.map((equipo) => {
              const Icon = EQUIPO_ICONS[equipo.icono] ?? Monitor
              return (
                <div
                  key={equipo.nombre}
                  className="flex items-center gap-3"
                >
                  <Icon size={20} className="text-brand-bright shrink-0" aria-hidden="true" />
                  <span className="text-sm text-fg-muted">{equipo.nombre}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <Proceso />
      <ListaFaq faqs={FAQS} />
      <BandaCta
        titulo="¿Hace cuánto no le haces mantención a tu equipo?"
        texto="Cuéntanos qué equipo tienes y cómo lo usas, y te decimos qué mantención le conviene y cuánto cuesta."
        waHref={WA.servicio('Mantención preventiva')}
      />
    </div>
  )
}
