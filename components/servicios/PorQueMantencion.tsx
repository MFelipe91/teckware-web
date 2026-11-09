import { Gauge, MessagesSquare, Receipt, ShieldCheck, Thermometer, Wrench } from 'lucide-react'

// Lo esencial de la antigua página /mantencion (fusionada en /servicios): por qué conviene la
// mantención preventiva y cómo se trabaja. Solo datos reales del protocolo del dueño.
const PUNTOS = [
  { icon: Thermometer, titulo: 'Menos temperatura, menos fallas', desc: 'El calor es lo que más desgasta los componentes. Limpiar y renovar la pasta térmica lo mantiene bajo control.' },
  { icon: Gauge, titulo: 'Probado antes y después', desc: 'Lo testeamos con OCCT, FurMark, Superposition y CrystalDiskInfo al recibirlo y al entregarlo: se va estable y medido.' },
  { icon: Wrench, titulo: 'Más rendimiento y vida útil', desc: 'Sin polvo ni pasta seca, el equipo deja de bajar su velocidad por calor y dura más años.' },
  { icon: MessagesSquare, titulo: 'Te explicamos todo', desc: 'Sabes qué tenía tu equipo, qué hicimos y cuándo conviene volver a revisarlo.' },
  { icon: ShieldCheck, titulo: 'Garantía de 30 días', desc: 'Todos los trabajos tienen garantía. Si algo falla por nuestro trabajo, lo solucionamos.' },
  { icon: Receipt, titulo: 'Precio claro y boleta', desc: 'TECKWARE SpA: sabes el costo antes de empezar y recibes boleta por cada servicio.' },
]

export function PorQueMantencion() {
  return (
    <section className="halo px-4 sm:px-6 lg:px-8 py-12 sm:py-20" aria-labelledby="mantencion-titulo">
      <div className="max-w-[76rem] mx-auto">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
          <div>
            <p className="antetitulo">Mantención preventiva</p>
            <h2 id="mantencion-titulo" className="mt-3 text-fg">
              Por qué mantener tu equipo <span className="acento">a tiempo</span>
            </h2>
          </div>
          <p className="text-fg-muted leading-relaxed lg:pb-1">
            La mayoría de las fallas no llegan de golpe: el polvo tapa los ventiladores, la pasta térmica se seca y el equipo se calienta, se pone lento o se apaga solo. Una mantención a tiempo es más barata que una reparación. Para la mayoría de los equipos, conviene una vez al año; con mucho uso o polvo, cada 6 a 8 meses.
          </p>
        </div>

        {/* En celular las razones se deslizan de lado, como los pasos del proceso. */}
        <ul className="mt-8 sm:mt-10 -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 sm:grid sm:gap-4 sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
          {PUNTOS.map(({ icon: Icon, titulo, desc }) => (
            <li key={titulo} className="tarjeta shrink-0 basis-[80%] snap-start p-5 sm:basis-auto sm:p-6">
              <Icon size={30} strokeWidth={1.6} className="text-cian" aria-hidden="true" />
              <h3 className="mt-4 text-fg">{titulo}</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
