'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const CYAN = 0x00d4ff
const CYAN_DIM = 0x00a8cc
const PURPLE = 0xa855f7
const BG = 0x03040a

const PARTICLE_COUNT = 3000

/** Detecta soporte WebGL sin dejar el contexto colgando. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    if (!hasWebGL()) {
      setFailed(true)
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ─── Escena y cámara ──────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(BG)

    // Mide el contenedor; nunca devuelve 0 (un canvas de 0px queda inservible)
    const measure = () => {
      const r = mount.getBoundingClientRect()
      return {
        w: Math.max(1, Math.round(r.width) || mount.clientWidth || window.innerWidth || 1),
        h: Math.max(1, Math.round(r.height) || mount.clientHeight || window.innerHeight || 1),
      }
    }

    const first = measure()
    let width = first.w
    let height = first.h

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 8)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setSize(width, height)
    renderer.setClearColor(BG, 1)
    mount.appendChild(renderer.domElement)

    // ─── Luces ────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a0a1a, 1))

    const keyLight = new THREE.PointLight(CYAN, 2, 60)
    keyLight.position.set(-6, 5, 6)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(PURPLE, 1.5, 60)
    fillLight.position.set(6, -5, 4)
    scene.add(fillLight)

    // ─── Grid de fondo (plano Z = -5) ────────────────────────────────
    const grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff)
    grid.rotation.x = Math.PI / 2
    grid.position.z = -5
    const gridMat = grid.material as THREE.LineBasicMaterial
    gridMat.transparent = true
    gridMat.opacity = 0.035
    scene.add(grid)

    // ─── Grupo raíz (escala responsive) ──────────────────────────────
    const root = new THREE.Group()
    scene.add(root)

    const mat = (color: number, opacity = 1) =>
      new THREE.MeshPhongMaterial({
        color,
        wireframe: true,
        transparent: opacity < 1,
        opacity,
      })

    // ─── CPU: caja con pines en la base ──────────────────────────────
    const cpu = new THREE.Group()
    const cpuBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.2, 1.3, 4, 1, 4), mat(CYAN))
    cpu.add(cpuBody)

    const cpuDie = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), mat(CYAN, 0.75))
    cpuDie.position.y = 0.14
    cpu.add(cpuDie)

    // Pines: filas delgadas bajo el encapsulado
    const pinGeo = new THREE.BoxGeometry(1.15, 0.06, 0.045)
    for (let i = 0; i < 7; i++) {
      const pin = new THREE.Mesh(pinGeo, mat(CYAN_DIM, 0.55))
      pin.position.set(0, -0.15, -0.45 + i * 0.15)
      cpu.add(pin)
    }
    cpu.position.set(-2.4, 0.5, 0)
    cpu.rotation.set(0.3, 0.5, 0)
    root.add(cpu)

    // ─── GPU: caja larga con ventiladores giratorios ─────────────────
    const gpu = new THREE.Group()
    const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.3, 1.2, 6, 1, 3), mat(PURPLE))
    gpu.add(gpuBody)

    const gpuBracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 1.15), mat(PURPLE, 0.7))
    gpuBracket.position.x = -1.44
    gpu.add(gpuBracket)

    const fans: THREE.Mesh[] = []
    const fanGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 12, 1, true)
    const bladeGeo = new THREE.BoxGeometry(0.72, 0.04, 0.11)
    for (let i = 0; i < 2; i++) {
      const fan = new THREE.Group()
      const ring = new THREE.Mesh(fanGeo, mat(PURPLE, 0.85))
      fan.add(ring)
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(bladeGeo, mat(CYAN, 0.6))
        blade.rotation.y = (b / 3) * Math.PI * 2
        fan.add(blade)
      }
      fan.position.set(-0.65 + i * 1.3, 0.18, 0)
      gpu.add(fan)
      fans.push(fan as unknown as THREE.Mesh)
    }
    gpu.position.set(1.9, -0.6, -0.4)
    gpu.rotation.set(0.35, -0.3, 0.05)
    root.add(gpu)

    // ─── RAM: módulos verticales delgados con chips ──────────────────
    const ramGroup = new THREE.Group()
    const stickGeo = new THREE.BoxGeometry(0.14, 1.15, 0.5, 1, 3, 1)
    const chipGeo = new THREE.BoxGeometry(0.16, 0.16, 0.1)
    for (let i = 0; i < 4; i++) {
      const stick = new THREE.Group()
      stick.add(new THREE.Mesh(stickGeo, mat(CYAN_DIM)))
      for (let c = 0; c < 3; c++) {
        const chip = new THREE.Mesh(chipGeo, mat(CYAN, 0.7))
        chip.position.set(0, 0.32 - c * 0.32, 0.26)
        stick.add(chip)
      }
      stick.position.x = i * 0.3
      ramGroup.add(stick)
    }
    ramGroup.position.set(0.1, 1.7, 0.4)
    ramGroup.rotation.set(0.2, 0.35, 0.08)
    root.add(ramGroup)

    // ─── Placa madre: plano wireframe de base ────────────────────────
    const board = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 5.5, 12, 9),
      mat(CYAN_DIM, 0.22)
    )
    board.rotation.x = -Math.PI / 2.6
    board.position.set(0, -2.2, -1.2)
    root.add(board)

    // ─── Partículas: datos fluyendo entre componentes ────────────────
    const anchors = [
      new THREE.Vector3(-2.4, 0.5, 0), // CPU
      new THREE.Vector3(1.9, -0.6, -0.4), // GPU
      new THREE.Vector3(0.55, 1.7, 0.4), // RAM
      new THREE.Vector3(0, -2.2, -1.2), // placa
    ]

    const positions = new Float32Array(PARTICLE_COUNT * 3)
    // Curva cuadrática por partícula: p0 -> control -> p2
    const p0 = new Float32Array(PARTICLE_COUNT * 3)
    const p1 = new Float32Array(PARTICLE_COUNT * 3)
    const p2 = new Float32Array(PARTICLE_COUNT * 3)
    const tArr = new Float32Array(PARTICLE_COUNT)
    const speed = new Float32Array(PARTICLE_COUNT)

    const jitter = () => (Math.random() - 0.5) * 0.9

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const a = anchors[(Math.random() * anchors.length) | 0]
      let b = anchors[(Math.random() * anchors.length) | 0]
      if (a === b) b = anchors[(anchors.indexOf(a) + 1) % anchors.length]

      const i3 = i * 3
      p0[i3] = a.x + jitter()
      p0[i3 + 1] = a.y + jitter()
      p0[i3 + 2] = a.z + jitter()

      p2[i3] = b.x + jitter()
      p2[i3 + 1] = b.y + jitter()
      p2[i3 + 2] = b.z + jitter()

      // Punto de control desplazado -> trayectoria curva
      p1[i3] = (p0[i3] + p2[i3]) / 2 + (Math.random() - 0.5) * 3
      p1[i3 + 1] = (p0[i3 + 1] + p2[i3 + 1]) / 2 + (Math.random() - 0.5) * 3
      p1[i3 + 2] = (p0[i3 + 2] + p2[i3 + 2]) / 2 + (Math.random() - 0.5) * 2.5

      tArr[i] = Math.random()
      speed[i] = 0.05 + Math.random() * 0.12

      positions[i3] = p0[i3]
      positions[i3 + 1] = p0[i3 + 1]
      positions[i3 + 2] = p0[i3 + 2]
    }

    const particleGeo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(positions, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    particleGeo.setAttribute('position', posAttr)

    const particleMat = new THREE.PointsMaterial({
      color: CYAN,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    root.add(particles)

    // ─── Post-procesado: bloom ────────────────────────────────────────
    const composer = new EffectComposer(renderer)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    composer.setSize(width, height)
    composer.addPass(new RenderPass(scene, camera))

    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.8, 0.3)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    // ─── Escala responsive ────────────────────────────────────────────
    const applyScale = () => {
      const s = width < 640 ? 0.55 : width < 1024 ? 0.75 : 1
      root.scale.setScalar(s)
    }
    applyScale()

    // ─── Parallax con el mouse ────────────────────────────────────────
    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    // ─── Resize con debounce (observa el contenedor, no solo la ventana) ──
    let resizeTimer: ReturnType<typeof setTimeout> | undefined

    const applySize = () => {
      const m = measure()
      if (m.w === width && m.h === height) return
      width = m.w
      height = m.h
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      composer.setSize(width, height)
      bloom.setSize(width, height)
      applyScale()
      if (reducedMotion) composer.render()
    }

    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(applySize, 150)
    }

    // ResizeObserver capta también el caso de montar con tamaño 0
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)
    window.addEventListener('resize', onResize)

    // ─── Loop de animación ────────────────────────────────────────────
    // Timer (no Clock): getElapsed/getDelta son lecturas estables tras update().
    // Clock.getElapsedTime() consume el delta y dejaría las partículas congeladas.
    const timer = new THREE.Timer()
    let raf = 0
    let running = false
    let onScreen = true

    const renderFrame = () => {
      if (!running) return
      // Contenedor aún sin layout: no gastar GPU hasta que tenga tamaño
      if (width <= 1 || height <= 1) {
        raf = requestAnimationFrame(renderFrame)
        return
      }

      timer.update()
      const t = timer.getElapsed()

      // Flotación senoidal independiente
      cpu.position.y = 0.5 + Math.sin(t + 0) * 0.3
      gpu.position.y = -0.6 + Math.sin(t + 1.6) * 0.3
      ramGroup.position.y = 1.7 + Math.sin(t + 3.1) * 0.3
      board.position.y = -2.2 + Math.sin(t + 4.4) * 0.15

      // GPU rota lento en su eje Y
      gpu.rotation.y = -0.3 + t * 0.18

      // Ventiladores
      for (let i = 0; i < fans.length; i++) fans[i].rotation.y = t * (2.4 + i * 0.4)

      // CPU pulsa 0.98 - 1.02
      const pulse = 1 + Math.sin(t * 2.2) * 0.02
      cpu.scale.setScalar(pulse)
      cpu.rotation.y = 0.5 + Math.sin(t * 0.3) * 0.15

      // RAM: giro suave
      ramGroup.rotation.y = 0.35 + Math.sin(t * 0.4) * 0.2

      // Partículas sobre curva cuadrática de Bézier
      const arr = posAttr.array as Float32Array
      const dt = Math.min(timer.getDelta(), 0.05)
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let u = tArr[i] + speed[i] * dt
        if (u > 1) u -= 1
        tArr[i] = u

        const inv = 1 - u
        const a = inv * inv
        const b = 2 * inv * u
        const c = u * u
        const i3 = i * 3

        arr[i3] = a * p0[i3] + b * p1[i3] + c * p2[i3]
        arr[i3 + 1] = a * p0[i3 + 1] + b * p1[i3 + 1] + c * p2[i3 + 1]
        arr[i3 + 2] = a * p0[i3 + 2] + b * p1[i3 + 2] + c * p2[i3 + 2]
      }
      posAttr.needsUpdate = true

      // Parallax suave de cámara
      pointer.x += (target.x - pointer.x) * 0.045
      pointer.y += (target.y - pointer.y) * 0.045
      camera.position.x = pointer.x * 0.9
      camera.position.y = -pointer.y * 0.55
      camera.lookAt(0, 0, 0)

      composer.render()
      raf = requestAnimationFrame(renderFrame)
    }

    // ─── Arranque / pausa ─────────────────────────────────────────────
    const start = () => {
      if (running || reducedMotion) return
      running = true
      raf = requestAnimationFrame(renderFrame)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    if (reducedMotion) {
      // Un solo frame estático: sin movimiento, pero la escena se ve
      composer.render()
    } else {
      start()
    }

    // Pausa el render (three.js + bloom es caro) cuando el hero sale de pantalla
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false
        if (onScreen && document.visibilityState === 'visible') start()
        else stop()
      },
      { rootMargin: '100px' }
    )
    io.observe(mount)

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && onScreen) start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ─── Limpieza ─────────────────────────────────────────────────────
    return () => {
      stop()
      clearTimeout(resizeTimer)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)

      scene.traverse((obj) => {
        const anyObj = obj as THREE.Mesh | THREE.Points | THREE.LineSegments
        if (anyObj.geometry) anyObj.geometry.dispose()
        const m = anyObj.material
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose())
        else if (m) m.dispose()
      })

      bloom.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.forceContextLoss()

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Fallback sin WebGL: fondo estático equivalente en CSS
  if (failed) {
    return (
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 25% 30%, rgba(0,212,255,0.10), transparent 55%),' +
            'radial-gradient(ellipse at 75% 70%, rgba(168,85,247,0.10), transparent 55%),' +
            '#03040A',
        }}
        aria-hidden="true"
      />
    )
  }

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
}
