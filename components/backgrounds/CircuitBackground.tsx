'use client'

import { useEffect, useRef } from 'react'

/** Patrón visual del fondo. Cada página usa uno distinto para tener identidad propia. */
export type BgVariant =
  | 'circuit' // trazas PCB con pulsos de datos — hardware / servicios
  | 'grid-scan' // rejilla con barrido tipo radar — ciberseguridad
  | 'hex-mesh' // retícula hexagonal pulsante — builds / PC gamer
  | 'data-flow' // columnas de datos cayendo — web & QA
  | 'constellation' // nodos conectados a la distancia — nosotros / contacto

export type BgPalette = 'cyan' | 'purple' | 'red' | 'mixed'

interface CircuitBackgroundProps {
  variant?: BgVariant
  palette?: BgPalette
  /** Densidad relativa de elementos (0.5 = mitad, 2 = doble). */
  density?: number
  /** Opacidad global — subir/bajar según cuánto deba notarse tras el contenido. */
  opacity?: number
  className?: string
}

/** Prefijos rgba( sin cerrar: se concatena el alfa + ')'. */
const PALETTES: Record<BgPalette, string[]> = {
  cyan: ['rgba(0,212,255,', 'rgba(0,168,204,'],
  purple: ['rgba(168,85,247,', 'rgba(126,58,196,'],
  red: ['rgba(230,30,50,', 'rgba(249,115,22,'],
  mixed: ['rgba(0,212,255,', 'rgba(168,85,247,', 'rgba(0,168,204,'],
}

interface Point {
  x: number
  y: number
}

/** Contrato que cumple cada variante: construir la escena y pintar un frame. */
interface Scene {
  build: (w: number, h: number) => void
  draw: (t: number, dt: number, w: number, h: number) => void
}

type Ctx = CanvasRenderingContext2D

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(arr: T[]): T => arr[(Math.random() * arr.length) | 0]

/* ══════════════════════════════════════════════════════════════
   VARIANTE: circuit — trazas de placa madre con pulsos
   ══════════════════════════════════════════════════════════════ */
function circuitScene(ctx: Ctx, colors: string[], density: number): Scene {
  interface Trace {
    points: Point[]
    length: number
    cumulative: number[]
    color: string
  }
  interface Pulse {
    trace: number
    t: number
    speed: number
    size: number
  }

  let traces: Trace[] = []
  let pulses: Pulse[] = []
  let beam = -0.3

  const buildTrace = (w: number, h: number): Trace => {
    const points: Point[] = []
    let x = Math.random() * w
    let y = Math.random() * h
    points.push({ x, y })

    const segments = 3 + ((Math.random() * 4) | 0)
    let horizontal = Math.random() > 0.5
    for (let i = 0; i < segments; i++) {
      const step = rand(60, 240)
      if (horizontal) x += Math.random() > 0.5 ? step : -step
      else y += Math.random() > 0.5 ? step : -step
      x = Math.max(-40, Math.min(w + 40, x))
      y = Math.max(-40, Math.min(h + 40, y))
      points.push({ x, y })
      horizontal = !horizontal
    }

    const cumulative = [0]
    let length = 0
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      length += Math.hypot(dx, dy)
      cumulative.push(length)
    }
    return { points, length, cumulative, color: pick(colors) }
  }

  const pointAt = (tr: Trace, t: number): Point => {
    const target = t * tr.length
    for (let i = 1; i < tr.cumulative.length; i++) {
      if (target <= tr.cumulative[i]) {
        const segLen = tr.cumulative[i] - tr.cumulative[i - 1]
        const lt = segLen === 0 ? 0 : (target - tr.cumulative[i - 1]) / segLen
        const a = tr.points[i - 1]
        const b = tr.points[i]
        return { x: a.x + (b.x - a.x) * lt, y: a.y + (b.y - a.y) * lt }
      }
    }
    return tr.points[tr.points.length - 1]
  }

  return {
    build(w, h) {
      const count = Math.max(4, Math.round((w * h / 90000) * density))
      traces = Array.from({ length: count }, () => buildTrace(w, h))
      pulses = traces.map((_, i) => ({ trace: i, t: Math.random(), speed: rand(0.06, 0.16), size: rand(2, 3.5) }))
      traces.forEach((_, i) => {
        if (Math.random() > 0.6) pulses.push({ trace: i, t: Math.random(), speed: rand(0.05, 0.14), size: rand(1.5, 2.5) })
      })
    },
    draw(_t, dt, w, h) {
      ctx.lineWidth = 1
      for (const tr of traces) {
        ctx.beginPath()
        tr.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = tr.color + '0.14)'
        ctx.stroke()
        for (let i = 1; i < tr.points.length - 1; i++) {
          const p = tr.points[i]
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
          ctx.fillStyle = tr.color + '0.2)'
          ctx.fill()
        }
      }

      // Barrido de luz lateral
      const bx = beam * (w * 1.3) - w * 0.15
      const g = ctx.createLinearGradient(bx - 90, 0, bx + 90, 0)
      g.addColorStop(0, 'rgba(0,212,255,0)')
      g.addColorStop(0.5, 'rgba(0,212,255,0.05)')
      g.addColorStop(1, 'rgba(0,212,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(bx - 90, 0, 180, h)
      beam += dt * 0.1
      if (beam > 1.3) beam = -0.3

      for (const p of pulses) {
        p.t += p.speed * dt
        if (p.t > 1) p.t = 0
        const tr = traces[p.trace]
        if (!tr) continue
        const pt = pointAt(tr, p.t)
        const glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, p.size * 6)
        glow.addColorStop(0, tr.color + '0.85)')
        glow.addColorStop(1, tr.color + '0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, p.size * 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = tr.color + '1)'
        ctx.fill()
      }
    },
  }
}

