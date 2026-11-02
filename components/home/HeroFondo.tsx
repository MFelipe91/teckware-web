import Image from 'next/image'

// Fondo del título: el hexágono del logo como ventana al interior de un PC, con las trazas de
// circuito del propio logo. Todo es decorativo: el título no depende de que esto cargue.

// El hexágono usa las mismas proporciones de public/brand/isotipo.svg, en una caja de 476 x 550.
const HEXAGONO = '238,0 476,137.5 476,412.5 238,550 0,412.5 0,137.5'
const HEXAGONO_INTERIOR = '238,16 462,145.5 462,404.5 238,534 14,404.5 14,145.5'

// Salen del borde inferior izquierdo y corren bajo el título, sin cruzar el texto.
const TRAZAS = [
  { d: 'M48 440 L4 484 H-620', pad: [-627, 484] },
  { d: 'M70 453 L23 500 H-360', pad: [-367, 500] },
  { d: 'M20 424 L-24 468 H-170', pad: [-177, 468] },
] as const

// En celular el hexágono queda bajo el título y las trazas salen de su lado izquierdo.
const TRAZAS_MOVIL = [
  { d: 'M0 150 H-70 L-105 115 H-395', pad: [-409, 115] },
  { d: 'M0 200 H-40 L-70 170 H-235', pad: [-249, 170] },
] as const

export function HeroFondo() {
  return (
    <div className="hero-ventana" aria-hidden="true">
      <div className="hero-ventana-foto">
        <Image
          src="/images/pexels-alexandrep-junior-33798615.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 430px, 200px"
          quality={72}
          loading="eager"
          fetchPriority="high"
          className="hero-foto"
        />
      </div>
      <svg viewBox="0 0 476 550" className="hero-trazado" fill="none">
        <defs>
          <linearGradient id="hero-borde" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--color-silver)' }} />
            <stop offset="0.55" style={{ stopColor: 'var(--color-brand-bright)' }} />
            <stop offset="1" style={{ stopColor: 'var(--color-brand-deep)' }} />
          </linearGradient>
        </defs>
        <polygon points={HEXAGONO} stroke="url(#hero-borde)" strokeWidth="4" strokeLinejoin="round" />
        <polygon points={HEXAGONO_INTERIOR} className="hero-borde-interior" strokeWidth="1" />
        <g className="hero-trazas">
          {TRAZAS.map((t, i) => (
            <g key={t.d} style={{ '--i': i } as React.CSSProperties}>
              <path d={t.d} pathLength={1} className="hero-traza" strokeWidth="2" strokeLinejoin="round" />
              <circle cx={t.pad[0]} cy={t.pad[1]} r="7" className="hero-pad" strokeWidth="2" />
            </g>
          ))}
        </g>
        <g className="hero-trazas-movil">
          {TRAZAS_MOVIL.map((t, i) => (
            <g key={t.d} style={{ '--i': i } as React.CSSProperties}>
              <path d={t.d} pathLength={1} className="hero-traza" strokeWidth="5" strokeLinejoin="round" />
              <circle cx={t.pad[0]} cy={t.pad[1]} r="14" className="hero-pad" strokeWidth="5" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
