"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { FRAGMENT_SHADER, VERTEX_SHADER, hexToRgb } from "@/components/marketing/hero-shader"

/**
 * HeroCanvas — signature shader-grade centerpiece for the lab homepage.
 *
 * Renders a single full-screen <canvas> with a domain-warped noise fragment
 * shader on top of the brand ink (#070708), tinted with the accent (#c8ff00).
 * The effect is intentionally slow, painterly, and "expensive-looking".
 *
 * Performance & lifecycle:
 *  - Capped at ~30fps via requestAnimationFrame throttling.
 *  - Pauses when document.hidden (visibilitychange).
 *  - Pauses when off-screen via IntersectionObserver.
 *  - Honors prefers-reduced-motion (single static frame).
 *  - Lazy-mounted after first paint using requestIdleCallback (falls back to
 *    a setTimeout) so it never blocks LCP.
 *  - Falls back to a static gradient if WebGL2 is unavailable.
 *  - devicePixelRatio-aware, resize-safe, no layout thrash.
 *  - Pointer-events disabled — strictly decorative.
 */
export function HeroCanvas({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* SSR-safe fallback (used when WebGL/reduced-motion). */}
      <StaticFallback />
      {/* Client island — lazy mounts after first paint. */}
      <WebGLIsland />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Static fallback                                                           */
/* -------------------------------------------------------------------------- */

function StaticFallback() {
  return (
    <>
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute left-1/2 top-[-15%] size-[120%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 38%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 72%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute right-[-20%] bottom-[-30%] size-[70%]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--brand-2) 10%, transparent), transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 grain opacity-[0.16] mix-blend-soft-light" />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  WebGL island                                                              */
/* -------------------------------------------------------------------------- */

type WebGLState = {
  gl: WebGL2RenderingContext
  prog: WebGLProgram
  vs: WebGLShader
  fs: WebGLShader
  vao: WebGLVertexArrayObject
  uTime: WebGLUniformLocation | null
  uRes: WebGLUniformLocation | null
  uAspect: WebGLUniformLocation | null
  uAccent: WebGLUniformLocation | null
  uInk: WebGLUniformLocation | null
  uIntensity: WebGLUniformLocation | null
}

function WebGLIsland() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  // Live refs read by the rAF loop without re-creating it.
  const visibleRef = React.useRef(true)
  const reducedRef = React.useRef(false)
  const supportedRef = React.useRef(true)
  const stateRef = React.useRef<WebGLState | null>(null)

  const [reduced, setReduced] = React.useState(false)
  const [supported, setSupported] = React.useState(true)

  // Reduced-motion detection (client only).
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => {
      const v = mq.matches
      setReduced(v)
      reducedRef.current = v
    }
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  // Lazy-mount after first paint via requestIdleCallback.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    let cancelled = false
    const cb = () => {
      if (!cancelled) setMounted(true)
    }
    type IdleWindow = Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number
      cancelIdleCallback?: (id: number) => void
    }
    const w = window as IdleWindow
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(cb, { timeout: 1200 })
      return () => {
        cancelled = true
        w.cancelIdleCallback?.(id)
      }
    }
    const id = window.setTimeout(cb, 250)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [])

  // Feature-detect WebGL2 (deferred to next macrotask to avoid cascading renders).
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const id = window.setTimeout(() => {
      try {
        const test = document.createElement("canvas")
        const gl =
          test.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
          test.getContext("webgl2")
        const ok = !!gl
        supportedRef.current = ok
        setSupported(ok)
      } catch {
        supportedRef.current = false
        setSupported(false)
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  // IntersectionObserver — pause when off-screen.
  React.useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      visibleRef.current = true
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visibleRef.current = e.isIntersecting
      },
      { rootMargin: "50px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // WebGL setup + render loop — only when actually allowed to run.
  React.useEffect(() => {
    if (!mounted) return
    if (!supported) return
    if (reduced) return

    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
      desynchronized: true,
    })
    if (!gl) {
      setSupported(false)
      supportedRef.current = false
      return
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(
          "[hero-canvas] shader compile error:",
          gl.getShaderInfoLog(sh),
        )
        gl.deleteShader(sh)
        return null
      }
      return sh
    }
    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(
        "[hero-canvas] program link error:",
        gl.getProgramInfoLog(prog),
      )
      return
    }
    gl.useProgram(prog)

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)
    const vbo = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, "u_time")
    const uRes = gl.getUniformLocation(prog, "u_resolution")
    const uAspect = gl.getUniformLocation(prog, "u_aspect")
    const uAccent = gl.getUniformLocation(prog, "u_accent")
    const uInk = gl.getUniformLocation(prog, "u_ink")
    const uIntensity = gl.getUniformLocation(prog, "u_intensity")

    const accent = hexToRgb("#c8ff00")
    const ink = hexToRgb("#070708")
    gl.uniform3f(uAccent, accent[0], accent[1], accent[2])
    gl.uniform3f(uInk, ink[0], ink[1], ink[2])
    gl.uniform1f(uIntensity, 1.0)

    const state: WebGLState = {
      gl,
      prog,
      vs,
      fs,
      vao,
      uTime,
      uRes,
      uAspect,
      uAccent,
      uInk,
      uIntensity,
    }
    stateRef.current = state

    const DPR_CAP = 1.5
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const pw = Math.max(1, Math.round(w * dpr))
      const ph = Math.max(1, Math.round(h * dpr))
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }
      gl.viewport(0, 0, pw, ph)
      gl.uniform2f(uRes, pw, ph)
      gl.uniform1f(uAspect, pw / ph)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const start = performance.now()
    const FPS = 30
    const FRAME_MS = 1000 / FPS
    let raf = 0
    let last = 0

    const frame = (now: number) => {
      const hidden = document.hidden || !visibleRef.current
      if (!hidden && now - last >= FRAME_MS) {
        last = now
        const t = (now - start) / 1000
        gl.uniform1f(uTime, t)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      raf = window.requestAnimationFrame(frame)
    }
    raf = window.requestAnimationFrame(frame)

    return () => {
      window.cancelAnimationFrame(raf)
      ro.disconnect()
      gl.deleteBuffer(vbo)
      gl.deleteVertexArray(vao)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      stateRef.current = null
    }
  }, [mounted, supported, reduced])

  // Don't render the canvas at all when we shouldn't run it.
  if (reduced || !supported) return null

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      style={{ contain: "strict" }}
      data-hero-canvas-island=""
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-700",
          mounted ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
      {/* Subtle editorial overlays on top of the shader. */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 grain opacity-[0.14] mix-blend-soft-light"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 55%, color-mix(in oklch, var(--background) 92%, transparent) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}