/* ══════════════════════════════════════════════════════════════
   VARIANTE: grid-scan — rejilla con barrido de radar
   ══════════════════════════════════════════════════════════════ */
function gridScanScene(ctx: Ctx, colors: string[], density: number): Scene {
  const CELL = 46
  let markers: { x: number; y: number; phase: number }[] = []
  let scan = 0

  return {
    build(w, h) {
      const count = Math.max(3, Math.round((w * h / 150000) * density))
      markers = Array.from({ length: count }, () => ({
        x: (((Math.random() * w) / CELL) | 0) * CELL,
        y: (((Math.random() * h) / CELL) | 0) * CELL,
        phase: Math.random() * Math.PI * 2,
      }))
    },
    draw(t, dt, w, h) {
      const base = colors[0]

      // Rejilla
      ctx.lineWidth = 1
      ctx.strokeStyle = base + '0.07)'
      ctx.beginPath()
      for (let x = 0; x <= w; x += CELL) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = 0; y <= h; y += CELL) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()

      // Banda de barrido vertical
      scan += dt * 0.16
      if (scan > 1.25) scan = -0.25
      const sy = scan * h
      const band = ctx.createLinearGradient(0, sy - 70, 0, sy + 70)
      band.addColorStop(0, base + '0)')
      band.addColorStop(0.5, base + '0.09)')
      band.addColorStop(1, base + '0)')
      ctx.fillStyle = band
      ctx.fillRect(0, sy - 70, w, 140)

      // Línea nítida del barrido
      ctx.strokeStyle = base + '0.35)'
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(w, sy)
      ctx.stroke()

      // Marcadores tipo objetivo detectado
      for (const m of markers) {
        const near = 1 - Math.min(1, Math.abs(m.y - sy) / 130)
        const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2 + m.phase))
        const a = 0.1 + near * 0.55 * pulse
        ctx.strokeStyle = colors[1 % colors.length] + a.toFixed(3) + ')'
        ctx.lineWidth = 1
        ctx.strokeRect(m.x - 5, m.y - 5, 10, 10)
        if (near > 0.15) {
          ctx.fillStyle = colors[1 % colors.length] + (near * 0.5).toFixed(3) + ')'
          ctx.beginPath()
          ctx.arc(m.x, m.y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    },
  }
}

/* ══════════════════════════════════════════════════════════════
   VARIANTE: hex-mesh — retícula hexagonal con celdas que respiran
   ══════════════════════════════════════════════════════════════ */
