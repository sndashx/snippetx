"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface NeuralNetworkProps {
  /** Glow brightness multiplier (0–2). */
  intensity?: number
  /** Hue rotation in radians applied to the brand palette. */
  hueShift?: number
  className?: string
}

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;
uniform float uHueShift;

float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

vec3 hueShift(vec3 color, float a) {
  const vec3 k = vec3(0.57735);
  float c = cos(a);
  return color * c + cross(k, color) * sin(a) + k * dot(k, color) * (1.0 - c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = uv;
  p.x *= aspect;

  float t = uTime;
  const int N = 14;
  vec2 nodes[14];
  for (int i = 0; i < 14; i++) {
    float fi = float(i);
    float x = hash(fi * 1.7 + 0.3) + 0.05 * sin(t * 0.30 + fi);
    float y = hash(fi * 2.3 + 0.9) + 0.05 * cos(t * 0.27 + fi * 1.3);
    nodes[i] = vec2(x, y);
  }

  float glow = 0.0;
  for (int i = 0; i < 14; i++) {
    vec2 d = p - nodes[i];
    d.x *= aspect;
    float dist = length(d);
    glow += 0.010 / (dist * dist + 0.003);
  }

  for (int i = 0; i < 14; i++) {
    for (int j = 0; j < 14; j++) {
      if (j <= i) continue;
      vec2 a = nodes[i]; a.x *= aspect;
      vec2 b = nodes[j]; b.x *= aspect;
      vec2 pa = p - a; vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      float dseg = length(pa - ba * h);
      glow += 0.0008 / (dseg * dseg + 0.002);
    }
  }

  glow *= uIntensity;
  vec3 col = mix(vec3(0.36, 0.22, 0.85), vec3(0.20, 0.55, 0.95), uv.y);
  col = hueShift(col, uHueShift);
  vec3 finalc = col * glow;

  float edge = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x)
             * smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.82, uv.y);
  finalc *= edge;
  fragColor = vec4(finalc, 1.0);
}`

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function NeuralNetwork({ intensity = 1, hueShift = 0, className }: NeuralNetworkProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl2")
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, "aPos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, "uResolution")
    const uTime = gl.getUniformLocation(program, "uTime")
    const uInt = gl.getUniformLocation(program, "uIntensity")
    const uHue = gl.getUniformLocation(program, "uHueShift")

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const render = (time: number) => {
      resize()
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, time * 0.001)
      gl.uniform1f(uInt, intensity)
      gl.uniform1f(uHue, hueShift)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    if (reduce) {
      resize()
      render(0)
      return
    }

    let raf = 0
    const loop = (time: number) => {
      render(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [intensity, hueShift, reduce])

  return (
    <div className={cn("relative h-full w-full", className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 50% at 25% 30%, color-mix(in oklch, var(--brand-1) 50%, transparent), transparent 70%), radial-gradient(45% 55% at 75% 70%, color-mix(in oklch, var(--brand-3) 45%, transparent), transparent 70%), radial-gradient(50% 60% at 50% 50%, color-mix(in oklch, var(--brand-2) 40%, transparent), transparent 70%)",
          filter: `hue-rotate(${hueShift}rad) blur(40px)`,
          opacity: Math.min(1, intensity),
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