function hexMeshScene(ctx: Ctx, colors: string[], density: number): Scene {
  const R = 34 // radio del hexágono
  interface Hex {
    cx: number
    cy: number
    phase: number
    lit: boolean
  }
  let hexes: Hex[] = []

  const path = (cx: number, cy: number) => {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6
      const x = cx + R * Math.cos(a)
      const y = cy + R * Math.sin(a)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  return {
    build(w, h) {
      hexes = []
      const dx = R * Math.sqrt(3)
      const dy = R * 1.5
      const litChance = 0.07 * density
      for (let row = 0; dy * row - R <= h + R; row++) {
        for (let col = 0; dx * col - R <= w + R; col++) {
          const cx = dx * col + (row % 2 ? dx / 2 : 0)
          const cy = dy * row
          hexes.push({ cx, cy, phase: Math.random() * Math.PI * 2, lit: Math.random() < litChance })
        }
      }
    },
    draw(t, _dt, w, _h) {
      ctx.lineWidth = 1
      const base = colors[0]

      for (const hx of hexes) {
        path(hx.cx, hx.cy)
        ctx.strokeStyle = base + '0.06)'
        ctx.stroke()
      }

      // Onda de brillo recorriendo el eje X
      const waveX = ((t * 90) % (w + 600)) - 300
      for (const hx of hexes) {
        const d = Math.abs(hx.cx - waveX)
        if (d < 220) {
          const a = (1 - d / 220) * 0.14
          path(hx.cx, hx.cy)
          ctx.strokeStyle = base + a.toFixed(3) + ')'
          ctx.stroke()
        }
      }

      // Celdas destacadas que respiran
      for (const hx of hexes) {
        if (!hx.lit) continue
        const breathe = 0.5 + 0.5 * Math.sin(t * 1.4 + hx.phase)
        const c = colors[1 % colors.length]
        path(hx.cx, hx.cy)
        ctx.fillStyle = c + (0.03 + breathe * 0.07).toFixed(3) + ')'
        ctx.fill()
        ctx.strokeStyle = c + (0.15 + breathe * 0.35).toFixed(3) + ')'
        ctx.stroke()
      }
    },
  }
}

/* ══════════════════════════════════════════════════════════════
   VARIANTE: data-flow — columnas de datos descendiendo
   ══════════════════════════════════════════════════════════════ */
function dataFlowScene(ctx: Ctx, colors: string[], density: number): Scene {
  interface Stream {
    x: number
    y: number
    len: number
    speed: number
    color: string
    bright: boolean
  }
  let streams: Stream[] = []

  return {
    build(w, h) {
      const count = Math.max(6, Math.round((w / 46) * density))
      streams = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: rand(50, 190),
        speed: rand(26, 95),
        color: pick(colors),
        bright: Math.random() > 0.72,
      }))
    },
    draw(_t, dt, _w, h) {
      ctx.lineWidth = 1
      for (const s of streams) {
        s.y += s.speed * dt
        if (s.y - s.len > h) {
          s.y = -rand(0, 120)
          s.len = rand(50, 190)
          s.speed = rand(26, 95)
        }

        const g = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y)
        const peak = s.bright ? 0.5 : 0.22
        g.addColorStop(0, s.color + '0)')
        g.addColorStop(1, s.color + peak.toFixed(3) + ')')
        ctx.strokeStyle = g
        ctx.beginPath()
        ctx.moveTo(s.x, s.y - s.len)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        // Cabeza luminosa del paquete
        if (s.bright) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 9)
          glow.addColorStop(0, s.color + '0.7)')
          glow.addColorStop(1, s.color + '0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(s.x, s.y, 9, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = s.color + (s.bright ? '0.95)' : '0.45)')
        ctx.fillRect(s.x - 0.75, s.y - 1.5, 1.5, 3)
      }
    },
  }
}

/* ══════════════════════════════════════════════════════════════
   VARIANTE: constellation — nodos que se enlazan al acercarse
   ══════════════════════════════════════════════════════════════ */
function constellationScene(ctx: Ctx, colors: string[], density: number): Scene {
  interface Node {
    x: number
    y: number
    vx: number
    vy: number
    r: number
  }
  let nodes: Node[] = []
  const LINK = 132

  return {
    build(w, h) {
      // Tope duro: el enlazado es O(n²), conviene mantenerlo acotado
      const count = Math.min(70, Math.max(12, Math.round((w * h / 26000) * density)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-9, 9),
        vy: rand(-9, 9),
        r: rand(1.2, 2.4),
      }))
    },
    draw(_t, dt, w, h) {
      for (const n of nodes) {
        n.x += n.vx * dt
        n.y += n.vy * dt
        if (n.x < -20) n.x = w + 20
        if (n.x > w + 20) n.x = -20
        if (n.y < -20) n.y = h + 20
        if (n.y > h + 20) n.y = -20
      }

      ctx.lineWidth = 1
      const link = colors[0]
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.hypot(dx, dy)
          if (d > LINK) continue
          const a = (1 - d / LINK) * 0.16
          ctx.strokeStyle = link + a.toFixed(3) + ')'
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }

      for (const n of nodes) {
        const c = colors[1 % colors.length]
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5)
        glow.addColorStop(0, c + '0.5)')
        glow.addColorStop(1, c + '0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = c + '0.8)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
    },
  }
}

const BUILDERS: Record<BgVariant, (ctx: Ctx, colors: string[], density: number) => Scene> = {
  circuit: circuitScene,
  'grid-scan': gridScanScene,
  'hex-mesh': hexMeshScene,
  'data-flow': dataFlowScene,
  constellation: constellationScene,
}

export function CircuitBackground({
  variant = 'circuit',
  palette = 'mixed',
  density = 1,
  opacity = 1,
  className = '',
}: CircuitBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const colors = PALETTES[palette]
    const scene = BUILDERS[variant](ctx, colors, density)

    let width = 0
    let height = 0
    let raf = 0
    let running = false
    let last = 0
    let elapsed = 0
    let onScreen = false

    const paint = (dt: number) => {
      ctx.clearRect(0, 0, width, height)
      scene.draw(elapsed, dt, width, height)
    }

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
      last = now
      elapsed += dt
      paint(dt)
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || reducedMotion) return
      running = true
      last = 0
      raf = requestAnimationFrame(frame)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      if (w === width && h === height) return
      width = w
      height = h
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scene.build(width, height)
      // Repinta de inmediato: evita un frame en blanco al montar o al redimensionar
      paint(0.016)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    // Solo anima mientras está en pantalla — permite varios fondos por página sin coste
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false
        if (onScreen && document.visibilityState === 'visible') start()
        else stop()
      },
      { rootMargin: '120px' }
    )
    io.observe(wrap)

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && onScreen) start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [variant, palette, density])

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
